// Double Take — scenes. Every scene is drawn from scratch on a 560x380
// canvas. draw(ctx, changed) renders the picture; `changed` is a Set of
// difference ids: empty for the original panel, full for the twin panel.
// Each difference lists its click target (x, y, r) in canvas coordinates.

"use strict";

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}
function poly(ctx, pts, fill) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  for (const [dx, dy, r] of [[0, 0, 22], [24, -6, 18], [46, 0, 20], [22, 6, 20]]) {
    ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill();
  }
}
function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.9);
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.85);
  ctx.stroke();
}
function star(ctx, x, y, r, color) {
  ctx.fillStyle = color; ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r;
    const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}

/* ---------------- Scene 1: Harbor Morning (7 differences) ---------------- */
function drawHarbor(ctx, ch) {
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, "#ffd9a0"); sky.addColorStop(0.55, "#ffb877"); sky.addColorStop(1, "#ff9e7d");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 560, 380);

  // sun (diff: rays)
  circle(ctx, 462, 74, 30, "#ffcf3f");
  ctx.strokeStyle = "#ffcf3f"; ctx.lineWidth = 4;
  const rays = ch.has("sun") ? 6 : 8;
  for (let i = 0; i < rays; i++) {
    const a = i * Math.PI * 2 / rays;
    ctx.beginPath();
    ctx.moveTo(462 + Math.cos(a) * 38, 74 + Math.sin(a) * 38);
    ctx.lineTo(462 + Math.cos(a) * 52, 74 + Math.sin(a) * 52);
    ctx.stroke();
  }
  cloud(ctx, 70, 70, 1, "#ffffff");
  if (!ch.has("cloud")) cloud(ctx, 300, 52, 0.8, "#ffffff"); // diff: cloud gone
  bird(ctx, 200, 92, 1, "#5b4a3f");
  if (!ch.has("bird")) bird(ctx, 352, 110, 0.8, "#5b4a3f"); // diff: bird gone

  // sea + sand
  ctx.fillStyle = "#2e7fb8"; ctx.fillRect(0, 238, 560, 62);
  ctx.fillStyle = "#f4e2b8"; ctx.fillRect(0, 300, 560, 80);
  ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(20 + i * 110, 256 + (i % 2) * 16); ctx.lineTo(70 + i * 110, 256 + (i % 2) * 16); ctx.stroke(); }

  // lighthouse (diff: stripe count)
  ctx.fillStyle = "#fdfdfd"; ctx.fillRect(52, 128, 34, 112);
  ctx.fillStyle = "#e23b3b";
  const stripes = ch.has("lighthouse") ? 2 : 3;
  for (let i = 0; i < stripes; i++) ctx.fillRect(52, 140 + i * 34, 34, 17);
  poly(ctx, [[46, 128], [92, 128], [69, 106]], "#c22f2f");
  circle(ctx, 69, 120, 6, "#ffe98a");

  // houses (diff: middle roof color)
  const houses = [[150, "#a8542f"], [238, ch.has("roof") ? "#d6336c" : "#3b6ea5"], [326, "#7b4fa6"]];
  for (const [x, roof] of houses) {
    ctx.fillStyle = "#fff3d6"; ctx.fillRect(x, 206, 62, 40);
    poly(ctx, [[x - 6, 206], [x + 68, 206], [x + 31, 178]], roof);
    ctx.fillStyle = "#7a4a21"; ctx.fillRect(x + 24, 220, 14, 26);
  }

  // boats (diff: sail color)
  function boat(x, y, sail, hull) {
    poly(ctx, [[x, y], [x + 54, y], [x + 44, y + 16], [x + 10, y + 16]], hull);
    ctx.fillStyle = "#6b4423"; ctx.fillRect(x + 25, y - 34, 4, 34);
    poly(ctx, [[x + 29, y - 34], [x + 29, y - 2], [x + 50, y - 2]], sail);
  }
  boat(120, 282, "#ffffff", "#2f9e6e");
  boat(398, 272, ch.has("sail") ? "#ffd23f" : "#ffffff", "#e23b3b");
  boat(486, 292, "#ffffff", "#3b6ea5");

  // sand props (diff: fish count, crate)
  ctx.fillStyle = "#b07a3f"; ctx.fillRect(88, 318, 30, 26);
  ctx.strokeStyle = "#8a5a2b"; ctx.strokeRect(88, 318, 30, 26);
  if (!ch.has("crate")) { ctx.beginPath(); ctx.moveTo(88, 318); ctx.lineTo(118, 344); ctx.moveTo(118, 318); ctx.lineTo(88, 344); ctx.stroke(); }
  function fish(x, y, c) { poly(ctx, [[x, y], [x + 20, y - 6], [x + 20, y + 6]], c); circle(ctx, x + 24, y, 7, c); }
  fish(196, 334, "#4db8e8");
  if (!ch.has("fish")) fish(236, 348, "#f2994a"); // diff: second fish gone
  circle(ctx, 300, 330, 13, "#8a5a2b"); circle(ctx, 300, 330, 13, null);
  ctx.strokeStyle = "#6e4520"; ctx.beginPath(); ctx.arc(300, 330, 13, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#7a4a21"; ctx.fillRect(420, 312, 8, 34);
}

/* ---------------- Scene 2: Night Market (10 differences) ---------------- */
function drawMarket(ctx, ch) {
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, "#141b3d"); sky.addColorStop(1, "#3a2b5c");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 560, 380);
  star(ctx, 60, 44, 5, "#ffe98a"); star(ctx, 180, 30, 4, "#ffffff");
  star(ctx, 330, 52, 5, "#ffe98a");
  if (!ch.has("star")) star(ctx, 440, 34, 4, "#ffffff"); // diff: star gone

  // moon (diff: crescent flips)
  circle(ctx, 502, 58, 24, "#f7f3d8");
  circle(ctx, ch.has("moon") ? 490 : 514, 50, 20, "#1b2247");

  // string lights (diff: one bulb color)
  ctx.strokeStyle = "#0d0d1a"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 70); ctx.quadraticCurveTo(280, 130, 560, 70); ctx.stroke();
  const bulbCols = ["#ff6b6b", "#ffd23f", "#6be8a8", "#4db8e8", "#ff9ff3"];
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9, x = t * 560, y = 70 + Math.sin(t * Math.PI) * 44;
    let c = bulbCols[i % 5];
    if (ch.has("bulb") && i === 4) c = "#ffffff";
    circle(ctx, x, y + 8, 6, c);
  }

  // stalls (diffs: awning stripes, sign text, fruit count, lantern color)
  function stall(x, awn, sign, lantern) {
    ctx.fillStyle = "#5c3a21"; ctx.fillRect(x, 216, 130, 96);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? "#ffffff" : awn; ctx.fillRect(x - 8 + i * 30, 188, 30, 30); }
    ctx.fillStyle = "#2b1c10"; rr(ctx, x + 28, 228, 74, 26, 5); ctx.fill();
    ctx.fillStyle = "#ffd23f"; ctx.font = "bold 15px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(sign, x + 65, 247);
    circle(ctx, x + 16, 200, 10, lantern);
    ctx.fillStyle = "#8a5a2b"; ctx.fillRect(x + 8, 282, 114, 30);
  }
  stall(30, "#e23b3b", "FRUIT", ch.has("lantern") ? "#6be8a8" : "#ff6b6b");
  stall(215, "#3b6ea5", ch.has("sign") ? "TEA" : "CAKE", "#ffd23f");
  stall(400, "#7b4fa6", "TOYS", "#ff9ff3");
  // fruit pile on first stall (diff: one fruit fewer)
  const fruits = ch.has("fruit") ? 4 : 5;
  for (let i = 0; i < fruits; i++) circle(ctx, 52 + i * 20, 276 - (i === 2 ? 8 : 0), 8, i % 2 ? "#f2994a" : "#e23b3b");
  // awning stripe diff on third stall: extra white stripe
  if (ch.has("awning")) { ctx.fillStyle = "#ffffff"; ctx.fillRect(400 - 8 + 2 * 30, 188, 30, 30); }

  // ground + cat (diff: cat side), window (diff: lit)
  ctx.fillStyle = "#241a3d"; ctx.fillRect(0, 312, 560, 68);
  const catX = ch.has("cat") ? 470 : 150;
  ctx.fillStyle = "#1a1a26";
  ctx.beginPath(); ctx.ellipse(catX, 340, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, catX + 20, 330, 10, "#1a1a26");
  poly(ctx, [[catX + 13, 324], [catX + 17, 314], [catX + 21, 324]], "#1a1a26");
  poly(ctx, [[catX + 22, 324], [catX + 26, 314], [catX + 30, 324]], "#1a1a26");
  circle(ctx, catX + 17, 329, 1.8, "#ffd23f"); circle(ctx, catX + 24, 329, 1.8, "#ffd23f");
  ctx.fillStyle = ch.has("window") ? "#ffd23f" : "#3a2b5c";
  ctx.fillRect(258, 330, 26, 30);
  ctx.strokeStyle = "#5c3a21"; ctx.strokeRect(258, 330, 26, 30);
  // flag on middle stall (diff: flag color)
  ctx.fillStyle = "#6b4423"; ctx.fillRect(278, 150, 4, 40);
  poly(ctx, [[282, 150], [306, 158], [282, 166]], ch.has("flag") ? "#6be8a8" : "#e23b3b");
}

/* ---------------- Scene 3: Star Camp (12 differences) ---------------- */
function drawCamp(ctx, ch) {
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, "#0a1430"); sky.addColorStop(1, "#274060");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 560, 380);
  star(ctx, 80, 40, 5, "#ffffff"); star(ctx, 200, 66, 4, "#ffe98a");
  star(ctx, 360, 36, 5, "#ffffff"); star(ctx, 470, 80, 4, "#ffe98a");
  if (!ch.has("star2")) star(ctx, 140, 100, 4, "#ffffff"); // diff: star gone

  // comet (diff: tail direction)
  circle(ctx, 300, 60, 7, "#cfe8ff");
  ctx.strokeStyle = "rgba(160,210,255,.8)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(300, 60);
  ctx.lineTo(ch.has("comet") ? 340 : 262, ch.has("comet") ? 40 : 82); ctx.stroke();

  // moon (diff: phase)
  circle(ctx, 500, 52, 22, "#f7f3d8");
  if (ch.has("phase")) circle(ctx, 492, 46, 18, "#101c3d");

  // hills + ground
  ctx.fillStyle = "#1d3a2a"; ctx.beginPath(); ctx.ellipse(120, 330, 260, 90, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#26503a"; ctx.fillRect(0, 300, 560, 80);

  // trees (diff: tree count) + owl (diff: eyes open/closed)
  function tree(x, h) {
    ctx.fillStyle = "#4a3220"; ctx.fillRect(x - 5, 300 - h * 0.3, 10, h * 0.3);
    poly(ctx, [[x - h * 0.34, 300 - h * 0.25], [x + h * 0.34, 300 - h * 0.25], [x, 300 - h]], "#1f5c3d");
    poly(ctx, [[x - h * 0.26, 300 - h * 0.55], [x + h * 0.26, 300 - h * 0.55], [x, 300 - h * 1.15]], "#27784e");
  }
  tree(50, 120); tree(110, 90);
  if (!ch.has("tree")) tree(520, 110); // diff: tree gone
  // owl on left tree
  ctx.fillStyle = "#8a6a45"; ctx.beginPath(); ctx.ellipse(52, 222, 12, 15, 0, 0, Math.PI * 2); ctx.fill();
  if (ch.has("owl")) {
    ctx.strokeStyle = "#2b1c10"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(44, 218); ctx.lineTo(50, 218); ctx.moveTo(54, 218); ctx.lineTo(60, 218); ctx.stroke();
  } else { circle(ctx, 47, 218, 3, "#ffd23f"); circle(ctx, 57, 218, 3, "#ffd23f"); }

  // tent (diff: tent color, flag)
  poly(ctx, [[170, 300], [300, 300], [235, 205]], ch.has("tent") ? "#3b6ea5" : "#e2723b");
  poly(ctx, [[212, 300], [258, 300], [235, 244]], "#7a3b1e");
  if (!ch.has("tentflag")) poly(ctx, [[235, 205], [258, 212], [235, 220]], "#ffd23f");

  // campfire (diff: log count, flame size)
  ctx.fillStyle = "#6b4423";
  const logs = ch.has("logs") ? 2 : 3;
  for (let i = 0; i < logs; i++) { ctx.save(); ctx.translate(370, 316); ctx.rotate(-0.4 + i * 0.4); ctx.fillRect(-26, -5, 52, 9); ctx.restore(); }
  const fs = ch.has("flame") ? 0.65 : 1;
  poly(ctx, [[352, 312], [388, 312], [370, 312 - 44 * fs]], "#f2994a");
  poly(ctx, [[360, 312], [380, 312], [370, 312 - 28 * fs]], "#ffd23f");

  // telescope (diff: angle)
  ctx.strokeStyle = "#c9d4e6"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(452, 300); ctx.lineTo(452, 268); ctx.stroke();
  ctx.save(); ctx.translate(452, 262); ctx.rotate(ch.has("scope") ? -0.9 : -0.45);
  ctx.fillStyle = "#4db8e8"; ctx.fillRect(-6, -34, 12, 40); ctx.restore();

  // blanket + mug + backpack (diffs: stripes, mug color, pack pocket)
  ctx.fillStyle = "#a83b5c"; ctx.fillRect(120, 330, 110, 26);
  ctx.fillStyle = "#ffffff";
  const stripes = ch.has("blanket") ? 2 : 3;
  for (let i = 0; i < stripes; i++) ctx.fillRect(132 + i * 34, 330, 12, 26);
  ctx.fillStyle = ch.has("mug") ? "#6be8a8" : "#e23b3b"; ctx.fillRect(248, 334, 14, 16);
  ctx.fillStyle = "#3b6ea5"; rr(ctx, 470, 322, 34, 36, 8); ctx.fill();
  if (!ch.has("pack")) { ctx.fillStyle = "#ffd23f"; rr(ctx, 478, 334, 18, 14, 4); ctx.fill(); }

  // fireflies (diff: count)
  const flies = ch.has("flies") ? 2 : 4;
  for (let i = 0; i < flies; i++) circle(ctx, 90 + i * 110, 280 + (i % 2) * 18, 3, "#ffe98a");
}

const SCENES = [
  {
    id: "harbor", name: "Harbor Morning", par: 90, draw: drawHarbor,
    diffs: [
      { id: "sun", x: 462, y: 74, r: 56 },
      { id: "cloud", x: 322, y: 52, r: 44 },
      { id: "bird", x: 352, y: 110, r: 26 },
      { id: "lighthouse", x: 69, y: 180, r: 40 },
      { id: "roof", x: 269, y: 192, r: 40 },
      { id: "sail", x: 424, y: 256, r: 34 },
      { id: "fish", x: 248, y: 348, r: 26 },
      { id: "crate", x: 103, y: 331, r: 26 },
    ],
  },
  {
    id: "market", name: "Night Market", par: 120, draw: drawMarket,
    diffs: [
      { id: "star", x: 440, y: 34, r: 22 },
      { id: "moon", x: 502, y: 58, r: 32 },
      { id: "bulb", x: 280, y: 122, r: 24 },
      { id: "lantern", x: 46, y: 200, r: 22 },
      { id: "sign", x: 280, y: 241, r: 38 },
      { id: "fruit", x: 92, y: 276, r: 30 },
      { id: "awning", x: 452, y: 203, r: 34 },
      { id: "cat", x: 160, y: 336, r: 40 },
      { id: "window", x: 271, y: 345, r: 26 },
      { id: "flag", x: 294, y: 158, r: 24 },
    ],
  },
  {
    id: "camp", name: "Star Camp", par: 150, draw: drawCamp,
    diffs: [
      { id: "star2", x: 140, y: 100, r: 22 },
      { id: "comet", x: 300, y: 60, r: 40 },
      { id: "phase", x: 500, y: 52, r: 30 },
      { id: "tree", x: 520, y: 250, r: 44 },
      { id: "owl", x: 52, y: 222, r: 26 },
      { id: "tent", x: 235, y: 260, r: 52 },
      { id: "tentflag", x: 246, y: 212, r: 22 },
      { id: "logs", x: 370, y: 316, r: 36 },
      { id: "flame", x: 370, y: 292, r: 30 },
      { id: "scope", x: 452, y: 262, r: 34 },
      { id: "blanket", x: 175, y: 343, r: 44 },
      { id: "mug", x: 255, y: 342, r: 20 },
      { id: "pack", x: 487, y: 340, r: 28 },
      { id: "flies", x: 310, y: 289, r: 36 },
    ],
  },
];

// Harbor: 8 differences. Market: 10. Camp: 14. Every drawn change is a
// listed click target, so the hunt is always fair.
