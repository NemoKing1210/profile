import { ECHO_FINALE_LOOP } from "../echo-finale/index.js";

export function scrollTopState() {
  return {
    scrollTopVisible: false,
    scrollProgress: 0,
    scrollTopInfinite: false,
    scrollEchoLoop: 0,
    scrollTopLoopPulse: false,
    _scrollTopRaf: 0,
    _onScrollTop: null,
    _scrollTopPulseTimer: null,
  };
}

export function scrollTopMethods() {
  return {
    onScrollTopClick() {
      if (this.scrollTopInfinite && this.scrollEchoLoop >= 10) {
        const tease = this.t.ui?.scrollTopEchoTease;
        if (tease) this.showSpeech(tease, { holdMs: 6_500 });
      }
      this.scrollToHero();
    },

    updateScrollTop() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const vh = window.innerHeight || 1;
      this.scrollTopVisible = y > vh * 0.4 && !this.echoFinaleOpen;

      const source = this.$root.querySelector("[data-infinite-source]");
      let maxScroll = document.documentElement.scrollHeight - vh;
      if (source) {
        const sourceBottom = source.offsetTop + source.offsetHeight;
        maxScroll = sourceBottom - vh;

        // Infinite zone begins once the original store has left the upper viewport.
        const sourceRect = source.getBoundingClientRect();
        this.scrollTopInfinite = sourceRect.bottom < vh * 0.45;
      } else {
        this.scrollTopInfinite = false;
      }
      maxScroll = Math.max(1, maxScroll);
      this.scrollProgress = this.scrollTopInfinite
        ? 1
        : Math.min(1, Math.max(0, y / maxScroll));

      if (this.scrollTopInfinite) {
        const nextLoop = resolveActiveEchoLoop(this.$refs.infiniteEchoes);
        const loop = nextLoop > 0 ? nextLoop : this.scrollEchoLoop || 1;
        if (loop !== this.scrollEchoLoop) {
          this.scrollEchoLoop = loop;
          this._pulseScrollTopLoop();
        }
        if (this.scrollEchoLoop >= ECHO_FINALE_LOOP) {
          this.openEchoFinale?.();
        }
      } else {
        this.scrollEchoLoop = 0;
        this.scrollTopLoopPulse = false;
      }
    },

    _pulseScrollTopLoop() {
      this.scrollTopLoopPulse = false;
      this.$nextTick(() => {
        this.scrollTopLoopPulse = true;
        if (this._scrollTopPulseTimer != null) {
          window.clearTimeout(this._scrollTopPulseTimer);
        }
        this._scrollTopPulseTimer = window.setTimeout(() => {
          this._scrollTopPulseTimer = null;
          this.scrollTopLoopPulse = false;
        }, 560);
      });
    },

    _scheduleScrollTop() {
      if (this._scrollTopRaf) return;
      this._scrollTopRaf = requestAnimationFrame(() => {
        this._scrollTopRaf = 0;
        this.updateScrollTop();
      });
    },

    _bindScrollTop() {
      this._unbindScrollTop();
      this._onScrollTop = () => this._scheduleScrollTop();
      window.addEventListener("scroll", this._onScrollTop, { passive: true });
      window.addEventListener("resize", this._onScrollTop, { passive: true });
      this.updateScrollTop();
    },

    _unbindScrollTop() {
      if (this._onScrollTop) {
        window.removeEventListener("scroll", this._onScrollTop);
        window.removeEventListener("resize", this._onScrollTop);
        this._onScrollTop = null;
      }
      if (this._scrollTopRaf) {
        cancelAnimationFrame(this._scrollTopRaf);
        this._scrollTopRaf = 0;
      }
      if (this._scrollTopPulseTimer != null) {
        window.clearTimeout(this._scrollTopPulseTimer);
        this._scrollTopPulseTimer = null;
      }
      this.scrollTopLoopPulse = false;
    },

    destroyScrollTop() {
      this._unbindScrollTop();
    },
  };
}

/** Echo whose band covers the upper-mid viewport, else nearest intersecting. */
function resolveActiveEchoLoop(echoesRoot) {
  if (!echoesRoot?.children?.length) return 0;

  const focusY = window.innerHeight * 0.35;
  let covered = 0;
  let nearest = 0;
  let nearestDist = Infinity;

  for (const el of echoesRoot.children) {
    const loop = Number(el.getAttribute("data-infinite-echo")) || 0;
    if (!loop) continue;
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;

    if (rect.top <= focusY && rect.bottom >= focusY) {
      covered = Math.max(covered, loop);
    }

    const dist = Math.abs(rect.top - focusY);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = loop;
    }
  }

  return covered || nearest || 0;
}
