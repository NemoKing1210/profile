export function stackFlipState() {
  return {
    stackFlipDeg: 0,
    _stackFlipRaf: 0,
    _onStackFlipScroll: null,
  };
}

export function stackFlipMethods() {
  return {
    updateStackFlip() {
      if (prefersReducedMotion()) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
        return;
      }

      if (this.stackFlipDeg >= 180) {
        this._unbindStackFlip();
        return;
      }

      const el = this.$refs.stackFlip;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const cardMid = rect.top + rect.height / 2;
      const viewMid = vh * 0.42;
      if (cardMid < viewMid) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
        return;
      }

      const dist = cardMid - viewMid;
      const maxDist = vh * 0.62;
      const t = 1 - Math.min(1, Math.max(0, dist / maxDist));
      const eased = t * t * (3 - 2 * t);
      const next = Math.round(eased * 180);

      if (next > this.stackFlipDeg) {
        this.stackFlipDeg = next;
      }

      if (this.stackFlipDeg >= 180) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
      }
    },

    _scheduleStackFlip() {
      if (this._stackFlipRaf) return;
      this._stackFlipRaf = window.requestAnimationFrame(() => {
        this._stackFlipRaf = 0;
        this.updateStackFlip();
      });
    },

    _bindStackFlip() {
      this._unbindStackFlip();
      if (prefersReducedMotion()) {
        this.stackFlipDeg = 180;
        return;
      }
      this._onStackFlipScroll = () => this._scheduleStackFlip();
      window.addEventListener("scroll", this._onStackFlipScroll, {
        passive: true,
      });
      window.addEventListener("resize", this._onStackFlipScroll, {
        passive: true,
      });
      this.$nextTick(() => this.updateStackFlip());
    },

    _unbindStackFlip() {
      if (this._onStackFlipScroll) {
        window.removeEventListener("scroll", this._onStackFlipScroll);
        window.removeEventListener("resize", this._onStackFlipScroll);
        this._onStackFlipScroll = null;
      }
      if (this._stackFlipRaf) {
        window.cancelAnimationFrame(this._stackFlipRaf);
        this._stackFlipRaf = 0;
      }
    },

    destroyStackFlip() {
      this._unbindStackFlip();
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
