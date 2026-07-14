import { isAchievementUnlocked } from "../../shared/data/achievements.js";

/** How long the “how did you find me?” bit stays on screen. */
const FOOTER_JOKE_HOLD_MS = 3_400;
/** Match `.footer--leaving` animation. */
const FOOTER_LEAVE_MS = 720;

export function footerState() {
  return {
    footerCaught: false,
    footerLeaving: false,
    footerGone: isAchievementUnlocked("foundFooter"),
    _footerObserver: null,
    _footerJokeTimer: null,
    _footerLeaveTimer: null,
  };
}

export function footerMethods() {
  return {
    bindFooterEaster() {
      if (this.footerGone || isAchievementUnlocked("foundFooter")) {
        this.footerGone = true;
        return;
      }

      const el = this.$refs.siteFooter;
      if (!el || this._footerObserver) return;

      this._footerObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            this._onFooterSpotted();
            break;
          }
        },
        { threshold: 0 }
      );
      this._footerObserver.observe(el);
    },

    _onFooterSpotted() {
      if (this.footerCaught || this.footerGone) return;

      this.footerCaught = true;
      this._teardownFooterObserver();
      // Freeze the infinite feed so the joke stays on screen.
      this._infiniteScroll?.pause?.();

      if (this._footerJokeTimer != null) {
        window.clearTimeout(this._footerJokeTimer);
      }
      this._footerJokeTimer = window.setTimeout(() => {
        this._footerJokeTimer = null;
        this._dismissFoundFooter();
      }, FOOTER_JOKE_HOLD_MS);
    },

    _dismissFoundFooter() {
      if (this.footerGone || this.footerLeaving) return;

      this.footerLeaving = true;
      this.unlockAchievementRecord?.("foundFooter");

      const leaveMs = prefersReducedMotion() ? 0 : FOOTER_LEAVE_MS;
      if (this._footerLeaveTimer != null) {
        window.clearTimeout(this._footerLeaveTimer);
      }
      this._footerLeaveTimer = window.setTimeout(() => {
        this._footerLeaveTimer = null;
        this.footerGone = true;
        this.footerLeaving = false;
        this._infiniteScroll?.resume?.();
      }, leaveMs);
    },

    _teardownFooterObserver() {
      this._footerObserver?.disconnect?.();
      this._footerObserver = null;
    },

    destroyFooterEaster() {
      this._teardownFooterObserver();
      if (this._footerJokeTimer != null) {
        window.clearTimeout(this._footerJokeTimer);
        this._footerJokeTimer = null;
      }
      if (this._footerLeaveTimer != null) {
        window.clearTimeout(this._footerLeaveTimer);
        this._footerLeaveTimer = null;
      }
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
