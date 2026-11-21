// render.js — draws the two panels and everything on top of them: the scene
// itself (twice), rings on the differences found, a pulsing hint ring, the
// wrong-guess cross, the keyboard crosshair, and the found-counter strip.

import { PANEL_W, PANEL_H } from './scenes.js';
import { remaining } from './state.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 520;
export const PANEL_Y = 46;
export const PANEL_X = [12, 648]; // left panel, right panel

/** Map a canvas point to panel coordinates, or null when it misses both panels. */
export function panelPoint(cx, cy) {
  for (let p = 0; p < 2; p++) {
    const x = cx - PANEL_X[p];
    const y = cy - PANEL_Y;
    if (x >= 0 && x < PANEL_W && y >= 0 && y < PANEL_H) return { panel: p, x, y };
  }
  return null;
}

function drawPanel(ctx, round, panel, now) {
  const ox = PANEL_X[panel];
  const oy = PANEL_Y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(ox, oy);
  round.scene.draw(ctx, panel === 1);

  // markers on every difference found so far — drawn on both panels
  const diffs = round.scene.differences;
  for (const i of round.found) {
    const d = diffs[i];
    const age = now - round.lastFindAt;
    const pop = i === round.lastFindIndex && age < 350 ? 1 + 0.35 * (1 - age / 350) : 1;
    const r = d.r * pop;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#17a398';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    // little check badge at the ring's edge
    const bx = d.x + r * 0.72;
    const by = d.y - r * 0.72;
    ctx.beginPath();
    ctx.arc(bx, by, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#17a398';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(bx - 4.5, by);
    ctx.lineTo(bx - 1.2, by + 3.6);
    ctx.lineTo(bx + 4.8, by - 3.6);
    ctx.stroke();
  }

  // hint ring: pulses around the hinted difference until it fades
  if (round.hintIndex >= 0 && now < round.hintUntil) {
    const d = diffs[round.hintIndex];
    const pulse = 1 + 0.18 * Math.sin(now / 160);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#f2b134';
    ctx.lineWidth = 4;
    ctx.setLineDash([9, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // wrong-guess cross, fading out
  if (round.wrongPoint && now - round.wrongAt < 600) {
    const { x, y } = round.wrongPoint;
    const a = 1 - (now - round.wrongAt) / 600;
    ctx.strokeStyle = `rgba(230,59,46,${a})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 11);
    ctx.lineTo(x + 11, y + 11);
    ctx.moveTo(x + 11, y - 11);
    ctx.lineTo(x - 11, y + 11);
    ctx.stroke();
  }
  ctx.restore();

  // panel frame + label
  ctx.strokeStyle = '#22304a';
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, oy, PANEL_W, PANEL_H);
  ctx.fillStyle = '#f6f1e7';
  ctx.font = '700 17px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(panel === 0 ? 'ORIGINAL' : 'TWIN', ox + PANEL_W / 2, oy - 22);
}

function drawCrosshair(ctx, crosshair) {
  if (!crosshair.visible) return;
  const ox = PANEL_X[crosshair.panel];
  const x = ox + crosshair.x;
  const y = PANEL_Y + crosshair.y;
  ctx.strokeStyle = '#f2b134';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 20, y); ctx.lineTo(x - 7, y);
  ctx.moveTo(x + 7, y); ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 7);
  ctx.moveTo(x, y + 7); ctx.lineTo(x, y + 20);
  ctx.stroke();
  ctx.fillStyle = '#f2b134';
  ctx.beginPath();
  ctx.arc(x, y, 2.4, 0, Math.PI * 2);
  ctx.fill();
}

export function render(ctx, round, crosshair, now) {
  ctx.fillStyle = '#101c2e';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanel(ctx, round, 0, now);
  drawPanel(ctx, round, 1, now);
  drawCrosshair(ctx, crosshair);

  // counter strip under the panels — readable at a glance, also in screenshots
  const total = round.scene.differences.length;
  const found = round.found.size;
  const left = remaining(round);
  ctx.fillStyle = '#f6f1e7';
  ctx.font = '700 21px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const msg = round.won
    ? `${round.scene.name} — all ${total} differences found!`
    : `${round.scene.name} — ${found} of ${total} found · ${left} still hiding`;
  ctx.fillText(msg, CANVAS_W / 2, PANEL_Y + PANEL_H + 18);
}
