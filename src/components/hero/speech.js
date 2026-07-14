const DEFAULT_HOLD_MS = 5000;
const WORD_INTERVAL_MS = 118;
/** After the last scroll event, wait this long before allowing hover tips again. */
const SCROLL_IDLE_MS = 160;

/** Interaction count → speech beat while flinging hero physics bodies. */
const PHYSICS_SPEECH_AT = {
  5: "tip",
  10: "tip",
  15: "tip",
  20: "playEnough",
  25: "tip",
  30: "playAlong",
};

export function heroSpeechState() {
  return {
    physicsPlayCount: 0,
    avatarSpeechOpen: false,
    avatarSpeechText: "",
    avatarSpeechWords: [],
    avatarSpeechTyping: false,
    avatarSpeechAnimateWords: true,
    avatarSpeechAnchor: "hero",
    avatarInView: true,
    _avatarSpeechI18nPath: null,
    _avatarSpeechHoldMs: DEFAULT_HOLD_MS,
    _avatarSpeechHeard: null,
    _speechPlayAlongDone: false,
    _physicsPlayTipCursor: 0,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
    _avatarSpeechObserver: null,
    _pageScrolling: false,
    _speechScrollIdleTimer: null,
    _onSpeechPageScroll: null,
  };
}

export function heroSpeechMethods() {
  return {
    spawnFlagSquare(code, { scroll = true } = {}) {
      const option = this.localeList.find((item) => item.code === code);
      this._heroPhysics?.spawnFlagSquare?.({
        locale: code,
        label: option?.nativeName || code,
      });
      if (scroll) this.scrollToHero();
    },

    spawnAiTool(tool) {
      this._heroPhysics?.spawnAiSquare?.(tool);
      this.scrollToHero();
    },

    spawnTechBall(tech, opts) {
      this._heroPhysics?.spawnTechBall?.(tech, opts);
      this.scrollToHero();
    },

    spawnAvatarSquare() {
      this._heroPhysics?.spawnAvatarSquare?.({
        src: this.avatar,
        label: this.name,
      });
    },

    onPhysicsInteract() {
      if (this._speechPlayAlongDone) return;
      this.physicsPlayCount += 1;

      const beat = PHYSICS_SPEECH_AT[this.physicsPlayCount];
      if (!beat) return;

      if (beat === "tip") {
        this._speakPhysicsPlayTip();
        return;
      }

      if (beat === "playEnough") {
        this.showSpeechI18n("hero.playEnough");
        return;
      }

      if (beat === "playAlong") {
        this._speechPlayAlongDone = true;
        this.showSpeechI18n("hero.playAlong");
        this.spawnAvatarSquare();
      }
    },

    _speakPhysicsPlayTip() {
      const tips = this.t?.hero?.playTips;
      if (!Array.isArray(tips) || tips.length === 0) return;
      const text = tips[this._physicsPlayTipCursor % tips.length];
      this._physicsPlayTipCursor += 1;
      if (text) this.showSpeech(text);
    },

    bindAvatarSpeech() {
      const avatar = this.$refs.heroAvatar;
      if (!avatar || this._avatarSpeechObserver) return;

      this._avatarSpeechObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          this.avatarInView = Boolean(entry?.isIntersecting);
          if (this.avatarSpeechOpen) {
            this.avatarSpeechAnchor = this.avatarInView ? "hero" : "brand";
          }
        },
        { threshold: 0.35 }
      );
      this._avatarSpeechObserver.observe(avatar);
      this._bindSpeechScrollGuard();
    },

    showSpeech(text, { holdMs = DEFAULT_HOLD_MS } = {}) {
      if (this._shouldSuppressHoverSpeech(holdMs)) return;
      const full = String(text ?? "");
      this._avatarSpeechI18nPath = null;
      this._beginSpeech(full, holdMs, { identity: `text:${full}` });
    },

    showSpeechI18n(path, { holdMs = DEFAULT_HOLD_MS } = {}) {
      if (this._shouldSuppressHoverSpeech(holdMs)) return;
      this._avatarSpeechI18nPath = path;
      this._beginSpeech(resolveI18nPath(this.t, path), holdMs, {
        identity: `i18n:${path}`,
      });
    },

    hideSpeech() {
      // Scroll moves the cursor across tipped nodes → mouseleave. Don't let that
      // dismiss timed / event speeches (only sticky hover tips use holdMs: null).
      if (this._pageScrolling && this._avatarSpeechHoldMs != null) return;
      this._clearSpeech();
    },

    /** @deprecated Prefer showSpeechI18n("hero.<key>") */
    startAvatarSpeech(key) {
      this.showSpeechI18n(`hero.${key}`);
    },

    hideAvatarSpeech() {
      this.hideSpeech();
    },

    chipHasSpeech(chip) {
      return Boolean(chip?.speechI18n || chip?.speechText);
    },

    showMetaChipSpeech(chip) {
      if (chip?.speechI18n) {
        this.showSpeechI18n(chip.speechI18n, { holdMs: null });
        return;
      }
      if (chip?.speechText) {
        this.showSpeech(chip.speechText, { holdMs: null });
      }
    },

    _beginSpeech(full, holdMs, { identity } = {}) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHoldMs = holdMs;
      this.avatarSpeechAnchor = this.avatarInView ? "hero" : "brand";
      this.avatarSpeechOpen = true;

      const words = splitSpeechWords(full);
      const heard = Boolean(identity && this._speechHeard().has(identity));

      if (!words.length || prefersReducedMotion() || heard) {
        this.avatarSpeechAnimateWords = false;
        this.avatarSpeechWords = words.length ? words : full ? [full] : [];
        this.avatarSpeechText = full;
        this.avatarSpeechTyping = false;
        if (identity) this._speechHeard().add(identity);
        this._scheduleAvatarSpeechHide();
        return;
      }

      this.avatarSpeechAnimateWords = true;
      this.avatarSpeechWords = [];
      this.avatarSpeechText = "";
      this.avatarSpeechTyping = true;

      let i = 0;
      this._avatarSpeechTimer = window.setInterval(() => {
        this.avatarSpeechWords.push(words[i]);
        this.avatarSpeechText = this.avatarSpeechWords.join("");
        i += 1;
        if (i >= words.length) {
          this._stopAvatarSpeechTimer();
          this.avatarSpeechTyping = false;
          if (identity) this._speechHeard().add(identity);
          this._scheduleAvatarSpeechHide();
        }
      }, WORD_INTERVAL_MS);
    },

    _speechHeard() {
      if (!this._avatarSpeechHeard) this._avatarSpeechHeard = new Set();
      return this._avatarSpeechHeard;
    },

    _scheduleAvatarSpeechHide() {
      this._stopAvatarSpeechHideTimer();
      if (this._avatarSpeechHoldMs == null) return;
      this._avatarSpeechHideTimer = window.setTimeout(() => {
        this._avatarSpeechHideTimer = null;
        this._clearSpeech();
      }, this._avatarSpeechHoldMs);
    },

    _clearSpeech() {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this._avatarSpeechI18nPath = null;
      this._avatarSpeechHoldMs = DEFAULT_HOLD_MS;
    },

    _stopAvatarSpeechTimer() {
      if (this._avatarSpeechTimer != null) {
        window.clearInterval(this._avatarSpeechTimer);
        this._avatarSpeechTimer = null;
      }
    },

    _stopAvatarSpeechHideTimer() {
      if (this._avatarSpeechHideTimer != null) {
        window.clearTimeout(this._avatarSpeechHideTimer);
        this._avatarSpeechHideTimer = null;
      }
    },

    scrollToHero() {
      document.getElementById("top")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },

    /** Hover tips use `holdMs: null`; suppress those while the page is scrolling. */
    _shouldSuppressHoverSpeech(holdMs) {
      return this._pageScrolling && holdMs == null;
    },

    _bindSpeechScrollGuard() {
      if (this._onSpeechPageScroll) return;

      this._onSpeechPageScroll = () => {
        if (!this._pageScrolling) {
          this._pageScrolling = true;
          if (this.avatarSpeechOpen && this._avatarSpeechHoldMs == null) {
            this._clearSpeech();
          }
        }

        if (this._speechScrollIdleTimer != null) {
          window.clearTimeout(this._speechScrollIdleTimer);
        }
        this._speechScrollIdleTimer = window.setTimeout(() => {
          this._speechScrollIdleTimer = null;
          this._pageScrolling = false;
        }, SCROLL_IDLE_MS);
      };

      window.addEventListener("scroll", this._onSpeechPageScroll, {
        passive: true,
      });
    },

    destroyHeroSpeech() {
      this._clearSpeech();
      this._avatarSpeechObserver?.disconnect();
      this._avatarSpeechObserver = null;
      if (this._onSpeechPageScroll) {
        window.removeEventListener("scroll", this._onSpeechPageScroll);
        this._onSpeechPageScroll = null;
      }
      if (this._speechScrollIdleTimer != null) {
        window.clearTimeout(this._speechScrollIdleTimer);
        this._speechScrollIdleTimer = null;
      }
      this._pageScrolling = false;
    },
  };
}

/** Split into display tokens; trailing whitespace stays on the previous word. */
function splitSpeechWords(text) {
  const source = String(text ?? "");
  if (!source) return [];

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    const words = [];
    for (const { segment } of segmenter.segment(source)) {
      if (/^\s+$/.test(segment)) {
        if (words.length) words[words.length - 1] += segment;
        else words.push(segment);
      } else {
        words.push(segment);
      }
    }
    return words.filter((word) => word.length > 0);
  }

  const parts = source.trim().split(/\s+/);
  return parts.map((word, index) =>
    index < parts.length - 1 ? `${word} ` : word
  );
}

function resolveI18nPath(tree, path) {
  if (!path || !tree) return "";
  const value = String(path)
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), tree);
  return typeof value === "string" ? value : "";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
