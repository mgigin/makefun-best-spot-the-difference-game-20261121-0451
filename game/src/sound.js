// sound.js — tiny WebAudio bleeps, synthesized on the fly (no audio files,
// no network). A bright two-note chime for a find, a low buzz for a wrong
// guess, a soft arpeggio for the win. Everything is best-effort: if the
// browser has no AudioContext yet, the game simply stays quiet.

let ctx = null;

function audio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime + at);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.02);
}

export function soundFind() {
  tone(880, 0, 0.14, 'sine', 0.14);
  tone(1318, 0.09, 0.2, 'sine', 0.12);
}

export function soundWrong() {
  tone(180, 0, 0.18, 'square', 0.07);
  tone(140, 0.05, 0.2, 'square', 0.06);
}

export function soundHint() {
  tone(660, 0, 0.12, 'triangle', 0.1);
  tone(990, 0.08, 0.14, 'triangle', 0.09);
}

export function soundWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.26, 'triangle', 0.12));
}

export function soundLose() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.14, 0.24, 'triangle', 0.1));
}
