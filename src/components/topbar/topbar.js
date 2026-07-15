import { isAchievementEffectEnabled } from "../../shared/data/achievements.js";
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  locales,
} from "../../shared/i18n/index.js";

/** Match `--locale-blur-duration` — full 0→6px→0 cycle; swap copy at the midpoint. */
const LOCALE_BLUR_MS = 1600;
const LOCALE_BLUR_MID_MS = LOCALE_BLUR_MS / 2;

const THEME_STORAGE_KEY = "profile:theme";
const THEME_COLOR_DARK = "#171a21";
const THEME_COLOR_LIGHT = "#ffffff";
/** Match `--theme-duration` (light/dark). */
const THEME_FADE_MS = 320;
/** Match `body.theme-sith { --theme-duration }` */
const THEME_SITH_FADE_MS = 1350;
/** Topbar Online badge flips to Offline after this dwell. */
const STATUS_OFFLINE_AFTER_MS = 30_000;

export function localeChromeState() {
  return {
    locale: DEFAULT_LOCALE,
    langMenuOpen: false,
    localeBlurring: false,
    themeJokeOpen: false,
    themeJokeFlash: false,
    themeSith: false,
    themeLight: false,
    themeSwitching: false,
    themeSwitchSithPace: false,
    navOpen: false,
    activeNavId: "",
    statusGoneOffline: false,
    _localeBlurGen: 0,
    _localeBlurMidTimer: null,
    _localeBlurEndTimer: null,
    _themeJokeTimer: null,
    _themeFlashTimer: null,
    _themeSithTimer: null,
    _themeSwitchTimer: null,
    _statusOfflineTimer: null,
    _navSpyRaf: 0,
    _navSpyLayout: false,
    _onNavSpyScroll: null,
    _onNavSpyResize: null,
  };
}

export function localeChromeMethods() {
  return {
    get pageTitle() {
      return `${this.name} · ${this.t.ui.pageTitleSuffix}`;
    },

    get currentLocaleOption() {
      return (
        this.localeList.find((item) => item.code === this.locale) ||
        this.localeList[0]
      );
    },

    get canUseLightTheme() {
      return isAchievementEffectEnabled(
        "lightTheme",
        this.achievementUnlocks
      );
    },

    get themeToggleLabel() {
      if (!this.canUseLightTheme) return this.t.ui.themeToggle;
      return this.themeLight ? this.t.ui.themeToDark : this.t.ui.themeToLight;
    },

    get themeToggleIcon() {
      return this.canUseLightTheme && this.themeLight
        ? this.icons.moon
        : this.icons.sun;
    },

    get statusSpeechPath() {
      return this.statusGoneOffline
        ? "hero.statusLastSeen"
        : "hero.statusOnlineTip";
    },

    get statusAriaLabel() {
      if (this.statusGoneOffline) {
        return `${this.t.hero.statusOffline}. ${this.t.hero.statusLastSeen}`;
      }
      return `${this.status}. ${this.t.hero.statusOnlineTip}`;
    },

    bindStatusOfflineTimer() {
      if (this._statusOfflineTimer != null) return;
      if (this.statusGoneOffline) return;

      this._statusOfflineTimer = window.setTimeout(() => {
        this._statusOfflineTimer = null;
        this.statusGoneOffline = true;
      }, STATUS_OFFLINE_AFTER_MS);
    },

    _clearStatusOfflineTimer() {
      if (this._statusOfflineTimer != null) {
        window.clearTimeout(this._statusOfflineTimer);
        this._statusOfflineTimer = null;
      }
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
      // Browser tab follows UI locale; crawlable/share meta stays English (static head).
      document.title = this.pageTitle;

      if (this.avatarSpeechOpen && this._avatarSpeechI18nPath) {
        this.showSpeechI18n(this._avatarSpeechI18nPath, {
          holdMs: this._avatarSpeechHoldMs,
        });
      }

      this._infiniteScroll?.reset?.();

      this.refreshActivityLocale?.();

      this.$nextTick(() => this._syncNavIndicator?.());

      if (celebrate) {
        this.spawnFlagSquare(code, { scroll: false });
        this.showSpeechI18n("ui.langSwitched");
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
        this.closeAchievementsPanel?.();
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
      if (this.navOpen) {
        this.closeLangMenu();
        this.$nextTick(() => this._syncNavIndicator());
      }
    },

    closeNav() {
      this.navOpen = false;
    },

    updateActiveNav({ layout = false } = {}) {
      const topbar = this.$root?.querySelector?.(".topbar");
      const bottomDocked = window.matchMedia("(max-width: 859px)").matches;
      // Bottom dock does not cover the top of the viewport — use a small edge inset.
      const offset = bottomDocked
        ? 12
        : (topbar?.offsetHeight ?? 52) + 12;
      let current = "";

      for (const item of this.nav) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = item.id;
        }
      }

      if (this.activeNavId !== current) {
        this.activeNavId = current;
        this.$nextTick(() => this._syncNavIndicator());
        return;
      }

      if (layout) {
        this._syncNavIndicator();
      }
    },

    _syncNavIndicatorIn(nav, pill) {
      if (!nav || !pill) return;

      const link = this.activeNavId
        ? nav.querySelector(`[data-nav-id="${CSS.escape(this.activeNavId)}"]`)
        : null;

      if (!link) {
        pill.classList.remove("nav__indicator--visible");
        return;
      }

      const x = link.offsetLeft;
      const y = link.offsetTop;
      const w = link.offsetWidth;
      const h = link.offsetHeight;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const wasHidden = !pill.classList.contains("nav__indicator--visible");

      if (wasHidden || reduceMotion) {
        pill.classList.add("nav__indicator--instant");
      }

      pill.style.width = `${w}px`;
      pill.style.height = `${h}px`;
      pill.style.transform = `translate(${x}px, ${y}px)`;
      pill.classList.add("nav__indicator--visible");

      if (wasHidden || reduceMotion) {
        void pill.offsetWidth;
        pill.classList.remove("nav__indicator--instant");
      }
    },

    _syncNavIndicator() {
      this._syncNavIndicatorIn(this.$refs.navDesktop, this.$refs.navDesktopPill);
      if (this.navOpen) {
        this._syncNavIndicatorIn(this.$refs.navMobile, this.$refs.navMobilePill);
      }
    },

    _scheduleNavSpy(layout = false) {
      if (layout) this._navSpyLayout = true;
      if (this._navSpyRaf) return;
      this._navSpyRaf = requestAnimationFrame(() => {
        this._navSpyRaf = 0;
        const layoutPass = this._navSpyLayout;
        this._navSpyLayout = false;
        this.updateActiveNav({ layout: layoutPass });
      });
    },

    _bindNavSpy() {
      this._unbindNavSpy();
      this._onNavSpyScroll = () => this._scheduleNavSpy(false);
      this._onNavSpyResize = () => this._scheduleNavSpy(true);
      window.addEventListener("scroll", this._onNavSpyScroll, { passive: true });
      window.addEventListener("resize", this._onNavSpyResize, { passive: true });
      this.$nextTick(() => this.updateActiveNav({ layout: true }));
    },

    _unbindNavSpy() {
      if (this._onNavSpyScroll) {
        window.removeEventListener("scroll", this._onNavSpyScroll);
        this._onNavSpyScroll = null;
      }
      if (this._onNavSpyResize) {
        window.removeEventListener("resize", this._onNavSpyResize);
        this._onNavSpyResize = null;
      }
      if (this._navSpyRaf) {
        cancelAnimationFrame(this._navSpyRaf);
        this._navSpyRaf = 0;
      }
      this._navSpyLayout = false;
    },

    destroyNavSpy() {
      this._unbindNavSpy();
      this.activeNavId = "";
      const pills = [this.$refs.navDesktopPill, this.$refs.navMobilePill];
      for (const pill of pills) {
        if (!pill) continue;
        pill.classList.remove("nav__indicator--visible", "nav__indicator--instant");
        pill.style.width = "";
        pill.style.height = "";
        pill.style.transform = "";
      }
    },

    pokeThemeJoke() {
      this.closeLangMenu();
      this.closeAchievementsPanel?.();

      if (this.canUseLightTheme) {
        this.toggleTheme();
        return;
      }

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

      this._beginThemeSwitch(THEME_SITH_FADE_MS, { sithPace: true });
      this.themeSith = true;
      if (this._themeSithTimer != null) {
        window.clearTimeout(this._themeSithTimer);
      }
      this._themeSithTimer = window.setTimeout(() => {
        // Keep long duration while leaving sith (class drops --theme-duration otherwise).
        this._beginThemeSwitch(THEME_SITH_FADE_MS, { sithPace: true });
        this.themeSith = false;
        this._themeSithTimer = null;
      }, 5000);
    },

    toggleTheme() {
      if (!this.canUseLightTheme) return;

      this._clearThemeJokeTimers();
      this.themeJokeOpen = false;
      this.themeJokeFlash = false;
      this.themeSith = false;
      this._beginThemeSwitch(THEME_FADE_MS);
      this.themeLight = !this.themeLight;
      this._persistThemePreference();
      this._syncThemeColorMeta();
      this._speakThemeSwitched();
    },

    _speakThemeSwitched() {
      const tips = this.themeLight
        ? this.t.ui.themeToLightTips
        : this.t.ui.themeToDarkTips;
      if (!Array.isArray(tips) || tips.length === 0) return;
      const text = tips[Math.floor(Math.random() * tips.length)];
      if (text) this.showSpeech(text);
    },

    applyStoredTheme() {
      const unlocked = isAchievementEffectEnabled("lightTheme");
      if (!unlocked) {
        this.themeLight = false;
        this._syncThemeColorMeta();
        this._preloadThemeBanners();
        return;
      }

      try {
        this.themeLight = localStorage.getItem(THEME_STORAGE_KEY) === "light";
      } catch {
        this.themeLight = false;
      }
      this._syncThemeColorMeta();
      this._preloadThemeBanners();
    },

    _persistThemePreference() {
      try {
        localStorage.setItem(
          THEME_STORAGE_KEY,
          this.themeLight ? "light" : "dark"
        );
      } catch {
        /* ignore */
      }
    },

    _syncThemeColorMeta() {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute(
          "content",
          this.themeLight ? THEME_COLOR_LIGHT : THEME_COLOR_DARK
        );
      }
    },

    _beginThemeSwitch(durationMs, { sithPace = false } = {}) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      this.themeSwitchSithPace = sithPace;
      this.themeSwitching = true;
      if (this._themeSwitchTimer != null) {
        window.clearTimeout(this._themeSwitchTimer);
      }
      this._themeSwitchTimer = window.setTimeout(() => {
        this.themeSwitching = false;
        this.themeSwitchSithPace = false;
        this._themeSwitchTimer = null;
      }, durationMs + 48);
    },

    _preloadThemeBanners() {
      for (const url of [this.banner, this.bannerLight]) {
        if (!url) continue;
        const img = new Image();
        img.decoding = "async";
        img.src = url;
      }
    },

    _clearThemeJokeTimers() {
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
    },

    _clearThemeSwitch() {
      if (this._themeSwitchTimer != null) {
        window.clearTimeout(this._themeSwitchTimer);
        this._themeSwitchTimer = null;
      }
      this.themeSwitching = false;
      this.themeSwitchSithPace = false;
    },

    destroyLocaleChrome() {
      this.closeNav();
      this.closeLangMenu();
      this.closeAchievementsPanel?.();
      this._clearLocaleBlur();
      this._clearThemeJokeTimers();
      this._clearThemeSwitch();
      this._clearStatusOfflineTimer();
      this.themeJokeOpen = false;
      this.themeJokeFlash = false;
      this.themeSith = false;
    },
  };
}
