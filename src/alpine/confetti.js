import confetti from "canvas-confetti";

const CONFETTI_COLORS = ["#66c0f4", "#1a9fff", "#a4d007", "#ffffff", "#c7d5e0"];

/**
 * One-shot burst from a viewport point (client coordinates).
 * No-op when the user prefers reduced motion.
 */
export function burstConfettiAt(clientX, clientY, { count = 80 } = {}) {
  if (prefersReducedMotion()) return;

  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  confetti({
    particleCount: count,
    spread: 78,
    startVelocity: 38,
    origin: {
      x: Math.min(1, Math.max(0, clientX / w)),
      y: Math.min(1, Math.max(0, clientY / h)),
    },
    colors: CONFETTI_COLORS,
    zIndex: 2400,
  });
}

/**
 * Side-cannon confetti for `durationMs` (default 10s).
 * No-op when the user prefers reduced motion.
 */
export function celebrateConfetti(durationMs = 10_000) {
  if (prefersReducedMotion()) return () => {};

  const end = Date.now() + durationMs;
  let rafId = 0;
  let stopped = false;

  const frame = () => {
    if (stopped) return;

    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: CONFETTI_COLORS,
      zIndex: 2400,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: CONFETTI_COLORS,
      zIndex: 2400,
    });

    if (Date.now() < end) {
      rafId = window.requestAnimationFrame(frame);
    }
  };

  rafId = window.requestAnimationFrame(frame);

  return () => {
    stopped = true;
    if (rafId) window.cancelAnimationFrame(rafId);
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
