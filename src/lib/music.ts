// Gum Mogul soundtrack: "Gum Mogul Overture", an original ~3 minute
// orchestral piece composed for this game and rendered from code to a
// WAV in the browser at first use, then looped by a plain audio element
// (the reliable playback path in every browser and webview).
//
// No audio files ship with the game and nothing is sampled: the score
// below (chords, phrases, sections) IS the piece, MIT like the rest.
//
// Arrangement: strings pads, piano arpeggios, pizz-style bass, a flute
// lead, cello in the bridge, glockenspiel sparkle in the reprise.
// 72 bars at 96 BPM in 4/4 = exactly 180 seconds.

const SAMPLE_RATE = 22050;
const BPM = 96;
const STEPS_PER_BAR = 8; // eighth-note grid
const STEP_SECONDS = 60 / BPM / 2;

type ChordName = "Am" | "F" | "C" | "G";
const CHORDS: Record<ChordName, number[]> = {
  Am: [57, 60, 64],
  F: [53, 57, 60],
  C: [48, 52, 55],
  G: [55, 59, 62],
};

// Flute phrases, MIDI note numbers per eighth step, 0 = rest. 8 bars each.
const PHRASE_A = [
  69, 72, 76, 81, 79, 76, 79, 81,
  77, 76, 77, 81, 84, 81, 77, 81,
  79, 76, 72, 76, 79, 84, 79, 76,
  74, 71, 74, 79, 76, 74, 71, 74,
  69, 72, 76, 81, 84, 81, 79, 76,
  77, 81, 84, 84, 84, 81, 77, 76,
  74, 76, 79, 84, 79, 76, 74, 76,
  72, 0, 76, 0, 79, 0, 76, 0,
];
const PHRASE_B = [
  76, 79, 84, 83, 81, 79, 76, 79,
  81, 79, 76, 74, 71, 74, 76, 74,
  72, 76, 79, 81, 79, 76, 72, 76,
  77, 81, 84, 81, 79, 77, 74, 71,
  76, 79, 84, 86, 84, 79, 81, 79,
  74, 76, 79, 81, 79, 76, 74, 71,
  69, 72, 76, 81, 79, 76, 74, 76,
  72, 0, 67, 0, 64, 0, 0, 0,
];

interface Section {
  chords: ChordName[];
  lead?: "A" | "B" | null;
  arp: boolean;
  arpVol: number;
  padVol: number;
  cello?: boolean;
  glock?: boolean;
  leadVol?: number;
}

const rep = (seq: ChordName[], n: number): ChordName[] => Array.from({ length: n }, () => seq).flat();

const SECTIONS: Section[] = [
  { chords: rep(["Am", "F", "C", "G"], 2), lead: null, arp: true, arpVol: 0.20, padVol: 0.07 },
  { chords: rep(["Am", "F", "C", "G"], 4), lead: "A", arp: true, arpVol: 0.13, padVol: 0.09 },
  { chords: rep(["C", "G", "Am", "F"], 4), lead: "B", arp: true, arpVol: 0.13, padVol: 0.09 },
  { chords: ["Am", "Am", "F", "F", "C", "C", "G", "G"], lead: null, arp: true, arpVol: 0.10, padVol: 0.08, cello: true },
  { chords: rep(["Am", "F", "C", "G"], 4), lead: "A", arp: true, arpVol: 0.13, padVol: 0.09, glock: true },
  { chords: rep(["Am", "F", "C", "G"], 2), lead: "A", arp: true, arpVol: 0.16, padVol: 0.08, leadVol: 0.22 },
];

const midiHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const renderOvertureUrl = (): string => {
  const totalBars = SECTIONS.reduce((n, s) => n + s.chords.length, 0);
  const sps = Math.round(SAMPLE_RATE * STEP_SECONDS);
  const total = totalBars * STEPS_PER_BAR * sps;
  const buf = new Float32Array(total);

  // Additive synth voice. partials: [harmonic, weight][]
  const addNote = (
    startStep: number, midi: number, lenSteps: number,
    partials: [number, number][], vol: number,
    attackSteps: number, vibrato = false,
  ) => {
    const start = Math.round(startStep * sps);
    const dur = Math.floor(lenSteps * sps);
    const freq = midiHz(midi);
    for (let i = 0; i < dur; i++) {
      const idx = start + i;
      if (idx >= total) break;
      const t = i / SAMPLE_RATE;
      const attack = Math.min(1, i / Math.max(1, attackSteps * sps));
      const release = Math.min(1, (dur - i) / (sps * 1.2));
      const env = Math.min(attack, release);
      const vib = vibrato && t > 0.12 ? 1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * t) : 1;
      let v = 0;
      for (const [h, w] of partials) v += Math.sin(2 * Math.PI * freq * h * vib * t) * w;
      buf[idx] += v * vol * env;
    }
  };
  const addPluck = (startStep: number, midi: number, vol: number, partials: [number, number][]) => {
    const start = Math.round(startStep * sps);
    const dur = Math.floor(sps * 1.6);
    const freq = midiHz(midi);
    for (let i = 0; i < dur; i++) {
      const idx = start + i;
      if (idx >= total) break;
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-i / (sps * 0.45));
      let v = 0;
      for (const [h, w] of partials) v += Math.sin(2 * Math.PI * freq * h * t) * w;
      buf[idx] += v * vol * env;
    }
  };

  const STRINGS: [number, number][] = [[1, 1], [2, 0.45], [3, 0.18]];
  const FLUTE: [number, number][] = [[1, 1], [2, 0.25], [3, 0.06]];
  const CELLO: [number, number][] = [[1, 1], [2, 0.5], [3, 0.2]];
  const BASS: [number, number][] = [[1, 1], [2, 0.3]];
  const PIANO: [number, number][] = [[1, 1], [2, 0.55], [3, 0.25], [4, 0.1]];
  const GLOCK: [number, number][] = [[1, 1], [2, 0.2]];

  let bar = 0;
  for (const section of SECTIONS) {
    section.chords.forEach((chordName, barInSection) => {
      const tones = CHORDS[chordName];
      const barStep = (bar + barInSection) * STEPS_PER_BAR;
      // strings pad: whole bar per chord tone
      for (const tone of tones) addNote(barStep, tone + 12, STEPS_PER_BAR, STRINGS, section.padVol, 1.5);
      // bass: beats 1 and 3
      addNote(barStep, tones[0], 3, BASS, 0.30, 0.1);
      addNote(barStep + 4, tones[0], 3, BASS, 0.26, 0.1);
      // piano arpeggio
      if (section.arp) {
        const pattern = [0, 1, 2, 1, 0, 1, 2, 1];
        pattern.forEach((deg, step) => addPluck(barStep + step, tones[deg] + 24, section.arpVol, PIANO));
      }
      // bridge cello line: chord root and fifth, half notes an octave up
      if (section.cello) {
        addNote(barStep, tones[0] + 12, 4, CELLO, 0.26, 0.5);
        addNote(barStep + 4, tones[2] + 12, 4, CELLO, 0.22, 0.5);
      }
    });

    // lead phrases are 8 bars; sections with a lead are 16 bars (twice)
    if (section.lead) {
      const phrase = section.lead === "A" ? PHRASE_A : PHRASE_B;
      for (let pass = 0; pass < 2; pass++) {
        phrase.forEach((midi, step) => {
          if (!midi) return;
          const globalStep = (bar + pass * 8) * STEPS_PER_BAR + step;
          // variation: second pass ends an octave up on the last bar
          const note = pass === 1 && step >= 56 ? midi + 12 : midi;
          addNote(globalStep, note, 0.95, FLUTE, section.leadVol ?? 0.30, 0.25, true);
          if (section.glock) addPluck(globalStep, note + 12, 0.10, GLOCK);
        });
      }
    }
    bar += section.chords.length;
  }

  // Gentle fade in (first bar) and fade out (last 4 bars)
  const fadeIn = SAMPLE_RATE * STEP_SECONDS * STEPS_PER_BAR;
  const fadeOutStart = total - SAMPLE_RATE * STEP_SECONDS * STEPS_PER_BAR * 4;
  for (let i = 0; i < total; i++) {
    if (i < fadeIn) buf[i] *= i / fadeIn;
    if (i > fadeOutStart) buf[i] *= Math.max(0, 1 - (i - fadeOutStart) / (total - fadeOutStart));
  }

  // Normalize QUIET: peak 0.42, background music should sit under the game
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const gain = 0.42 / Math.max(peak, 0.001);

  const bytes = new Uint8Array(44 + total * 2);
  const view = new DataView(bytes.buffer);
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + total * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, total * 2, true);
  for (let i = 0; i < total; i++) {
    const v = Math.max(-1, Math.min(1, buf[i] * gain));
    view.setInt16(44 + i * 2, Math.round(v * 32767), true);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
};

class Soundtrack {
  private audio: HTMLAudioElement | null = null;
  private url: string | null = null;
  private rendering = false;
  private wantPlay = false;
  playing = false;
  onBlocked: (() => void) | null = null;
  onComposing: (() => void) | null = null;

  start() {
    this.wantPlay = true;
    if (this.audio) {
      this.playing = true;
      this.audio.play().catch(() => { this.playing = false; if (this.onBlocked) this.onBlocked(); });
      return;
    }
    if (this.rendering) return;
    this.rendering = true;
    if (this.onComposing) this.onComposing();
    // Render off the tap handler so the UI never freezes while composing.
    setTimeout(() => {
      try {
        this.url = renderOvertureUrl();
        this.audio = new Audio(this.url);
        this.audio.loop = true;
        this.audio.volume = 0.4;
        this.audio.preload = "auto";
        this.rendering = false;
        if (this.wantPlay) {
          this.playing = true;
          this.audio.play().catch(() => { this.playing = false; if (this.onBlocked) this.onBlocked(); });
        }
      } catch {
        this.rendering = false;
        this.playing = false;
        if (this.onBlocked) this.onBlocked();
      }
    }, 40);
    this.playing = true; // optimistic: the button shows "on" while it renders
  }

  stop() {
    this.wantPlay = false;
    this.playing = false;
    if (this.audio) this.audio.pause();
  }

  toggle(): boolean {
    if (this.playing) this.stop();
    else this.start();
    return this.playing;
  }
}

export const chiptune = new Soundtrack();
export const MUSIC_PREF_KEY = "gum-mogul-music-on";
