// main.js — Twin Lens, a spot-the-difference game.
// Two near-identical pictures sit side by side; find every spot where the
// twin quietly differs from the original. This file wires the pieces
// together: scenes (scenes.js), rules (state.js), drawing (render.js),
// input (input.js) and sound (sound.js) — plus the HUD around the canvas.

import { SCENES } from './scenes.js';
import { newRound, guess, useHint, tick, starsFor, formatClock } from './state.js';
import { render } from './render.js';
import { attachInput, makeCrosshair } from './input.js';
import { soundFind, soundWrong, soundHint, soundWin, soundLose } from './sound.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const el = {
  foundCount: document.getElementById('found-count'),
  foundTotal: document.getElementById('found-total'),
  timerMeter: document.getElementById('timer-meter'),
  timerValue: document.getElementById('timer-value'),
  scoreValue: document.getElementById('score-value'),
  hintButton: document.getElementById('hint-button'),
  hintCount: document.getElementById('hint-count'),
  restartButton: document.getElementById('restart-button'),
  tabs: [...document.querySelectorAll('#scene-tabs .tab')],
  banner: document.getElementById('banner'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayStars: document.getElementById('overlay-stars'),
  overlayDetail: document.getElementById('overlay-detail'),
  overlayNext: document.getElementById('overlay-next'),
  overlayReplay: document.getElementById('overlay-replay'),
};

let sceneIndex = 0;
let round = newRound(SCENES[0]);
let crosshair = makeCrosshair();
const completed = new Set();
let bannerTimer = 0;
let frozen = false; // screenshot staging: stop the clock

function showBanner(message) {
  el.banner.textContent = message;
  el.banner.classList.remove('hidden');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.banner.classList.add('hidden'), 1800);
}

function syncHud() {
  el.foundCount.textContent = String(round.found.size);
  el.foundTotal.textContent = String(round.scene.differences.length);
  el.timerValue.textContent = formatClock(round.secondsLeft);
  el.timerMeter.classList.toggle('low', round.secondsLeft <= 30 && !round.finished);
  el.scoreValue.textContent = String(round.score);
  el.hintCount.textContent = String(round.hintsLeft);
  el.hintButton.disabled = round.hintsLeft <= 0 || round.finished;
  el.tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === sceneIndex);
    tab.classList.toggle('done', completed.has(i));
  });
}

function showOverlay() {
  const total = round.scene.differences.length;
  if (round.won) {
    el.overlayTitle.textContent = `${round.scene.name} complete!`;
    const stars = starsFor(round);
    el.overlayStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    el.overlayDetail.textContent =
      `All ${total} differences found with ${formatClock(round.secondsLeft)} to spare. ` +
      `Score ${round.score} · ${round.mistakes} wrong guess${round.mistakes === 1 ? '' : 'es'} · ${round.hintsUsed} hint${round.hintsUsed === 1 ? '' : 's'} used.`;
    el.overlayNext.textContent = sceneIndex < SCENES.length - 1 ? 'Next scene →' : 'Back to scene 1';
  } else {
    el.overlayTitle.textContent = 'Out of time!';
    el.overlayStars.textContent = '☆☆☆';
    el.overlayDetail.textContent =
      `You found ${round.found.size} of ${total} in ${round.scene.name}. Score ${round.score}. ` +
      'The unfound differences are still there — try again!';
    el.overlayNext.textContent = 'Try the next scene';
  }
  el.overlay.classList.remove('hidden');
}

function hideOverlay() {
  el.overlay.classList.add('hidden');
}

function startScene(index) {
  sceneIndex = index;
  round = newRound(SCENES[index]);
  crosshair = makeCrosshair();
  hideOverlay();
  syncHud();
  showBanner(`${SCENES[index].name} — find ${SCENES[index].differences.length} differences!`);
}

function onGuess(x, y) {
  const now = performance.now();
  const result = guess(round, x, y, now);
  if (result === 'found') {
    soundFind();
    const d = round.scene.differences[round.lastFindIndex];
    showBanner(`Found: ${d.label}! (${round.found.size}/${round.scene.differences.length})`);
    if (round.won) {
      completed.add(sceneIndex);
      soundWin();
      setTimeout(showOverlay, 650);
    }
  } else if (result === 'wrong') {
    soundWrong();
    showBanner('Not there — 5 seconds gone!');
    if (round.finished && !round.won) {
      soundLose();
      setTimeout(showOverlay, 650);
    }
  } else if (result === 'already') {
    showBanner('Already found that one.');
  }
  syncHud();
}

function onHint() {
  const i = useHint(round, performance.now());
  if (i >= 0) {
    soundHint();
    showBanner(`Hint: ${round.scene.differences[i].label} (−50)`);
  } else if (!round.finished) {
    showBanner('No hints left!');
  }
  syncHud();
}

attachInput(canvas, crosshair, {
  onGuess,
  onHint,
  onRestart: () => startScene(sceneIndex),
  onScene: (i) => startScene(i),
});

el.hintButton.addEventListener('click', onHint);
el.restartButton.addEventListener('click', () => startScene(sceneIndex));
el.tabs.forEach((tab, i) => tab.addEventListener('click', () => startScene(i)));
el.overlayNext.addEventListener('click', () => startScene((sceneIndex + 1) % SCENES.length));
el.overlayReplay.addEventListener('click', () => startScene(sceneIndex));

// Screenshot staging: ?scene=2&found=5&time=95&freeze=1 (&win=1) sets up a
// deterministic mid-game moment so the maker's screenshots show the game
// exactly as it plays. Harmless in normal play.
function stageFromQuery() {
  const q = new URLSearchParams(location.search);
  if (!q.has('scene') && !q.has('found') && !q.has('win')) return;
  const scene = Math.max(0, Math.min(SCENES.length - 1, Number(q.get('scene') || 1) - 1));
  startScene(scene);
  frozen = q.get('freeze') === '1';
  if (q.has('time')) round.secondsLeft = Math.max(0, Number(q.get('time')));
  const now = performance.now() - 1000; // findings are settled, no pop animation
  if (q.get('win') === '1') {
    round.scene.differences.forEach((d, i) => { round.found.add(i); });
    round.score = round.scene.differences.length * 100;
    round.finished = true;
    round.won = true;
    completed.add(scene);
    showOverlay();
  } else {
    const n = Math.max(0, Math.min(round.scene.differences.length - 1, Number(q.get('found') || 0)));
    for (let i = 0; i < n; i++) {
      const d = round.scene.differences[i];
      guess(round, d.x, d.y, now);
    }
    round.lastFindAt = -Infinity;
  }
  el.banner.classList.add('hidden');
  syncHud();
}

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (!frozen) {
    const justEnded = tick(round, dt);
    if (justEnded && !round.won) {
      soundLose();
      showOverlay();
    }
    if (!round.finished) syncHud();
  }
  render(ctx, round, crosshair, now);
  requestAnimationFrame(frame);
}

startScene(0);
stageFromQuery();
requestAnimationFrame(frame);
