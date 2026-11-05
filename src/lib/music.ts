// Gum Mogul chiptune: an original 8-bit loop, written for this game.
//
// Playback v2 (why: v1 used a live WebAudio scheduler and stayed silent in
// some mobile webviews). Now the tune is rendered to a tiny WAV in code at
// first use (square lead, triangle bass, noise hats, Game Boy style) and
// played through a plain looping audio element, which every browser and
// webview handles reliably from a tap. No audio files ship with the game;
// the loop below IS the song, MIT like everything else here.

const BPM = 138;
const SAMPLE_RATE = 22050;

// Lead melody, MIDI note numbers, 0 = rest. 32 eighth notes = 4 bars.
const LEAD = [
  72, 76, 79, 76, 81, 79, 76, 72,
  74, 79, 81, 79, 84, 81, 79, 76,
  77, 81, 84, 81, 79, 76, 74, 71,
  72, 76, 79, 84, 79, 76, 74, 0,
];
// Bass line: roots and fifths following C, F, C, G chords.
const BASS = [
  48, 55, 48, 55, 48, 55, 48, 55,
  53, 60, 53, 60, 53, 60, 55, 53,
  48, 55, 48, 55, 48, 55, 48, 55,
  55, 62, 55, 62, 55, 62, 59, 62,
];

const midiHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const renderLoopUrl = (): string => {
  const stepDur = 60 / BPM / 2;
  const sps = Math.round(SAMPLE_RATE * stepDur);
  const total = sps * LEAD.length;
  const buf = new Float32Array(total);
  let seed = 22222;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

  const addTone = (start: number, freq: number, dur: number, square: boolean, vol: number) => {
    for (let i = 0; i < dur; i++) {
      const idx = start + i;
      if (idx >= total) break;
      const phase = (i / SAMPLE_RATE * freq) % 1;
      const env = Math.max(0, 1 - i / dur);
      const v = square ? (phase < 0.5 ? 1 : -1) : phase < 0.5 ? phase * 4 - 1 : 3 - phase * 4;
      buf[idx] += v * vol * (0.25 + 0.75 * env);
    }
  };
  const addHat = (start: number, vol: number) => {
    const n = Math.floor(SAMPLE_RATE * 0.03);
    for (let i = 0; i < n; i++) {
      const idx = start + i;
      if (idx >= total) break;
      buf[idx] += (rnd() * 2 - 1) * vol * (1 - i / n);
    }
  };

  for (let step = 0; step < LEAD.length; step++) {
    const at = step * sps;
    if (LEAD[step]) addTone(at, midiHz(LEAD[step]), Math.floor(sps * 0.92), true, 0.3);
    if (BASS[step]) addTone(at, midiHz(BASS[step]), Math.floor(sps * 0.95), false, 0.42);
    if (step % 2 === 1) addHat(at, 0.1);
    if (step % 8 === 4) addHat(at, 0.16);
    if (step === 30) addTone(at, midiHz(96), Math.floor(SAMPLE_RATE * 0.09), true, 0.15);
  }

  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const gain = 0.85 / Math.max(peak, 0.001);

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

class Chiptune {
  private audio: HTMLAudioElement | null = null;
  playing = false;
  onBlocked: (() => void) | null = null;

  private ensureAudio() {
    if (!this.audio) {
      this.audio = new Audio(renderLoopUrl());
      this.audio.loop = true;
      this.audio.volume = 0.55;
      this.audio.preload = "auto";
    }
    return this.audio;
  }

  start() {
    const audio = this.ensureAudio();
    this.playing = true;
    audio.play().catch(() => {
      this.playing = false;
      if (this.onBlocked) this.onBlocked();
    });
  }

  stop() {
    this.playing = false;
    if (this.audio) this.audio.pause();
  }

  toggle(): boolean {
    if (this.playing) this.stop();
    else this.start();
    return this.playing;
  }
}

export const chiptune = new Chiptune();
export const MUSIC_PREF_KEY = "gum-mogul-music-on";
