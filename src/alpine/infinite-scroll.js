import { corruptEchoContent } from "./backrooms-text.js";
import { initReveal } from "./reveal.js";

const MAX_ECHOES = 12;
const SOURCE_ATTR = "data-infinite-source";
/** Keep at least this many viewports of buffer before the footer. */
const BUFFER_VH = 3;
/** How many loops until distortion reaches its peak. */
const RAMP_LOOPS = 28;
/** CSS strength scale (eased into this). */
const CSS_DEPTH_PEAK = 14;

const GLITCH_CHARS = "░▒▓█▌▐╱╲|_-=+*~";

/**
 * Keeps cloning the store content ahead of the footer so scroll never catches it.
 * Each echo intensifies a Backrooms-style liminal distortion.
 */
export function initInfiniteScroll({
  source,
  echoes,
  sentinel,
  getMarks,
}) {
  if (!source || !echoes || !sentinel) {
    return { reset() {}, destroy() {} };
  }

  let loop = 0;
  let ticking = false;
  let glitchTimer = null;
  let lastGlitchAt = 0;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function bufferPx() {
    return window.innerHeight * BUFFER_VH;
  }

  function needsMore() {
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

  function appendEcho() {
    if (!makeRoom()) return;

    loop += 1;
    const { t, depthCss, stage } = echoStrength(loop);

    const marks = getMarks?.() || [];
    const rawMark =
      marks.length > 0 ? marks[(loop - 1) % marks.length] : `∞ ${loop}`;
    const markText = corruptMark(rawMark, t, loop);

    const wrap = document.createElement("div");
    wrap.className = "infinite-echo";
    wrap.setAttribute("data-infinite-echo", String(loop));
    wrap.setAttribute("data-echo-depth", String(Math.round(depthCss)));
    wrap.setAttribute("data-echo-stage", stage);
    wrap.style.setProperty("--echo-depth", depthCss.toFixed(3));
    wrap.setAttribute("inert", "");
    // Clones are static snapshots — Alpine must not rebind x-for scopes.
    wrap.setAttribute("x-ignore", "");

    const mark = document.createElement("p");
    mark.className = "infinite-echo__mark";
    mark.textContent = markText;
    wrap.appendChild(mark);

    const clone = source.cloneNode(true);
    clone.removeAttribute(SOURCE_ATTR);
    neutralizeAlpineClone(clone);
    wrap.appendChild(clone);

    // Gentle first pass — early loops stay almost readable.
    if (t > 0.04) {
      corruptEchoContent(wrap, t, {
        budget: Math.max(1, Math.ceil(2 + t * 10)),
      });
    }

    echoes.appendChild(wrap);
    initReveal(wrap);
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
    if (!force && now - lastGlitchAt < 160) return;
    lastGlitchAt = now;

    const viewTop = 0;
    const viewBottom = window.innerHeight;
    for (const echo of echoes.children) {
      const rect = echo.getBoundingClientRect();
      if (rect.bottom < viewTop || rect.top > viewBottom) continue;

      const loopNo = Number(echo.getAttribute("data-infinite-echo")) || 1;
      const { t } = echoStrength(loopNo);
      if (t < 0.03) continue;

      const visible =
        Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop);
      const coverage = Math.max(0, visible) / Math.max(1, rect.height);
      const budget = Math.max(
        1,
        Math.ceil((1 + t * 5) * (0.35 + coverage * 0.65) * (reduceMotion ? 0.3 : 1))
      );
      corruptEchoContent(echo, t, { budget });
    }
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fillBuffer();
      glitchVisibleEchoes(false);
    });
  }

  const observer = new IntersectionObserver(
    () => {
      fillBuffer();
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
    }, 520);
  }

  fillBuffer();

  function reset() {
    loop = 0;
    echoes.replaceChildren();
    fillBuffer();
  }

  function destroy() {
    observer.disconnect();
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
    if (glitchTimer != null) {
      window.clearInterval(glitchTimer);
      glitchTimer = null;
    }
    loop = 0;
    echoes.replaceChildren();
  }

  return { reset, destroy };
}

/** Cubic ease-in: early loops barely shift, later ones climb harder. */
function echoStrength(loop) {
  const tLinear = Math.min(1, Math.max(0, (loop - 1) / (RAMP_LOOPS - 1)));
  const t = tLinear * tLinear * tLinear;
  const depthCss = t * CSS_DEPTH_PEAK;
  const stage = loop >= 18 ? "deep" : loop >= 9 ? "mid" : "early";
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
  if (loop >= 20 && Math.random() < 0.3) {
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
