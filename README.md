# makefun-best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mgigin/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mgigin/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Double Take** — an original spot-the-difference game in plain static files. Two near-identical
canvas pictures side by side; click every change on either panel.

## The game

- **Title screen** with scene-select cards (live previews drawn by the game's own code).
- **3 scenes, rising difficulty:** Harbor Morning (8 differences, par 1:30),
  Night Market (10, par 2:00), Star Camp (14, par 2:30).
- Big **"N to find"** counter, timer vs par, **strikes** for wrong clicks, **3 hints** per
  scene (pulsing ring), **pause**, found-progress dots, running score.
- **Scene-complete modal** with 1–3 star rating (time, strikes, hints) and a total score.
- Mouse **and keyboard**: arrows move a reticle, Enter marks, Tab switches panel, H hints, P pauses.
- WebAudio feedback sounds; everything drawn from scratch in `game/scenes.js` — no assets, no network.

## Run it

Serve `game/` with any static server and open `index.html` in desktop Chrome, e.g.
`python3 -m http.server -d game 8080`. Hand-in: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=c6yw2yzb&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
