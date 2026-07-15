import { corruptEchoContent } from "./backrooms-text.js";
import { initReveal } from "../../shared/lib/reveal.js";

const MAX_ECHOES = 12;
const SOURCE_ATTR = "data-infinite-source";
/** Keep at least this many viewports of buffer before the footer. */
const BUFFER_VH = 3;
/** How many loops until text / visual ramps finish. */
const RAMP_LOOPS = 9;
/** Loop index where CSS warp / haze starts climbing (1-based). */
const CSS_START_LOOP = 6;
/** CSS strength scale (eased into this). */
const CSS_DEPTH_PEAK = 14;
/** Echo loop at which liminal marks start speaking via the avatar bubble. */
const MARK_MESSAGE_FROM_LOOP = 3;

const GLITCH_CHARS = "░▒▓█▌▐╱╲|_-=+*~";

/**
 * Keeps cloning the store content ahead of the footer so scroll never catches it.
 * Each echo intensifies a Backrooms-style liminal distortion.
 * From loop 3+, entering an echo triggers an avatar speech mark via `onMark`.
 */
export function initInfiniteScroll({
  source,
  echoes,
  sentinel,
  getMarks,
  onMark,
}) {
  if (!source || !echoes || !sentinel) {
    return {
      reset() {},
      destroy() {},
      pause() {},
      resume() {},
      seedFromLoop() {},
      getLoop() {
        return 0;
      },
    };
  }

  let loop = 0;
  let ticking = false;
  let paused = false;
  let glitchTimer = null;
  let lastGlitchAt = 0;
  const markObservers = new Set();
  const spokenLoops = new Set();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function bufferPx() {
    return window.innerHeight * BUFFER_VH;
  }

  function needsMore() {
    if (paused) return false;
    return sentinel.getBoundingClientRect().top < window.innerHeight + bufferPx();
  }

  function makeRoom() {
    while (echoes.children.length >= MAX_ECHOES) {
      const first = echoes.firstElementChild;
      if (!first) return false;

      const rect = first.getBoundingClientRect();
      // Never recycle an echo that's still near/on screen — that causes jumps.
      if (rect.bottom > -80) return false;

      const height = first.offsetHeight;
      const y = window.scrollY;
      first.remove();
      // Force an instant jump; CSS `scroll-behavior: smooth` would animate back.
      jumpScrollTo(Math.max(0, y - height));
    }
    return true;
  }

  function speakMarkForLoop(loopNo) {
    if (!onMark || spokenLoops.has(loopNo) || loopNo < MARK_MESSAGE_FROM_LOOP) {
      return;
    }
    spokenLoops.add(loopNo);

    const marks = getMarks?.() || [];
    const { t } = echoStrength(loopNo);
    const rawMark =
      marks.length > 0
        ? marks[(loopNo - MARK_MESSAGE_FROM_LOOP) % marks.length]
        : `∞ ${loopNo}`;
    onMark(corruptMark(rawMark, t, loopNo));
  }

  function watchEchoMark(wrap, loopNo) {
    if (!onMark || loopNo < MARK_MESSAGE_FROM_LOOP) return;

    const markIo = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        markIo.disconnect();
        markObservers.delete(markIo);
        speakMarkForLoop(loopNo);
      },
      {
        root: null,
        // Fire when the top of the echo enters the lower half of the viewport.
        rootMargin: "0px 0px -35% 0px",
        threshold: 0,
      }
    );
    markObservers.add(markIo);
    markIo.observe(wrap);
  }

  function appendEcho() {
    if (!makeRoom()) return;

    loop += 1;
    const { t, depthCss, stage } = echoStrength(loop);

    const wrap = document.createElement("div");
    wrap.className = "infinite-echo";
    wrap.setAttribute("data-infinite-echo", String(loop));
    wrap.setAttribute("data-echo-depth", String(Math.round(depthCss)));
    wrap.setAttribute("data-echo-stage", stage);
    wrap.style.setProperty("--echo-depth", depthCss.toFixed(3));
    wrap.setAttribute("inert", "");
    // Clones are static snapshots — Alpine must not rebind x-for scopes.
    wrap.setAttribute("x-ignore", "");

    const clone = source.cloneNode(true);
    clone.removeAttribute(SOURCE_ATTR);
    neutralizeAlpineClone(clone);
    wrap.appendChild(clone);

    // First pass — early loops already fray; later ones melt harder.
    if (t > 0.02) {
      corruptEchoContent(wrap, t, {
        budget: Math.max(6, Math.ceil(12 + t * 55)),
      });
    }

    echoes.appendChild(wrap);
    initReveal(wrap, { immediate: true });
    watchEchoMark(wrap, loop);
  }

  function fillBuffer() {
    let guard = 0;
    while (needsMore() && guard < 4) {
      const before = echoes.children.length;
      const beforeHeight = document.documentElement.scrollHeight;
      appendEcho();
      guard += 1;

      // Safety: if nothing grew, stop to avoid a tight loop.
      if (
        echoes.children.length === before &&
        document.documentElement.scrollHeight === beforeHeight
      ) {
        break;
      }
    }
  }

  function glitchVisibleEchoes(force = false) {
    const now = performance.now();
    // Throttle scroll-driven ticks so text doesn't melt in a few frames.
    if (!force && now - lastGlitchAt < 55) return;
    lastGlitchAt = now;

    const viewTop = 0;
    const viewBottom = window.innerHeight;
    for (const echo of echoes.children) {
      const rect = echo.getBoundingClientRect();
      if (rect.bottom < viewTop || rect.top > viewBottom) continue;

      const loopNo = Number(echo.getAttribute("data-infinite-echo")) || 1;
      const { t } = echoStrength(loopNo);
      if (t < 0.02) continue;

      const visible =
        Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop);
      const coverage = Math.max(0, visible) / Math.max(1, rect.height);
      const budget = Math.max(
        2,
        Math.ceil(
          (4 + t * 18) * (0.5 + coverage * 0.9) * (reduceMotion ? 0.35 : 1)
        )
      );
      corruptEchoContent(echo, t, { budget });
    }
  }

  function onScrollOrResize() {
    if (paused || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (paused) return;
      fillBuffer();
      glitchVisibleEchoes(false);
    });
  }

  const observer = new IntersectionObserver(
    () => {
      if (!paused) fillBuffer();
    },
    {
      root: null,
      rootMargin: `0px 0px ${BUFFER_VH * 100}% 0px`,
      threshold: 0,
    }
  );

  observer.observe(sentinel);
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  // Slow ambient twitch while resting inside an echo.
  if (!reduceMotion) {
    glitchTimer = window.setInterval(() => {
      glitchVisibleEchoes(true);
    }, 160);
  }

  fillBuffer();

  function clearMarkObservers() {
    for (const markIo of markObservers) {
      markIo.disconnect();
    }
    markObservers.clear();
  }

  function pause() {
    paused = true;
  }

  function resume() {
    if (!paused) return;
    paused = false;
    fillBuffer();
  }

  function reset() {
    clearMarkObservers();
    spokenLoops.clear();
    loop = 0;
    echoes.replaceChildren();
    if (!paused) fillBuffer();
  }

  /**
   * Restart the echo feed as if the visitor had already reached `startLoop`.
   * Next clones begin at `startLoop` (1-based). Used by case rewards.
   * @param {number} startLoop
   */
  function seedFromLoop(startLoop) {
    const target = Math.max(1, Math.floor(Number(startLoop) || 1));
    clearMarkObservers();
    spokenLoops.clear();
    echoes.replaceChildren();
    // appendEcho does `loop += 1`, so seed one below the desired first label.
    loop = target - 1;
    if (!paused) fillBuffer();
  }

  function getLoop() {
    return loop;
  }

  function destroy() {
    paused = true;
    observer.disconnect();
    clearMarkObservers();
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
    if (glitchTimer != null) {
      window.clearInterval(glitchTimer);
      glitchTimer = null;
    }
    spokenLoops.clear();
    loop = 0;
    echoes.replaceChildren();
  }

  return { reset, destroy, pause, resume, seedFromLoop, getLoop };
}

/**
 * Text intensity (`t`) ramps early; visual CSS (`depthCss` / stage) stays quiet
 * until CSS_START_LOOP, then climbs to the peak.
 */
function echoStrength(loop) {
  const tLinear = Math.min(1, Math.max(0, (loop - 1) / (RAMP_LOOPS - 1)));
  const t = Math.min(1, 0.1 + tLinear * tLinear * 0.9);

  const cssSpan = Math.max(1, RAMP_LOOPS - CSS_START_LOOP);
  const cssLinear = Math.min(
    1,
    Math.max(0, (loop - CSS_START_LOOP) / cssSpan)
  );
  // Cubed so early post-start loops stay almost flat, late ones tip hard.
  const depthCss = cssLinear * cssLinear * cssLinear * CSS_DEPTH_PEAK;

  const stage = loop >= 11 ? "deep" : loop >= 8 ? "mid" : "early";
  return { t, depthCss, stage };
}

function jumpScrollTo(top) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = prev;
}

function corruptMark(text, t, loop) {
  if (t < 0.12) return text;

  const chars = [...String(text)];
  const swaps = Math.min(chars.length, Math.floor(1 + t * 6));
  for (let i = 0; i < swaps; i += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    if (/\s/.test(chars[idx])) continue;
    chars[idx] =
      GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }

  let result = chars.join("");
  if (t >= 0.45 && Math.random() < 0.35 + t * 0.25) {
    result = `${result} · no exit`;
  }
  if (t >= 0.75 && Math.random() < 0.35 + t * 0.2) {
    result = `LVL 0 · ${result}`;
  }
  if (loop >= 10 && Math.random() < 0.3) {
    result = result.replace(/\s+/g, "░");
  }
  return result;
}

/** Strip Alpine bindings / templates so clones stay inert snapshots. */
function neutralizeAlpineClone(root) {
  root.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  root
    .querySelectorAll("[aria-labelledby]")
    .forEach((el) => el.removeAttribute("aria-labelledby"));

  const nodes = [root, ...root.querySelectorAll("*")];
  for (const el of nodes) {
    for (const attr of [...el.attributes]) {
      const name = attr.name;
      if (
        name.startsWith("x-") ||
        name.startsWith("@") ||
        name.startsWith(":") ||
        name === "x-cloak"
      ) {
        el.removeAttribute(name);
      }
    }
  }

  // x-for leaves both <template> and rendered siblings — drop templates.
  root.querySelectorAll("template").forEach((el) => el.remove());
}
