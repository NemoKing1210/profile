export function scrollTopState() {
  return {
    scrollTopVisible: false,
    scrollProgress: 0,
    _scrollTopRaf: 0,
    _onScrollTop: null,
  };
}

export function scrollTopMethods() {
  return {
    updateScrollTop() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const vh = window.innerHeight || 1;
      this.scrollTopVisible = y > vh * 0.4;

      const source = this.$root.querySelector("[data-infinite-source]");
      let maxScroll = document.documentElement.scrollHeight - vh;
      if (source) {
        const sourceBottom = source.getBoundingClientRect().bottom + y;
        maxScroll = sourceBottom - vh;
      }
      maxScroll = Math.max(1, maxScroll);
      this.scrollProgress = Math.min(1, Math.max(0, y / maxScroll));
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
    },

    destroyScrollTop() {
      this._unbindScrollTop();
    },
  };
}
