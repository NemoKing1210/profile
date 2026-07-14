const DEFAULT_HOLD_MS = 5000;
const WORD_INTERVAL_MS = 118;

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
    _speechPlayEnoughDone: false,
    _speechPlayAlongDone: false,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
    _avatarSpeechObserver: null,
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

      if (this.physicsPlayCount === 20 && !this._speechPlayEnoughDone) {
        this._speechPlayEnoughDone = true;
        this.showSpeechI18n("hero.playEnough");
        return;
      }

      if (this.physicsPlayCount >= 30) {
        this._speechPlayAlongDone = true;
        this.showSpeechI18n("hero.playAlong");
        this.spawnAvatarSquare();
      }
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
    },

    showSpeech(text, { holdMs = DEFAULT_HOLD_MS } = {}) {
      const full = String(text ?? "");
      this._avatarSpeechI18nPath = null;
      this._beginSpeech(full, holdMs, { identity: `text:${full}` });
    },

    showSpeechI18n(path, { holdMs = DEFAULT_HOLD_MS } = {}) {
      this._avatarSpeechI18nPath = path;
      this._beginSpeech(resolveI18nPath(this.t, path), holdMs, {
        identity: `i18n:${path}`,
      });
    },

    hideSpeech() {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this._avatarSpeechI18nPath = null;
      this._avatarSpeechHoldMs = DEFAULT_HOLD_MS;
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
        this.hideSpeech();
      }, this._avatarSpeechHoldMs);
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

    destroyHeroSpeech() {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechObserver?.disconnect();
      this._avatarSpeechObserver = null;
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
