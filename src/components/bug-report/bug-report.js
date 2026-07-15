const PENDING_KEY = "profile:bugReportPending";
const RETURN_HOLD_MS = 7000;

export function bugReportMethods() {
  return {
    onBugReportClick() {
      try {
        sessionStorage.setItem(PENDING_KEY, "1");
      } catch {
        /* private mode / blocked storage */
      }
      this._bugReportAwaitingReturn = true;
      window.open(
        `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1`,
        "_blank",
        "noopener,noreferrer"
      );
    },

    bindBugReportReturn() {
      if (this._onBugReportVisibility) return;

      this._onBugReportVisibility = () => {
        if (document.visibilityState !== "visible") return;
        this._maybeSpeakBugReportReturn();
      };

      document.addEventListener(
        "visibilitychange",
        this._onBugReportVisibility
      );
      window.addEventListener("focus", this._onBugReportVisibility);

      // Tab already visible again after a same-session navigate.
      this._maybeSpeakBugReportReturn();
    },

    destroyBugReportReturn() {
      if (!this._onBugReportVisibility) return;
      document.removeEventListener(
        "visibilitychange",
        this._onBugReportVisibility
      );
      window.removeEventListener("focus", this._onBugReportVisibility);
      this._onBugReportVisibility = null;
    },

    _maybeSpeakBugReportReturn() {
      const pending =
        this._bugReportAwaitingReturn || readPendingFlag();
      if (!pending) return;

      this._bugReportAwaitingReturn = false;
      clearPendingFlag();

      // Defer so focus/visibility settle before the bubble / toast open.
      window.setTimeout(() => {
        this.unlockAchievementRecord?.("rickroll");
        this.showSpeechI18n?.("hero.bugReportReturn", {
          holdMs: RETURN_HOLD_MS,
        });
      }, 280);
    },
  };
}


function readPendingFlag() {
  try {
    return sessionStorage.getItem(PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

function clearPendingFlag() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}
