const DEFAULT_HOLD_MS = 5000;
const TYPE_INTERVAL_MS = 32;

export function heroSpeechState() {
  return {
    physicsPlayCount: 0,
    avatarSpeechOpen: false,
    avatarSpeechText: "",
    avatarSpeechTyping: false,
    avatarSpeechAnchor: "hero",
    avatarInView: true,
    _avatarSpeechI18nPath: null,
    _avatarSpeechHoldMs: DEFAULT_HOLD_MS,
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

    spawnTechBall(tech) {
      this._heroPhysics?.spawnTechBall?.(tech);
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
      this._avatarSpeechI18nPath = null;
      this._beginSpeech(String(text ?? ""), holdMs);
    },

    showSpeechI18n(path, { holdMs = DEFAULT_HOLD_MS } = {}) {
      this._avatarSpeechI18nPath = path;
      this._beginSpeech(resolveI18nPath(this.t, path), holdMs);
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

    _beginSpeech(full, holdMs) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHoldMs = holdMs;
      this.avatarSpeechAnchor = this.avatarInView ? "hero" : "brand";
      this.avatarSpeechOpen = true;
      this.avatarSpeechText = "";
      this.avatarSpeechTyping = true;

      if (!full || prefersReducedMotion()) {
        this.avatarSpeechText = full;
        this.avatarSpeechTyping = false;
        this._scheduleAvatarSpeechHide();
        return;
      }

      let i = 0;
      this._avatarSpeechTimer = window.setInterval(() => {
        i += 1;
        this.avatarSpeechText = full.slice(0, i);
        if (i >= full.length) {
          this._stopAvatarSpeechTimer();
          this.avatarSpeechTyping = false;
          this._scheduleAvatarSpeechHide();
        }
      }, TYPE_INTERVAL_MS);
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
