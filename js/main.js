document.addEventListener("alpine:init", () => {
  Alpine.data("profilePage", () => ({
    ...window.PROFILE,

    get pageTitle() {
      return `${this.name} · Profile`;
    },

    get primaryLinks() {
      return (this.links || []).slice(0, 2);
    },

    get metaChips() {
      return [
        this.location,
        this.language,
        this.birthYear ? `г.р. ${this.birthYear}` : null,
      ].filter(Boolean);
    },

    projectGlyph(title) {
      return (title || "?").trim().charAt(0).toUpperCase();
    },

    init() {
      document.title = this.pageTitle;
      this.$nextTick(() => this.initReveal());
    },

    initReveal() {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const root = this.$root;
      const targets = root.querySelectorAll(
        ".panel, .capsule, .focus-item, .link-card, .stack-group"
      );

      if (reduceMotion) {
        targets.forEach((el) => el.classList.add("is-visible"));
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
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      targets.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
      });
    },
  }));
});
