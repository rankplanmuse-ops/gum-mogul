// Tiny synthesized sound effects: no audio files, same trick as the
// soundtrack. Browsers only allow audio after a user gesture, and every
// call site here is a click handler, so the context unlocks naturally.
export const SFX_PREF_KEY = "gum-mogul-sfx-on";

let ctx: AudioContext | null = null;
let enabled = true;

export const setSfxEnabled = (v: boolean) => { enabled = v; };

const ac = (): AudioContext | null => {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch { return null; }
};

const tone = (freq: number, delay: number, dur: number, type: OscillatorType, gain = 0.1) => {
  if (!enabled) return;
  const a = ac();
  if (!a) return;
  const start = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(a.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
};

export const sfxPop = () => tone(540, 0, 0.09, "triangle", 0.1);
export const sfxCoin = () => { tone(988, 0, 0.08, "square", 0.05); tone(1319, 0.07, 0.16, "square", 0.05); };
export const sfxError = () => tone(150, 0, 0.18, "sawtooth", 0.045);
export const sfxFanfare = () => { tone(523, 0, 0.1, "triangle", 0.09); tone(659, 0.09, 0.1, "triangle", 0.09); tone(784, 0.18, 0.16, "triangle", 0.09); };
