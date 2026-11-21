// input.js — mouse and keyboard play. The mouse clicks a panel directly; the
// keyboard drives a crosshair (arrows move, Enter marks) so the game is fully
// playable without a mouse. Handlers are callbacks owned by main.js.

import { CANVAS_W, CANVAS_H, panelPoint } from './render.js';
import { PANEL_W, PANEL_H } from './scenes.js';

const STEP = 14; // crosshair pixels per arrow press (Shift = fine, 4px)

export function makeCrosshair() {
  return { panel: 0, x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
}

function canvasPoint(canvas, event) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - r.left) / r.width) * CANVAS_W,
    y: ((event.clientY - r.top) / r.height) * CANVAS_H,
  };
}

export function attachInput(canvas, crosshair, handlers) {
  canvas.addEventListener('mousemove', (event) => {
    const p = canvasPoint(canvas, event);
    const hit = panelPoint(p.x, p.y);
    if (hit) {
      crosshair.panel = hit.panel;
      crosshair.x = hit.x;
      crosshair.y = hit.y;
      crosshair.visible = true;
    } else {
      crosshair.visible = false;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    crosshair.visible = false;
  });

  canvas.addEventListener('click', (event) => {
    const p = canvasPoint(canvas, event);
    const hit = panelPoint(p.x, p.y);
    if (hit) handlers.onGuess(hit.x, hit.y);
  });

  window.addEventListener('keydown', (event) => {
    const fine = event.shiftKey ? 4 : STEP;
    const move = (dx, dy) => {
      crosshair.visible = true;
      crosshair.x = Math.max(0, Math.min(PANEL_W - 1, crosshair.x + dx));
      crosshair.y = Math.max(0, Math.min(PANEL_H - 1, crosshair.y + dy));
      event.preventDefault();
    };
    switch (event.key) {
      case 'ArrowLeft': move(-fine, 0); break;
      case 'ArrowRight': move(fine, 0); break;
      case 'ArrowUp': move(0, -fine); break;
      case 'ArrowDown': move(0, fine); break;
      case 'Tab':
        crosshair.panel = crosshair.panel === 0 ? 1 : 0;
        crosshair.visible = true;
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        if (crosshair.visible) {
          handlers.onGuess(crosshair.x, crosshair.y);
          event.preventDefault();
        }
        break;
      case 'h': case 'H': handlers.onHint(); break;
      case 'r': case 'R': handlers.onRestart(); break;
      case '1': handlers.onScene(0); break;
      case '2': handlers.onScene(1); break;
      case '3': handlers.onScene(2); break;
      default: break;
    }
  });
}
