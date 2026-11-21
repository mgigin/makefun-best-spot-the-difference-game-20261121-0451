// state.js — the rules of a round: what is found, what it costs, when it ends.
// Pure bookkeeping, no drawing and no DOM, so the rules stay easy to reason
// about: a find pays points, a wrong guess burns seconds, a hint is limited,
// and the round ends when everything is found or the clock runs out.

export const POINTS_PER_FIND = 100;
export const WRONG_GUESS_SECONDS = 5;
export const HINT_COST = 50;

export function newRound(scene) {
  return {
    scene,
    found: new Set(),        // indices into scene.differences
    score: 0,
    mistakes: 0,
    hintsLeft: scene.hints,
    hintsUsed: 0,
    secondsLeft: scene.timeLimit,
    finished: false,
    won: false,
    lastFindAt: -Infinity,   // performance.now() of the latest find, for the pop animation
    lastFindIndex: -1,
    hintIndex: -1,           // difference the current hint points at
    hintUntil: 0,            // performance.now() when the hint ring fades
    wrongAt: -Infinity,      // performance.now() of the latest wrong guess
    wrongPoint: null,        // {x, y} in panel coordinates
  };
}

export function remaining(round) {
  return round.scene.differences.length - round.found.size;
}

/** Judge a guess at panel point (x, y). Returns 'found' | 'already' | 'wrong' | 'over'. */
export function guess(round, x, y, now) {
  if (round.finished) return 'over';
  const diffs = round.scene.differences;
  for (let i = 0; i < diffs.length; i++) {
    const d = diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      if (round.found.has(i)) return 'already';
      round.found.add(i);
      round.score += POINTS_PER_FIND;
      round.lastFindAt = now;
      round.lastFindIndex = i;
      if (round.hintIndex === i) round.hintIndex = -1;
      if (round.found.size === diffs.length) {
        round.finished = true;
        round.won = true;
        round.score += Math.round(round.secondsLeft) * 2; // time bonus
      }
      return 'found';
    }
  }
  round.mistakes++;
  round.wrongAt = now;
  round.wrongPoint = { x, y };
  round.secondsLeft = Math.max(0, round.secondsLeft - WRONG_GUESS_SECONDS);
  if (round.secondsLeft <= 0) round.finished = true;
  return 'wrong';
}

/** Spend a hint: points at the first unfound difference. Returns its index or -1. */
export function useHint(round, now) {
  if (round.finished || round.hintsLeft <= 0) return -1;
  const diffs = round.scene.differences;
  for (let i = 0; i < diffs.length; i++) {
    if (!round.found.has(i)) {
      round.hintsLeft--;
      round.hintsUsed++;
      round.score = Math.max(0, round.score - HINT_COST);
      round.hintIndex = i;
      round.hintUntil = now + 2600;
      return i;
    }
  }
  return -1;
}

/** Advance the clock by dt seconds. Returns true when the round just ended. */
export function tick(round, dt) {
  if (round.finished) return false;
  round.secondsLeft = Math.max(0, round.secondsLeft - dt);
  if (round.secondsLeft <= 0) {
    round.finished = true;
    return true;
  }
  return false;
}

/** Stars for a won round: fast and hint-free earns three. */
export function starsFor(round) {
  if (!round.won) return 0;
  const timeShare = round.secondsLeft / round.scene.timeLimit;
  let stars = 1;
  if (timeShare > 0.25) stars++;
  if (timeShare > 0.5 && round.hintsUsed === 0) stars++;
  return stars;
}

export function formatClock(seconds) {
  const s = Math.ceil(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
