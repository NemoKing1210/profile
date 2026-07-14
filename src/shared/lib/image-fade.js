const FADE_CLASS = "img-fade";
const LOADED_CLASS = "is-img-loaded";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markLoaded(img) {
  img.classList.add(LOADED_CLASS);
}

function armImage(img) {
  if (!(img instanceof HTMLImageElement)) return;
  if (img.dataset.imgFade === "skip") return;

  img.classList.add(FADE_CLASS);
  img.classList.remove(LOADED_CLASS);

  if (prefersReducedMotion()) {
    markLoaded(img);
    return;
  }

  if (img.complete && img.naturalWidth > 0) {
    // Double rAF so the opacity:0 paint lands before the fade-in transition.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => markLoaded(img));
    });
    return;
  }

  const onDone = () => {
    markLoaded(img);
    img.removeEventListener("load", onDone);
    img.removeEventListener("error", onDone);
  };

  img.addEventListener("load", onDone);
  img.addEventListener("error", onDone);
}

/**
 * Fade in every <img> when its pixels are ready (including Alpine/:src swaps
 * and nodes injected later — physics toys, minecraft pickaxe, infinite echoes).
 */
export function initImageFade(root = document) {
  root.querySelectorAll("img").forEach(armImage);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("img")) armImage(node);
          node.querySelectorAll("img").forEach(armImage);
        });
        continue;
      }

      if (
        mutation.type === "attributes" &&
        mutation.target instanceof HTMLImageElement
      ) {
        armImage(mutation.target);
      }
    }
  });

  observer.observe(root === document ? document.body : root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  return () => observer.disconnect();
}
