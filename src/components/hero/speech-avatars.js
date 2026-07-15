/**
 * In-page profile avatars that can host the shared speech bubble.
 * Mark hosts with `data-speech-avatar="<id>"` and one of the selector classes.
 */

export const SPEECH_ANCHOR_BRAND = "brand";

/** Profile avatars eligible to host speech (must also carry data-speech-avatar). */
export const SPEECH_AVATAR_SELECTOR = [
  ".hero__avatar-btn[data-speech-avatar]",
  ".media-shelf__avatar[data-speech-avatar]",
  ".steam-invite__avatar[data-speech-avatar]",
  ".hub-card__avatar[data-speech-avatar]",
].join(", ");

/** Min visible fraction before an avatar can steal the bubble from the header. */
export const SPEECH_AVATAR_MIN_RATIO = 0.22;

/** Dense thresholds so ratio updates smoothly while scrolling. */
export const SPEECH_AVATAR_THRESHOLDS = [0, 0.1, 0.22, 0.35, 0.5, 0.75, 1];

/**
 * @typedef {{
 *   intersecting: boolean,
 *   ratio: number,
 *   top: number,
 *   bottom: number,
 * }} SpeechAvatarVisibility
 */

/**
 * @param {Element | null | undefined} el
 * @returns {string | null}
 */
export function speechAvatarId(el) {
  const id = el?.getAttribute?.("data-speech-avatar")?.trim();
  if (!id || id === SPEECH_ANCHOR_BRAND) return null;
  return id;
}

/**
 * Pick the best on-screen avatar, or fall back to the topbar brand slot.
 *
 * Prefers higher intersection ratio; ties break toward the viewport center.
 *
 * @param {Map<string, SpeechAvatarVisibility> | null | undefined} visibility
 * @param {{
 *   viewportHeight?: number,
 *   minRatio?: number,
 * }} [opts]
 * @returns {string}
 */
export function pickSpeechAnchor(visibility, opts = {}) {
  if (!visibility?.size) return SPEECH_ANCHOR_BRAND;

  const minRatio = opts.minRatio ?? SPEECH_AVATAR_MIN_RATIO;
  const viewportHeight = opts.viewportHeight ?? window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  let bestId = null;
  let bestScore = -Infinity;

  for (const [id, state] of visibility) {
    if (!state?.intersecting || state.ratio < minRatio) continue;

    const mid = (state.top + state.bottom) / 2;
    const centerDist = Math.abs(mid - viewportCenter);
    const score = state.ratio * 1000 - centerDist;

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId ?? SPEECH_ANCHOR_BRAND;
}

/**
 * Apply one IntersectionObserver entry into the visibility map.
 *
 * @param {Map<string, SpeechAvatarVisibility>} visibility
 * @param {IntersectionObserverEntry} entry
 * @returns {boolean} true when the map changed
 */
export function applySpeechAvatarEntry(visibility, entry) {
  const id = speechAvatarId(entry.target);
  if (!id) return false;

  const next = {
    intersecting: entry.isIntersecting,
    ratio: entry.intersectionRatio,
    top: entry.boundingClientRect.top,
    bottom: entry.boundingClientRect.bottom,
  };

  const prev = visibility.get(id);
  if (
    prev &&
    prev.intersecting === next.intersecting &&
    prev.ratio === next.ratio &&
    prev.top === next.top &&
    prev.bottom === next.bottom
  ) {
    return false;
  }

  visibility.set(id, next);
  return true;
}
