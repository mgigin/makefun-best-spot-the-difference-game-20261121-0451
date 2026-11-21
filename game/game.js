// Double Take — game logic: title screen, scene flow, timer, strikes,
// hints, pause, scoring, keyboard reticle, WebAudio feedback sounds.

"use strict";

const $ = id => document.getElementById(id);
const leftC = $("left"), rightC = $("right");
const lctx = leftC.getContext("2d"), rctx = rightC.getContext("2d");

const state = {
  sceneIndex: 0, found: new Set(), strikes: 0, hintsLeft: 3, hintsUsed: 0,
  startedAt: 0, elapsed: 0, paused: false, playing: false,
  hintPulse: null, flash: null, reticle: { x: 280, y: 190, panel: "right" },
  stars: [0, 0, 0], scores: [0, 0, 0], selected: 0,
};

let audio = null;
function beep(freq, dur, type) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
    o.connect(g); g.connect(audio.destination);
    o.start(); o.stop(audio.currentTime + dur);
  } catch (e) { /* sound is a garnish, never a blocker */ }
}
const sfx = {
  found() { beep(880, 0.15); setTimeout(() => beep(1320, 0.2), 90); },
  wrong() { beep(160, 0.25, "sawtooth"); },
  hint() { beep(660, 0.2, "triangle"); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.25), i * 110)); },
};

function fmtTime(s) {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

function scene() { return SCENES[state.sceneIndex]; }

function renderPanels() {
  const sc = scene();
  sc.draw(lctx, new Set());
  sc.draw(rctx, new Set(sc.diffs.map(d => d.id)));
  drawMarkers(lctx); drawMarkers(rctx);
  if (state.hintPulse) {
    const t = (Date.now() - state.hintPulse.at) / 900;
    if (t < 1) {
      for (const c of [lctx, rctx]) {
        c.strokeStyle = "rgba(255,201,60," + (1 - t) + ")";
        c.lineWidth = 4; c.beginPath();
        c.arc(state.hintPulse.x, state.hintPulse.y, 14 + t * 34, 0, Math.PI * 2); c.stroke();
      }
      requestAnimationFrame(renderPanels);
    } else state.hintPulse = null;
  }
  if (state.flash) {
    const c = state.flash.panel === "left" ? lctx : rctx;
    c.strokeStyle = "#ff5252"; c.lineWidth = 3;
    const { x, y } = state.flash;
    c.beginPath(); c.moveTo(x - 10, y - 10); c.lineTo(x + 10, y + 10);
    c.moveTo(x + 10, y - 10); c.lineTo(x - 10, y + 10); c.stroke();
    if (Date.now() - state.flash.at > 450) state.flash = null;
    else requestAnimationFrame(renderPanels);
  }
  drawReticle();
}

function drawMarkers(ctx) {
  for (const d of scene().diffs) {
    if (!state.found.has(d.id)) continue;
    ctx.strokeStyle = "#2ee66b"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(d.x, d.y, Math.min(d.r, 34), 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(d.x, d.y, Math.min(d.r, 34) + 4, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawReticle() {
  if (!state.playing || state.paused) return;
  const c = state.reticle.panel === "left" ? lctx : rctx;
  const { x, y } = state.reticle;
  c.strokeStyle = "#ffc93c"; c.lineWidth = 2.4;
  c.beginPath(); c.arc(x, y, 16, 0, Math.PI * 2); c.stroke();
  c.beginPath();
  c.moveTo(x - 24, y); c.lineTo(x - 8, y); c.moveTo(x + 8, y); c.lineTo(x + 24, y);
  c.moveTo(x, y - 24); c.lineTo(x, y - 8); c.moveTo(x, y + 8); c.lineTo(x, y + 24);
  c.stroke();
}

function updateHud() {
  const sc = scene(), left = sc.diffs.length - state.found.size;
  $("to-find").textContent = left + " to find";
  $("scene-name").textContent = sc.name;
  $("scene-meta").textContent = "Scene " + (state.sceneIndex + 1) + " of " + SCENES.length + " · Par " + fmtTime(sc.par);
  $("strikes").textContent = "Strikes: " + state.strikes;
  $("hint-btn").textContent = "Hint (" + state.hintsLeft + ")";
  $("hint-btn").disabled = state.hintsLeft <= 0;
  $("score").textContent = "Score: " + state.scores.reduce((a, b) => a + b, 0);
  const dots = $("dots"); dots.innerHTML = "";
  for (const d of sc.diffs) {
    const el = document.createElement("div");
    el.className = "dot" + (state.found.has(d.id) ? " on" : "");
    dots.appendChild(el);
  }
}

function tick() {
  if (state.playing && !state.paused) {
    state.elapsed = (Date.now() - state.startedAt) / 1000;
    $("timer").textContent = "⏱ " + fmtTime(state.elapsed);
  }
  requestAnimationFrame(tick);
}

function startScene(i) {
  state.sceneIndex = i;
  state.found = new Set(); state.strikes = 0; state.hintsLeft = 3; state.hintsUsed = 0;
  state.elapsed = 0; state.startedAt = Date.now(); state.paused = false; state.playing = true;
  state.hintPulse = null; state.flash = null;
  $("title-screen").classList.add("hidden");
  $("modal").classList.add("hidden");
  $("pause-veil").classList.add("hidden");
  $("hud").classList.remove("hidden");
  $("stage").classList.remove("hidden");
  $("progress").classList.remove("hidden");
  updateHud(); renderPanels();
  rightC.focus();
}

function finishScene() {
  state.playing = false;
  const sc = scene(), t = state.elapsed;
  let stars = 1;
  if (t <= sc.par * 1.5 && state.strikes <= 3) stars = 2;
  if (t <= sc.par && state.strikes === 0 && state.hintsUsed === 0) stars = 3;
  const timeBonus = Math.max(0, Math.round((sc.par * 2 - t) * 5));
  const score = sc.diffs.length * 100 + timeBonus - state.strikes * 25 - state.hintsUsed * 40;
  state.stars[state.sceneIndex] = Math.max(state.stars[state.sceneIndex], stars);
  state.scores[state.sceneIndex] = Math.max(state.scores[state.sceneIndex], Math.max(0, score));
  sfx.win();
  $("modal-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  $("modal-lines").innerHTML =
    "Time " + fmtTime(t) + " · Par " + fmtTime(sc.par) + "<br>" +
    "Strikes " + state.strikes + " · Hints used " + state.hintsUsed + "<br>" +
    "Scene score " + Math.max(0, score) + " · Total " + state.scores.reduce((a, b) => a + b, 0);
  $("modal-btn").textContent = state.sceneIndex + 1 < SCENES.length ? "Next Scene" : "Back to Title";
  $("modal").classList.remove("hidden");
  updateHud();
}

function tryMark(x, y, panel) {
  if (!state.playing || state.paused) return;
  const sc = scene();
  for (const d of sc.diffs) {
    if (state.found.has(d.id)) continue;
    if (Math.hypot(x - d.x, y - d.y) <= d.r) {
      state.found.add(d.id); sfx.found();
      updateHud(); renderPanels();
      if (state.found.size === sc.diffs.length) setTimeout(finishScene, 350);
      return;
    }
  }
  state.strikes++; sfx.wrong();
  state.flash = { x, y, panel, at: Date.now() };
  updateHud(); renderPanels();
}

function canvasPos(evt, canvas) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - r.left) * canvas.width / r.width,
    y: (evt.clientY - r.top) * canvas.height / r.height,
  };
}
leftC.addEventListener("click", e => { const p = canvasPos(e, leftC); state.reticle = { ...p, panel: "left" }; tryMark(p.x, p.y, "left"); });
rightC.addEventListener("click", e => { const p = canvasPos(e, rightC); state.reticle = { ...p, panel: "right" }; tryMark(p.x, p.y, "right"); });

$("hint-btn").addEventListener("click", useHint);
function useHint() {
  if (!state.playing || state.paused || state.hintsLeft <= 0) return;
  const missing = scene().diffs.filter(d => !state.found.has(d.id));
  if (!missing.length) return;
  const d = missing[Math.floor(Math.random() * missing.length)];
  state.hintsLeft--; state.hintsUsed++; sfx.hint();
  state.hintPulse = { x: d.x, y: d.y, at: Date.now() };
  updateHud(); renderPanels();
}

function setPaused(p) {
  if (!state.playing) return;
  state.paused = p;
  if (p) { state.pauseStart = Date.now(); $("pause-veil").classList.remove("hidden"); }
  else {
    state.startedAt += Date.now() - (state.pauseStart || Date.now());
    $("pause-veil").classList.add("hidden");
  }
  renderPanels();
}
$("pause-btn").addEventListener("click", () => setPaused(true));
$("resume-btn").addEventListener("click", () => setPaused(false));
$("modal-btn").addEventListener("click", () => {
  if (state.sceneIndex + 1 < SCENES.length) startScene(state.sceneIndex + 1);
  else showTitle();
});

document.addEventListener("keydown", e => {
  if (!state.playing) return;
  const step = e.shiftKey ? 24 : 8;
  const r = state.reticle;
  if (e.key === "ArrowLeft") r.x = Math.max(0, r.x - step);
  else if (e.key === "ArrowRight") r.x = Math.min(560, r.x + step);
  else if (e.key === "ArrowUp") r.y = Math.max(0, r.y - step);
  else if (e.key === "ArrowDown") r.y = Math.min(380, r.y + step);
  else if (e.key === "Tab") { r.panel = r.panel === "left" ? "right" : "left"; e.preventDefault(); }
  else if (e.key === "Enter" || e.key === " ") { tryMark(r.x, r.y, r.panel); e.preventDefault(); return; }
  else if (e.key === "h" || e.key === "H") { useHint(); return; }
  else if (e.key === "p" || e.key === "P" || e.key === "Escape") { setPaused(!state.paused); return; }
  else return;
  e.preventDefault(); renderPanels();
});

function showTitle() {
  state.playing = false;
  $("hud").classList.add("hidden");
  $("stage").classList.add("hidden");
  $("progress").classList.add("hidden");
  $("modal").classList.add("hidden");
  $("title-screen").classList.remove("hidden");
  buildCards();
}

function buildCards() {
  const wrap = $("scene-cards"); wrap.innerHTML = "";
  SCENES.forEach((sc, i) => {
    const card = document.createElement("div");
    card.className = "scene-card" + (i === state.selected ? " selected" : "");
    const cv = document.createElement("canvas");
    cv.width = 560; cv.height = 380;
    sc.draw(cv.getContext("2d"), new Set());
    card.appendChild(cv);
    const nm = document.createElement("div"); nm.className = "card-name";
    nm.textContent = "Scene " + (i + 1) + " — " + sc.name; card.appendChild(nm);
    const meta = document.createElement("div"); meta.className = "card-meta";
    meta.textContent = sc.diffs.length + " differences · Par " + fmtTime(sc.par); card.appendChild(meta);
    const st = document.createElement("div"); st.className = "card-stars";
    st.textContent = state.stars[i] ? "★".repeat(state.stars[i]) + "☆".repeat(3 - state.stars[i]) : "";
    card.appendChild(st);
    card.addEventListener("click", () => { state.selected = i; buildCards(); });
    card.addEventListener("dblclick", () => startScene(i));
    wrap.appendChild(card);
  });
  $("total-line").textContent =
    "Total score: " + state.scores.reduce((a, b) => a + b, 0) +
    " · Stars: " + state.stars.reduce((a, b) => a + b, 0) + "/9";
}
$("start-btn").addEventListener("click", () => startScene(state.selected));

buildCards();
requestAnimationFrame(tick);
