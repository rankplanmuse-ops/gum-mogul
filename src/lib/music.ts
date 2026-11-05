// Gum Mogul chiptune engine: an original 8-bit loop synthesized live with
// WebAudio. No audio files, no samples, nothing to license: the melody was
// written for this game and is plain code, MIT like the rest of the project.
//
// Square wave lead + triangle bass + noise hats, Game Boy style (the
// original hardware had exactly these channels). Starts only on a user
// gesture (the speaker toggle), per browser autoplay rules.

const BPM = 138;
const STEP_SECONDS = 60 / BPM / 2; // eighth notes

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

class Chiptune {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  playing = false;

  private ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.14;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private tone(freq: number, at: number, dur: number, type: OscillatorType, vol: number, dutySlide = 0) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (dutySlide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + dutySlide), at + dur);
    gain.gain.setValueAtTime(vol, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
    osc.connect(gain).connect(this.master);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  private hat(at: number, vol: number) {
    if (!this.ctx || !this.master) return;
    const len = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter).connect(gain).connect(this.master);
    src.start(at);
  }

  private scheduleStep(step: number, at: number) {
    const lead = LEAD[step % LEAD.length];
    const bass = BASS[step % BASS.length];
    if (lead) this.tone(midiHz(lead), at, STEP_SECONDS * 0.92, "square", 0.5);
    if (bass) this.tone(midiHz(bass), at, STEP_SECONDS * 0.95, "triangle", 0.8);
    if (step % 2 === 1) this.hat(at, 0.12);
    if (step % 8 === 4) this.hat(at, 0.2);
    // a little sparkle arpeggio at the end of each loop
    if (step % 32 === 30) this.tone(midiHz(96), at, 0.09, "square", 0.25, -600);
  }

  start() {
    if (this.playing) return;
    this.ensureCtx();
    if (!this.ctx) return;
    this.playing = true;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    const tick = () => {
      if (!this.ctx || !this.playing) return;
      while (this.nextTime < this.ctx.currentTime + 0.14) {
        this.scheduleStep(this.step, this.nextTime);
        this.nextTime += STEP_SECONDS;
        this.step++;
      }
    };
    tick();
    this.timer = window.setInterval(tick, 27);
  }

  stop() {
    this.playing = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) void this.ctx.suspend();
  }

  toggle(): boolean {
    if (this.playing) this.stop();
    else this.start();
    return this.playing;
  }
}

export const chiptune = new Chiptune();
export const MUSIC_PREF_KEY = "gum-mogul-music-on";
