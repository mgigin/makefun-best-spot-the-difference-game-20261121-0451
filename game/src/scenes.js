// scenes.js — the three pictures to study, drawn entirely from code.
// Every scene draws itself twice: once as the original (twin=false) and once
// as its near-copy (twin=true). The twin quietly changes a handful of things;
// the differences list names where each change sits, in panel coordinates,
// so a click can be judged fairly on either panel.

import {
  circle, ring, ellipse, rect, roundRect, poly, line, skyGradient, cloud, sun, moon,
  star, sparkle, bird, pineTree, flower, wave, lantern, text,
} from './paint.js';

export const PANEL_W = 620;
export const PANEL_H = 440;

/* ------------------------------------------------------------------ */
/* Scene 1: Harbor Morning — seven differences.                        */
/* ------------------------------------------------------------------ */

function drawHarbor(ctx, twin) {
  skyGradient(ctx, PANEL_W, PANEL_H, '#7ec8f2', '#e6f6ff');
  sun(ctx, 78, 72, 30, twin); // 1: sunglasses on the twin
  cloud(ctx, 215, 58, 1);
  cloud(ctx, 478, 44, 0.8);
  cloud(ctx, 352, 96, 0.55);
  bird(ctx, 300, 66, 1);
  bird(ctx, 334, 82, 0.8);

  // far headland
  poly(ctx, [[0, 252], [120, 208], [250, 238], [360, 252]], '#9fc7a8');
  poly(ctx, [[0, 252], [120, 208], [250, 238], [360, 252], [360, 262], [0, 262]], '#8fbc99');

  // sea
  rect(ctx, 0, 252, PANEL_W, PANEL_H - 252, '#2e86c9');
  rect(ctx, 0, 252, PANEL_W, 8, '#57a8dd');
  wave(ctx, 30, 292, 46, 'rgba(255,255,255,0.75)');
  wave(ctx, 210, 322, 52, 'rgba(255,255,255,0.6)');
  wave(ctx, 380, 300, 44, 'rgba(255,255,255,0.7)');
  wave(ctx, 90, 404, 58, 'rgba(255,255,255,0.55)');
  wave(ctx, 300, 412, 50, 'rgba(255,255,255,0.65)');
  wave(ctx, 470, 386, 54, 'rgba(255,255,255,0.6)');

  // sailboat
  poly(ctx, [[268, 316], [348, 316], [334, 338], [282, 338]], '#c1443c'); // hull
  rect(ctx, 268, 310, 80, 7, '#8a2f2a');
  line(ctx, 308, 316, 308, 222, '#6b4a2f', 4); // mast
  poly(ctx, [[312, 226], [312, 306], [346, 306]], '#ffffff'); // main sail
  if (!twin) rect(ctx, 314, 262, 26, 9, '#f2b134'); // 2: sail stripe gone on the twin
  poly(ctx, [[304, 232], [304, 306], [278, 306]], '#ffe9a3'); // jib
  circle(ctx, 292, 326, 4, '#ffd93b');
  circle(ctx, 308, 326, 4, '#ffd93b');
  circle(ctx, 324, 326, 4, '#ffd93b');

  // buoy — 3: red on the original, yellow on the twin
  const buoy = twin ? '#f2b134' : '#e4572e';
  poly(ctx, [[203, 398], [227, 398], [221, 374], [209, 374]], buoy);
  rect(ctx, 205, 386, 20, 5, '#ffffff');
  circle(ctx, 215, 370, 5, '#22304a');
  wave(ctx, 193, 406, 44, 'rgba(255,255,255,0.8)');

  // rocky point + lighthouse
  poly(ctx, [[452, 440], [470, 330], [520, 306], [580, 330], [604, 440]], '#7d8aa0');
  poly(ctx, [[470, 330], [520, 306], [580, 330], [560, 352], [492, 352]], '#93a3ba');
  // tower: white with two red bands
  poly(ctx, [[500, 312], [508, 132], [548, 132], [556, 312]], '#fdfdfd');
  poly(ctx, [[503, 262], [553, 262], [555, 292], [501, 292]], '#e4572e');
  poly(ctx, [[506, 182], [550, 182], [552, 212], [504, 212]], '#e4572e');
  roundRect(ctx, 520, 226, 16, 22, 6, '#33506e'); // window
  roundRect(ctx, 519, 282, 18, 30, 7, '#7a4a2b'); // door
  // gallery + lamp room — 4: lamp red on the original, green on the twin
  rect(ctx, 500, 124, 56, 9, '#22304a');
  rect(ctx, 512, 100, 32, 24, '#22304a');
  circle(ctx, 528, 112, 9, twin ? '#3ddc84' : '#ff5a4e');
  poly(ctx, [[506, 100], [528, 80], [550, 100]], '#c1443c'); // roof
  // flag — 5: red flag on the original, blue on the twin
  line(ctx, 528, 80, 528, 58, '#22304a', 3);
  poly(ctx, [[528, 58], [552, 64], [528, 72]], twin ? '#3a6fd8' : '#e4572e');

  // dock with crates, bottom left — 6: top crate missing on the twin
  rect(ctx, 0, 352, 196, 14, '#a97c50');
  rect(ctx, 0, 366, 196, 6, '#8a6238');
  for (const px of [16, 76, 136, 182]) rect(ctx, px, 372, 10, 68, '#8a6238');
  roundRect(ctx, 22, 316, 44, 36, 3, '#c98d54');
  line(ctx, 22, 334, 66, 334, '#a97c50', 3);
  roundRect(ctx, 70, 316, 44, 36, 3, '#b97f47');
  line(ctx, 70, 334, 114, 334, '#96683a', 3);
  if (!twin) {
    roundRect(ctx, 46, 282, 44, 34, 3, '#d69c5f');
    line(ctx, 46, 299, 90, 299, '#a97c50', 3);
  }
  // fishing rod leaning on a crate
  line(ctx, 128, 352, 168, 282, '#6b4a2f', 3);
  line(ctx, 168, 282, 186, 330, 'rgba(255,255,255,0.8)', 1.4);
  circle(ctx, 186, 334, 3, '#e4572e');

  // gull on a post — 7: gone on the twin
  rect(ctx, 424, 330, 9, 62, '#8a6238');
  rect(ctx, 418, 324, 21, 8, '#a97c50');
  if (!twin) {
    ellipse(ctx, 428, 312, 15, 9, '#fdfdfd');
    circle(ctx, 440, 304, 7, '#fdfdfd');
    poly(ctx, [[446, 304], [456, 307], [446, 310]], '#f2b134'); // beak
    circle(ctx, 441, 303, 1.7, '#22304a');
    poly(ctx, [[414, 310], [404, 302], [416, 304]], '#dfe9f5'); // tail
    line(ctx, 426, 320, 426, 325, '#f2b134', 2);
    line(ctx, 432, 320, 432, 325, '#f2b134', 2);
  }
}

const harbor = {
  id: 'harbor-morning',
  name: 'Harbor Morning',
  timeLimit: 180,
  hints: 3,
  draw: drawHarbor,
  differences: [
    { x: 78, y: 72, r: 40, label: 'the sun wears sunglasses' },
    { x: 326, y: 266, r: 30, label: 'the sail stripe is missing' },
    { x: 215, y: 386, r: 24, label: 'the buoy changed colour' },
    { x: 528, y: 112, r: 22, label: 'the lighthouse lamp changed colour' },
    { x: 540, y: 65, r: 20, label: 'the lighthouse flag changed colour' },
    { x: 68, y: 299, r: 30, label: 'a crate is missing from the stack' },
    { x: 430, y: 310, r: 24, label: 'the gull on the post is gone' },
  ],
};

/* ------------------------------------------------------------------ */
/* Scene 2: Night Market — ten differences.                            */
/* ------------------------------------------------------------------ */

function drawMarket(ctx, twin) {
  skyGradient(ctx, PANEL_W, PANEL_H, '#1b2a4a', '#4a3a6e');
  moon(ctx, 540, 64, 26, !twin); // 1: crescent on the original, full on the twin
  // stars — 2: one star missing on the twin
  const stars = [[40, 40], [110, 70], [180, 34], [250, 60], [330, 40], [410, 66], [470, 30], [70, 120], [300, 110]];
  for (const [sx, sy] of stars) sparkle(ctx, sx, sy, 5, 'rgba(255,240,190,0.9)');
  if (!twin) sparkle(ctx, 380, 96, 6, '#ffe9a3');
  sparkle(ctx, 150, 96, 4, 'rgba(255,240,190,0.7)');

  // background buildings with windows — 3: one window lit only on the original
  rect(ctx, 0, 150, 150, 190, '#2a3350');
  rect(ctx, 470, 140, 150, 200, '#2a3350');
  for (const [wx, wy] of [[24, 180], [64, 180], [104, 180], [24, 224], [64, 224], [104, 224], [494, 172], [534, 172], [574, 172], [494, 216], [574, 216]]) {
    rect(ctx, wx, wy, 22, 28, '#ffd93b');
  }
  rect(ctx, 534, 216, 22, 28, twin ? '#39466b' : '#ffd93b');
  rect(ctx, 24, 268, 22, 28, '#39466b');
  rect(ctx, 104, 268, 22, 28, '#39466b');

  // string lights — 4: one bulb dark on the twin
  const strings = [
    { x1: 0, y1: 108, x2: 310, y2: 128, sag: 42 },
    { x1: 310, y1: 128, x2: PANEL_W, y2: 104, sag: 40 },
  ];
  let bulbIndex = 0;
  for (const s of strings) {
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.quadraticCurveTo((s.x1 + s.x2) / 2, Math.max(s.y1, s.y2) + s.sag, s.x2, s.y2);
    ctx.strokeStyle = 'rgba(20,20,30,0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      const bx = (1 - t) * (1 - t) * s.x1 + 2 * (1 - t) * t * ((s.x1 + s.x2) / 2) + t * t * s.x2;
      const by = (1 - t) * (1 - t) * s.y1 + 2 * (1 - t) * t * (Math.max(s.y1, s.y2) + s.sag) + t * t * s.y2;
      bulbIndex++;
      const dark = twin && bulbIndex === 10;
      circle(ctx, bx, by + 7, 5, dark ? '#4a4a55' : ['#ffd93b', '#ff8fa3', '#7be0c3', '#ffb35c'][bulbIndex % 4]);
      line(ctx, bx, by, bx, by + 3, '#14141e', 2);
    }
  }

  // ground
  rect(ctx, 0, 340, PANEL_W, 100, '#3d3157');
  rect(ctx, 0, 340, PANEL_W, 6, '#55477a');

  // three stalls
  const stall = (x, awningA, awningB, goods) => {
    rect(ctx, x, 268, 150, 74, '#6b4a2f'); // counter
    rect(ctx, x, 262, 150, 10, '#8a6238');
    rect(ctx, x + 6, 196, 8, 70, '#5a3d24');
    rect(ctx, x + 136, 196, 8, 70, '#5a3d24');
    // striped awning
    for (let i = 0; i < 6; i++) {
      poly(ctx, [[x - 6 + i * 27, 196], [x + 8 + i * 27, 168], [x + 35 + i * 27, 168], [x + 21 + i * 27, 196]], i % 2 ? awningA : awningB);
    }
    goods(x);
  };
  stall(24, '#e4572e', '#fdf3e3', (x) => {
    // fruit piles — 5: red apples on the original, oranges on the twin
    const fruit = twin ? '#f07f13' : '#e63b2e';
    for (const [fx, fy] of [[44, 252], [62, 252], [53, 240], [92, 252], [110, 252], [101, 240]]) circle(ctx, x + fx - 24, fy, 9, fruit);
    for (const [fx, fy] of [[44, 252], [62, 252], [53, 240]]) circle(ctx, x + fx + 84, fy, 9, '#ffd93b');
  });
  stall(235, '#17a398', '#fdf3e3', (x) => {
    // jars
    for (const jx of [30, 58, 86, 114]) {
      roundRect(ctx, x + jx, 232, 20, 30, 4, '#c86dd7');
      rect(ctx, x + jx, 232, 20, 6, '#8e44ad');
    }
  });
  stall(446, '#3a6fd8', '#fdf3e3', (x) => {
    // bread loaves
    for (const [lx, ly] of [[36, 250], [66, 250], [96, 250], [51, 238], [81, 238]]) ellipse(ctx, x + lx, ly, 15, 9, '#e0a458');
  });

  // hanging lanterns — 6: middle lantern colour differs
  lantern(ctx, 120, 210, 1, '#e63b2e', true);
  lantern(ctx, 310, 222, 1.1, twin ? '#3ddc84' : '#f2b134', true);
  lantern(ctx, 500, 210, 1, '#ff8fa3', true);

  // sign board — 7: arrow points the other way on the twin
  roundRect(ctx, 252, 292, 116, 34, 6, '#fdf3e3');
  text(ctx, 'NOODLES', 310, 309, 17, '#c1443c');
  if (twin) {
    poly(ctx, [[262, 309], [276, 302], [276, 316]], '#c1443c');
    rect(ctx, 262, 306, 14, 6, '#c1443c');
  } else {
    poly(ctx, [[358, 309], [344, 302], [344, 316]], '#c1443c');
    rect(ctx, 344, 306, 14, 6, '#c1443c');
  }

  // bicycle with a flower basket — 8: basket flowers change colour
  const wheel = (x, y) => { ring(ctx, x, y, 17, '#dfe9f5', 3); circle(ctx, x, y, 3, '#dfe9f5'); };
  wheel(76, 398); wheel(142, 398);
  line(ctx, 76, 398, 108, 368, '#e4572e', 4);
  line(ctx, 108, 368, 142, 398, '#e4572e', 4);
  line(ctx, 108, 368, 132, 366, '#e4572e', 4);
  line(ctx, 132, 366, 142, 398, '#e4572e', 4);
  line(ctx, 132, 366, 138, 354, '#dfe9f5', 3);
  rect(ctx, 100, 360, 16, 5, '#22304a'); // saddle
  roundRect(ctx, 140, 356, 26, 18, 3, '#a97c50'); // basket
  const basketFlower = twin ? '#c86dd7' : '#ff8fa3';
  flower(ctx, 147, 352, basketFlower);
  flower(ctx, 157, 350, basketFlower);

  // cat on a crate — 9: gone on the twin
  roundRect(ctx, 520, 356, 52, 40, 3, '#8a6238');
  line(ctx, 520, 376, 572, 376, '#6b4a2f', 3);
  if (!twin) {
    ellipse(ctx, 546, 344, 17, 11, '#f5f0e6');
    circle(ctx, 560, 334, 8.5, '#f5f0e6');
    poly(ctx, [[553, 328], [556, 319], [560, 328]], '#f5f0e6');
    poly(ctx, [[560, 328], [564, 319], [568, 328]], '#f5f0e6');
    circle(ctx, 562, 333, 1.8, '#22304a');
    ctx.beginPath();
    ctx.moveTo(531, 348);
    ctx.quadraticCurveTo(518, 338, 522, 324);
    ctx.strokeStyle = '#f5f0e6'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.stroke();
  }

  // 10: a paper star garland strand on the original only (right edge)
  if (!twin) {
    line(ctx, 592, 150, 592, 300, 'rgba(20,20,30,0.8)', 1.6);
    for (const gy of [168, 196, 224, 252, 280]) star(ctx, 592, gy, 8, '#ffd93b');
  }
}

const market = {
  id: 'night-market',
  name: 'Night Market',
  timeLimit: 240,
  hints: 3,
  draw: drawMarket,
  differences: [
    { x: 540, y: 64, r: 32, label: 'the moon is full, not crescent' },
    { x: 380, y: 96, r: 20, label: 'a star is missing' },
    { x: 545, y: 227, r: 24, label: 'a window went dark' },
    { x: 426, y: 150, r: 24, label: 'a string-light bulb is out' },
    { x: 53, y: 246, r: 30, label: 'the apples became oranges' },
    { x: 310, y: 228, r: 26, label: 'the middle lantern changed colour' },
    { x: 310, y: 309, r: 34, label: 'the noodle sign arrow flipped' },
    { x: 152, y: 358, r: 26, label: 'the basket flowers changed colour' },
    { x: 546, y: 340, r: 28, label: 'the cat on the crate is gone' },
    { x: 592, y: 224, r: 30, label: 'the star garland is missing' },
  ],
};

/* ------------------------------------------------------------------ */
/* Scene 3: Star Camp — twelve differences.                            */
/* ------------------------------------------------------------------ */

function drawCamp(ctx, twin) {
  skyGradient(ctx, PANEL_W, PANEL_H, '#0e1a33', '#27406b');
  moon(ctx, 96, 66, 24, false);
  // stars + a little constellation — 1: one constellation star missing on the twin
  const stars = [[190, 40], [260, 70], [330, 36], [420, 58], [500, 34], [560, 84], [150, 110], [480, 120], [40, 150], [590, 160]];
  for (const [sx, sy] of stars) sparkle(ctx, sx, sy, 4.5, 'rgba(255,240,190,0.85)');
  const dipper = [[352, 92], [382, 80], [412, 84], [438, 100], [462, 92]];
  ctx.beginPath();
  dipper.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.strokeStyle = 'rgba(160,190,240,0.5)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  dipper.forEach(([px, py], i) => {
    if (twin && i === 2) return;
    sparkle(ctx, px, py, 6, '#ffe9a3');
  });
  // 2: shooting star on the original only
  if (!twin) {
    line(ctx, 210, 128, 258, 104, 'rgba(255,255,255,0.9)', 3);
    line(ctx, 218, 124, 252, 106, 'rgba(255,255,255,0.45)', 2);
    sparkle(ctx, 262, 102, 7, '#ffffff');
  }

  // mountains
  poly(ctx, [[0, 268], [110, 176], [220, 252], [330, 168], [440, 248], [540, 186], [620, 240], [620, 300], [0, 300]], '#33456b');
  poly(ctx, [[92, 196], [110, 176], [130, 198], [118, 204], [108, 196], [100, 205]], '#dfe9f5'); // snow caps
  poly(ctx, [[310, 190], [330, 168], [352, 192], [338, 198], [328, 189], [320, 199]], '#dfe9f5');
  poly(ctx, [[524, 204], [540, 186], [558, 206], [546, 211], [538, 203], [531, 212]], '#dfe9f5');

  // meadow
  rect(ctx, 0, 296, PANEL_W, PANEL_H - 296, '#1e4d38');
  rect(ctx, 0, 296, PANEL_W, 6, '#2a6b4e');

  // pines — 3: a star tops the tall pine on the original only
  pineTree(ctx, 44, 340, 1.1, '#17573a');
  pineTree(ctx, 96, 352, 0.8, '#1f6f4a');
  pineTree(ctx, 540, 348, 1.25, '#17573a');
  pineTree(ctx, 588, 356, 0.85, '#1f6f4a');
  pineTree(ctx, 500, 360, 0.7, '#1f6f4a');
  if (!twin) star(ctx, 540, 218, 11, '#ffd93b');

  // owl on a branch — 4: eyes closed on the twin
  line(ctx, 28, 300, 86, 292, '#6b4a2f', 6);
  ellipse(ctx, 62, 272, 13, 16, '#8a6238');
  circle(ctx, 62, 258, 10, '#a97c50');
  poly(ctx, [[53, 252], [56, 244], [60, 251]], '#a97c50');
  poly(ctx, [[64, 251], [68, 244], [71, 252]], '#a97c50');
  if (twin) {
    line(ctx, 54, 258, 60, 258, '#22304a', 2.2);
    line(ctx, 64, 258, 70, 258, '#22304a', 2.2);
  } else {
    circle(ctx, 57, 258, 3.4, '#ffd93b');
    circle(ctx, 67, 258, 3.4, '#ffd93b');
    circle(ctx, 57, 258, 1.6, '#22304a');
    circle(ctx, 67, 258, 1.6, '#22304a');
  }
  poly(ctx, [[59, 264], [65, 264], [62, 269]], '#f2b134');

  // tent — 5: door open on the original, closed on the twin; 6: flag colour
  poly(ctx, [[196, 392], [286, 268], [376, 392]], '#e4572e');
  poly(ctx, [[196, 392], [286, 268], [376, 392], [352, 392], [286, 292], [220, 392]], '#d1544a');
  if (twin) {
    poly(ctx, [[252, 392], [286, 320], [320, 392]], '#c1443c');
    line(ctx, 286, 320, 286, 392, '#8a2f2a', 3);
  } else {
    poly(ctx, [[252, 392], [286, 320], [320, 392]], '#3a2415');
    poly(ctx, [[286, 320], [320, 392], [300, 392]], '#c1443c'); // rolled flap
    ellipse(ctx, 286, 372, 16, 12, 'rgba(255,200,90,0.35)'); // warm glow inside
  }
  line(ctx, 286, 268, 286, 246, '#dfe9f5', 3);
  poly(ctx, [[286, 246], [308, 252], [286, 259]], twin ? '#3ddc84' : '#ffd93b');
  line(ctx, 196, 392, 168, 410, '#dfe9f5', 2);
  line(ctx, 376, 392, 404, 410, '#dfe9f5', 2);
  circle(ctx, 168, 411, 3, '#dfe9f5');
  circle(ctx, 404, 411, 3, '#dfe9f5');

  // campfire — 7: one log fewer on the twin; 8: marshmallow stick gone on the twin
  ellipse(ctx, 452, 404, 44, 12, '#5a4632');
  line(ctx, 424, 400, 478, 392, '#6b4a2f', 8);
  line(ctx, 426, 390, 476, 402, '#7a5636', 8);
  if (!twin) line(ctx, 436, 384, 470, 406, '#6b4a2f', 7);
  poly(ctx, [[436, 392], [452, 348], [468, 392]], '#f07f13');
  poly(ctx, [[442, 392], [452, 362], [462, 392]], '#ffd93b');
  poly(ctx, [[447, 392], [452, 374], [457, 392]], '#fff3b0');
  sparkle(ctx, 444, 340, 4, '#ffb35c');
  sparkle(ctx, 462, 330, 3, '#ffb35c');
  if (!twin) {
    line(ctx, 486, 408, 462, 372, '#a97c50', 3);
    roundRect(ctx, 454, 360, 15, 11, 4, '#ffffff');
  }

  // backpack — 9: colour differs
  const pack = twin ? '#3a6fd8' : '#17a398';
  roundRect(ctx, 112, 356, 40, 46, 10, pack);
  roundRect(ctx, 120, 372, 24, 20, 5, twin ? '#2c56ad' : '#128a80');
  line(ctx, 124, 356, 124, 348, '#22304a', 3);
  line(ctx, 140, 356, 140, 348, '#22304a', 3);

  // stump with a mug — 10: mug colour differs
  rect(ctx, 168, 388, 34, 26, '#8a6238');
  ellipse(ctx, 185, 388, 17, 5, '#c9a06a');
  roundRect(ctx, 176, 366, 18, 20, 3, twin ? '#c86dd7' : '#e4572e');
  ctx.beginPath();
  ctx.arc(198, 376, 6, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = twin ? '#c86dd7' : '#e4572e';
  ctx.lineWidth = 3.4;
  ctx.stroke();
  line(ctx, 182, 360, 180, 352, 'rgba(255,255,255,0.7)', 2.4);
  line(ctx, 189, 360, 191, 352, 'rgba(255,255,255,0.7)', 2.4);

  // ground lantern — 11: lit on the original, dark on the twin
  roundRect(ctx, 512, 372, 26, 34, 5, '#22304a');
  rect(ctx, 516, 378, 18, 20, twin ? '#39466b' : '#ffd93b');
  if (!twin) ellipse(ctx, 525, 388, 26, 16, 'rgba(255,210,90,0.22)');
  line(ctx, 519, 372, 525, 364, '#22304a', 3);
  line(ctx, 531, 372, 525, 364, '#22304a', 3);

  // sleeping bag — 12: stripe colour differs
  roundRect(ctx, 316, 404, 96, 24, 12, '#3a6fd8');
  const stripe = twin ? '#ffd93b' : '#ff8fa3';
  rect(ctx, 332, 404, 8, 24, stripe);
  rect(ctx, 356, 404, 8, 24, stripe);
  rect(ctx, 380, 404, 8, 24, stripe);
  ellipse(ctx, 322, 416, 10, 9, '#fdf3e3'); // pillow

  // fireflies
  for (const [fx, fy] of [[140, 320], [420, 330], [560, 320], [240, 410], [590, 392]]) {
    circle(ctx, fx, fy, 2.6, 'rgba(255,240,150,0.9)');
  }
  flower(ctx, 60, 416, '#c86dd7');
  flower(ctx, 430, 424, '#ff8fa3');
  flower(ctx, 560, 420, '#ffd93b');
}

const camp = {
  id: 'star-camp',
  name: 'Star Camp',
  timeLimit: 300,
  hints: 3,
  draw: drawCamp,
  differences: [
    { x: 412, y: 84, r: 20, label: 'a constellation star is missing' },
    { x: 236, y: 116, r: 30, label: 'the shooting star is gone' },
    { x: 540, y: 218, r: 22, label: 'the pine-top star is missing' },
    { x: 62, y: 260, r: 22, label: 'the owl closed its eyes' },
    { x: 286, y: 362, r: 34, label: 'the tent door is closed' },
    { x: 297, y: 252, r: 18, label: 'the tent flag changed colour' },
    { x: 452, y: 396, r: 26, label: 'a campfire log is missing' },
    { x: 468, y: 378, r: 24, label: 'the marshmallow stick is gone' },
    { x: 132, y: 379, r: 28, label: 'the backpack changed colour' },
    { x: 185, y: 376, r: 20, label: 'the mug changed colour' },
    { x: 525, y: 388, r: 22, label: 'the lantern went out' },
    { x: 364, y: 416, r: 34, label: 'the sleeping-bag stripes changed colour' },
  ],
};

export const SCENES = [harbor, market, camp];
