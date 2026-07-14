export function heroSpeechState() {
  return {
    physicsPlayCount: 0,
    avatarSpeechOpen: false,
    avatarSpeechText: "",
    avatarSpeechTyping: false,
    _avatarSpeechKey: null,
    _speechPlayEnoughDone: false,
    _speechPlayAlongDone: false,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
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
        this.startAvatarSpeech("playEnough");
        return;
      }

      if (this.physicsPlayCount >= 30) {
        this._speechPlayAlongDone = true;
        this.startAvatarSpeech("playAlong");
        this.spawnAvatarSquare();
      }
    },

    startAvatarSpeech(key) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechKey = key;
      this.avatarSpeechOpen = true;
      this.avatarSpeechText = "";
      this.avatarSpeechTyping = true;

      const full = this.t.hero[key] || "";
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
      }, 32);
    },

    hideAvatarSpeech() {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this.avatarSpeechText = "";
      this._avatarSpeechKey = null;
    },

    _scheduleAvatarSpeechHide() {
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHideTimer = window.setTimeout(() => {
        this._avatarSpeechHideTimer = null;
        this.hideAvatarSpeech();
      }, 5000);
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
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
