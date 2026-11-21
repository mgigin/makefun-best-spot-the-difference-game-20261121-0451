# Twin Lens — Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mgigin/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mgigin/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Twin Lens** is a spot-the-difference game for the browser. Two near-identical
pictures sit side by side — an original and its twin — and the twin quietly
changes a handful of things. Find them all before the clock runs out.

## Scenes

1. **Harbor Morning** — 7 differences, 3:00 on the clock. A lighthouse, a
   sailboat, a gull that may or may not be there.
2. **Night Market** — 10 differences, 4:00. String lights, lanterns, a cat
   on a crate, and one bulb that went dark.
3. **Star Camp** — 12 differences, 5:00. A tent, a campfire, an owl that
   blinks, and a constellation with a missing star.

Every picture is drawn from code on a canvas — no image assets, no network,
no build step.

## How to play

- **Mouse:** click a spot where the two pictures differ. Found differences get
  a ring on both panels; a wrong guess costs 5 seconds.
- **Keyboard:** arrow keys move the crosshair (Shift = fine), `Tab` switches
  panels, `Enter` marks a guess, `H` spends a hint, `R` restarts the scene,
  `1`–`3` switch scenes.
- **Hints:** 3 per scene. A hint rings one unfound difference for a few
  seconds and costs 50 points.
- **Score:** 100 points per find, plus 2 points per second left when you
  finish. Stars reward fast, hint-free clears.

## Run it

Serve the `game/` folder with any static file server and open it in a
browser:

```sh
python3 -m http.server --directory game 8080
# then open http://localhost:8080
```

To hand the entry in (copies `game/` and `screenshots/` to `out/` and writes
the dossier):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `game/index.html` — page shell and HUD
- `game/src/scenes.js` — the three pictures and their difference lists
- `game/src/paint.js` — canvas drawing helpers
- `game/src/state.js` — round rules: finds, hints, timer, score
- `game/src/render.js` — panels, markers, hint ring, counter
- `game/src/input.js` — mouse + keyboard play
- `game/src/sound.js` — synthesized WebAudio bleeps
- `main.ts` — the hand-in program (Node 22, standard library only)
- `vendor/makefun-game.ts` — the make.fun kit library, unchanged

Built for the [best spot the difference game bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
on make.fun. New here? [Join with my referral link](https://make.fun/r/c6yw2yzb).
