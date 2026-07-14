import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  locales,
} from "../../shared/i18n/index.js";

/** Match `--locale-blur-duration` вЂ” full 0в†’6pxв†’0 cycle; swap copy at the midpoint. */
const LOCALE_BLUR_MS = 1600;
const LOCALE_BLUR_MID_MS = LOCALE_BLUR_MS / 2;

export function localeChromeState() {
  return {
    locale: DEFAULT_LOCALE,
    langMenuOpen: false,
    localeBlurring: false,
    themeJokeOpen: false,
    themeJokeFlash: false,
    themeSith: false,
    navOpen: false,
    _localeBlurGen: 0,
    _localeBlurMidTimer: null,
    _localeBlurEndTimer: null,
    _themeJokeTimer: null,
    _themeFlashTimer: null,
    _themeSithTimer: null,
  };
}

export function localeChromeMethods() {
  return {
    get pageTitle() {
      return `${this.name} В· ${this.t.ui.pageTitleSuffix}`;
    },

    get currentLocaleOption() {
      return (
        this.localeList.find((item) => item.code === this.locale) ||
        this.localeList[0]
      );
    },

    setLocale(code, { celebrate = false, instant = false } = {}) {
      if (!locales[code]) return;

      const changed = this.locale !== code;
      if (!changed) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (instant || reduceMotion) {
        this._clearLocaleBlur();
        this._commitLocale(code, { celebrate });
        return;
      }

      this._startLocaleBlur(() => {
        this._commitLocale(code, { celebrate });
      });
    },

    _commitLocale(code, { celebrate = false } = {}) {
      this.locale = code;

      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }

      document.documentElement.lang = code;
      document.title = this.pageTitle;

      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", this.t.meta.description);

      if (this.avatarSpeechOpen && this._avatarSpeechI18nPath) {
        this.showSpeechI18n(this._avatarSpeechI18nPath, {
          holdMs: this._avatarSpeechHoldMs,
        });
      }

      this._infiniteScroll?.reset?.();

      this.refreshActivityLocale?.();

      if (celebrate) {
        this.spawnFlagSquare(code, { scroll: false });
      }
    },

    _startLocaleBlur(onBlurred) {
      const gen = (this._localeBlurGen = (this._localeBlurGen || 0) + 1);
      this._clearLocaleBlurTimers();

      const armTimers = () => {
        if (gen !== this._localeBlurGen) return;
        this.localeBlurring = true;

        this._localeBlurMidTimer = window.setTimeout(() => {
          this._localeBlurMidTimer = null;
          if (gen !== this._localeBlurGen) return;
          onBlurred?.();
        }, LOCALE_BLUR_MID_MS);

        this._localeBlurEndTimer = window.setTimeout(() => {
          this._localeBlurEndTimer = null;
          if (gen !== this._localeBlurGen) return;
          this.localeBlurring = false;
        }, LOCALE_BLUR_MS);
      };

      // Re-toggle class so the CSS animation restarts on rapid switches.
      if (this.localeBlurring) {
        this.localeBlurring = false;
        this.$nextTick(armTimers);
        return;
      }

      armTimers();
    },

    _clearLocaleBlurTimers() {
      if (this._localeBlurMidTimer != null) {
        window.clearTimeout(this._localeBlurMidTimer);
        this._localeBlurMidTimer = null;
      }
      if (this._localeBlurEndTimer != null) {
        window.clearTimeout(this._localeBlurEndTimer);
        this._localeBlurEndTimer = null;
      }
    },

    _clearLocaleBlur() {
      this._localeBlurGen = (this._localeBlurGen || 0) + 1;
      this._clearLocaleBlurTimers();
      this.localeBlurring = false;
    },

    toggleLangMenu() {
      this.langMenuOpen = !this.langMenuOpen;
      if (this.langMenuOpen) {
        this.themeJokeOpen = false;
      }
    },

    closeLangMenu() {
      this.langMenuOpen = false;
    },

    pickLocale(code) {
      this.closeLangMenu();
      this.setLocale(code, { celebrate: true });
    },

    toggleNav() {
      this.navOpen = !this.navOpen;
      if (this.navOpen) this.closeLangMenu();
    },

    closeNav() {
      this.navOpen = false;
    },

    pokeThemeJoke() {
      this.closeLangMenu();
      this.themeJokeFlash = true;
      if (this._themeFlashTimer != null) {
        window.clearTimeout(this._themeFlashTimer);
      }
      this._themeFlashTimer = window.setTimeout(() => {
        this.themeJokeFlash = false;
        this._themeFlashTimer = null;
      }, 220);

      this.themeJokeOpen = true;
      if (this._themeJokeTimer != null) {
        window.clearTimeout(this._themeJokeTimer);
      }
      this._themeJokeTimer = window.setTimeout(() => {
        this.themeJokeOpen = false;
        this._themeJokeTimer = null;
      }, 5200);

      this.themeSith = true;
      if (this._themeSithTimer != null) {
        window.clearTimeout(this._themeSithTimer);
      }
      this._themeSithTimer = window.setTimeout(() => {
        this.themeSith = false;
        this._themeSithTimer = null;
      }, 5000);
    },

    destroyLocaleChrome() {
      this.closeNav();
      this.closeLangMenu();
      this._clearLocaleBlur();
      if (this._themeJokeTimer != null) {
        window.clearTimeout(this._themeJokeTimer);
        this._themeJokeTimer = null;
      }
      if (this._themeFlashTimer != null) {
        window.clearTimeout(this._themeFlashTimer);
        this._themeFlashTimer = null;
      }
      if (this._themeSithTimer != null) {
        window.clearTimeout(this._themeSithTimer);
        this._themeSithTimer = null;
      }
      this.themeJokeOpen = false;
      this.themeSith = false;
    },
  };
}
