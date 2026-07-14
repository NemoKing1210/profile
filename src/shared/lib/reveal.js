const REVEAL_SELECTOR =
  ".panel, .capsule, .stack-card, .link-card, .stack-group, .hub-card, .media-note";

export function initReveal(root, { immediate = false } = {}) {
  const targets = root.querySelectorAll(REVEAL_SELECTOR);
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || immediate) {
    targets.forEach((el) => {
      el.classList.add("reveal", "is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // Expand below the fold so panels start fading in before they feel "late"
    { threshold: 0, rootMargin: "0px 0px 120px 0px" }
  );

  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}
