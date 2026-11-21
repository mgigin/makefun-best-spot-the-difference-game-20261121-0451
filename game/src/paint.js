// paint.js — small canvas drawing helpers shared by every scene.
// Each helper takes the 2d context first, so scene code reads like a list of
// shapes: circle(ctx, x, y, r, colour), rect(ctx, x, y, w, h, colour), …

export function circle(ctx, x, y, r, colour) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = colour;
  ctx.fill();
}

export function ring(ctx, x, y, r, colour, width) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function ellipse(ctx, x, y, rx, ry, colour) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = colour;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, colour) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = colour;
  ctx.fill();
}

export function poly(ctx, points, colour) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, colour, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function skyGradient(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function cloud(ctx, x, y, s, colour = 'rgba(255,255,255,0.95)') {
  ellipse(ctx, x, y, 34 * s, 15 * s, colour);
  ellipse(ctx, x - 24 * s, y + 5 * s, 22 * s, 11 * s, colour);
  ellipse(ctx, x + 26 * s, y + 5 * s, 24 * s, 12 * s, colour);
  ellipse(ctx, x + 2 * s, y - 9 * s, 20 * s, 12 * s, colour);
}

export function sun(ctx, x, y, r, sunglasses) {
  // rays
  ctx.strokeStyle = '#f7c948';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5));
    ctx.lineTo(x + Math.cos(a) * (r + 15), y + Math.sin(a) * (r + 15));
    ctx.stroke();
  }
  circle(ctx, x, y, r, '#ffd93b');
  circle(ctx, x, y, r - 5, '#ffe066');
  if (sunglasses) {
    roundRect(ctx, x - r * 0.72, y - r * 0.28, r * 0.6, r * 0.42, 5, '#22304a');
    roundRect(ctx, x + r * 0.12, y - r * 0.28, r * 0.6, r * 0.42, 5, '#22304a');
    line(ctx, x - r * 0.12, y - r * 0.1, x + r * 0.12, y - r * 0.1, '#22304a', 4);
  } else {
    circle(ctx, x - r * 0.32, y - r * 0.12, 3.4, '#8a5a00');
    circle(ctx, x + r * 0.32, y - r * 0.12, 3.4, '#8a5a00');
    ctx.beginPath();
    ctx.arc(x, y + r * 0.12, r * 0.4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#8a5a00';
    ctx.lineWidth = 3.4;
    ctx.stroke();
  }
}

export function moon(ctx, x, y, r, crescent) {
  circle(ctx, x, y, r, '#f4ead2');
  circle(ctx, x - r * 0.3, y - r * 0.2, r * 0.16, '#e2d3ac');
  circle(ctx, x + r * 0.25, y + r * 0.3, r * 0.12, '#e2d3ac');
  if (crescent) {
    // bite a crescent out of the disc with the sky colour of the night scenes
    circle(ctx, x + r * 0.55, y - r * 0.25, r * 0.78, '#1b2a4a');
  }
}

export function star(ctx, x, y, r, colour = '#ffe9a3') {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
}

export function sparkle(ctx, x, y, r, colour = '#ffffff') {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fillStyle = colour;
  ctx.fill();
}

export function bird(ctx, x, y, s, colour = '#33506e') {
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 12 * s, y);
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function pineTree(ctx, x, groundY, s, colour = '#1f6f4a', trunk = '#6b4a2f') {
  rect(ctx, x - 4 * s, groundY - 16 * s, 8 * s, 16 * s, trunk);
  poly(ctx, [[x - 26 * s, groundY - 12 * s], [x, groundY - 58 * s], [x + 26 * s, groundY - 12 * s]], colour);
  poly(ctx, [[x - 20 * s, groundY - 40 * s], [x, groundY - 80 * s], [x + 20 * s, groundY - 40 * s]], colour);
  poly(ctx, [[x - 14 * s, groundY - 64 * s], [x, groundY - 98 * s], [x + 14 * s, groundY - 64 * s]], colour);
}

export function flower(ctx, x, y, petal, centre = '#ffd93b') {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, petal);
  }
  circle(ctx, x, y, 3.6, centre);
}

export function wave(ctx, x, y, w, colour) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + w * 0.25, y - 7, x + w * 0.5, y);
  ctx.quadraticCurveTo(x + w * 0.75, y + 7, x + w, y);
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function lantern(ctx, x, y, s, body, lit) {
  line(ctx, x, y - 16 * s, x, y - 6 * s, '#3a3a3a', 2);
  ellipse(ctx, x, y + 6 * s, 13 * s, 15 * s, body);
  if (lit) ellipse(ctx, x, y + 6 * s, 7 * s, 9 * s, 'rgba(255,220,120,0.95)');
  rect(ctx, x - 6 * s, y - 10 * s, 12 * s, 4 * s, '#8a6d1f');
  rect(ctx, x - 6 * s, y + 19 * s, 12 * s, 4 * s, '#8a6d1f');
  line(ctx, x, y + 23 * s, x, y + 30 * s, '#c1443c', 2.4);
}

export function text(ctx, str, x, y, size, colour, align = 'center', weight = '700') {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}
