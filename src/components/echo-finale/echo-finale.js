import {
  isLightThemeUnlocked,
  unlockLightTheme,
} from "../../shared/data/theme-unlock.js";

/** Echo loop that triggers the white-screen finale. */
export const ECHO_FINALE_LOOP = 99;

const ACHIEVEMENT_TO_JOKE_MS = 1_050;
const JOKE_TO_RESTART_MS = 1_400;

export function echoFinaleState() {
  return {
    echoFinaleOpen: false,
    echoFinaleGiftOpened: false,
    echoFinaleAchievementOpen: false,
    echoFinaleJokeVisible: false,
    echoFinaleRestartVisible: false,
    lightThemeUnlocked: isLightThemeUnlocked(),
    _echoFinaleJokeTimer: null,
    _echoFinaleRestartTimer: null,
  };
}

export function echoFinaleMethods() {
  return {
    get echoFinaleEyebrow() {
      const raw = this.t.echoFinale?.eyebrow || "";
      return raw.replace(/\d+/, String(ECHO_FINALE_LOOP));
    },

    openEchoFinale() {
      if (this.echoFinaleOpen) return;
      this.echoFinaleOpen = true;
      this.echoFinaleGiftOpened = false;
      this.echoFinaleAchievementOpen = false;
      this.echoFinaleJokeVisible = false;
      this.echoFinaleRestartVisible = false;
      document.documentElement.classList.add("echo-finale-lock");
    },

    openEchoFinaleGift() {
      if (!this.echoFinaleOpen || this.echoFinaleGiftOpened) return;

      this.echoFinaleGiftOpened = true;
      unlockLightTheme();
      this.lightThemeUnlocked = true;

      // Let the gift “open” settle, then launch the Steam-style toast.
      window.requestAnimationFrame(() => {
        this.echoFinaleAchievementOpen = true;
      });

      this._clearEchoFinaleTimers();

      this._echoFinaleJokeTimer = window.setTimeout(() => {
        this._echoFinaleJokeTimer = null;
        this.echoFinaleJokeVisible = true;

        this._echoFinaleRestartTimer = window.setTimeout(() => {
          this._echoFinaleRestartTimer = null;
          this.echoFinaleRestartVisible = true;
        }, JOKE_TO_RESTART_MS);
      }, ACHIEVEMENT_TO_JOKE_MS);
    },

    restartEchoJourney() {
      window.location.reload();
    },

    _clearEchoFinaleTimers() {
      if (this._echoFinaleJokeTimer != null) {
        window.clearTimeout(this._echoFinaleJokeTimer);
        this._echoFinaleJokeTimer = null;
      }
      if (this._echoFinaleRestartTimer != null) {
        window.clearTimeout(this._echoFinaleRestartTimer);
        this._echoFinaleRestartTimer = null;
      }
    },

    destroyEchoFinale() {
      this._clearEchoFinaleTimers();
      document.documentElement.classList.remove("echo-finale-lock");
    },
  };
}
