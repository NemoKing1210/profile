import { isAchievementEffectEnabled } from "../../shared/data/achievements.js";
import {
  SPAWN_COLLECTOR_ACHIEVEMENT_ID,
  buildPhysicsCatalogSpawnJobs,
  markPhysicsSpawned,
  resolveTechBall,
} from "../../shared/data/physics-spawns.js";
import { createSpeechQueue } from "./speech-queue.js";

const DEFAULT_HOLD_MS = 5000;
const WORD_INTERVAL_MS = 118;
/** Extra hold after typewriter finishes when hide was requested early (hover leave). */
const HOVER_HIDE_DELAY_MS = 1000;
/** After the last scroll event, wait this long before allowing hover tips again. */
const SCROLL_IDLE_MS = 160;
/** Stagger between catalog drops when the spawnCollector effect runs. */
const CATALOG_SPAWN_STAGGER_MS = 48;
/**
 * Sticky tips deferred behind a timed beat get a finite hold so they cannot
 * linger forever after the pointer has already moved on.
 */
const DEFERRED_STICKY_HOLD_MS = DEFAULT_HOLD_MS;

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
    _avatarSpeechIdentity: null,
    _avatarSpeechHeard: null,
    _avatarSpeechQueue: null,
    _speechPlayAlongDone: false,
    _physicsPlayTipCursor: 0,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
    /** Set when hide is requested while words are still typing out. */
    _avatarSpeechHidePending: false,
    _avatarSpeechObserver: null,
    _pageScrolling: false,
    _speechScrollIdleTimer: null,
    _onSpeechPageScroll: null,
    _physicsCatalogSpawnTimers: null,
  };
}

export function heroSpeechMethods() {
  return {
    spawnFlagSquare(code, { scroll = true, track = true } = {}) {
      const option = this.localeList.find((item) => item.code === code);
      this._heroPhysics?.spawnFlagSquare?.({
        locale: code,
        label: option?.nativeName || code,
      });
      if (scroll) this.scrollToHero();
      if (track && code) this._notePhysicsSpawn(`flag:${code}`);
    },

    spawnAiTool(tool, { scroll = true, track = true } = {}) {
      this._heroPhysics?.spawnAiSquare?.(tool);
      if (scroll) this.scrollToHero();
      if (track && tool?.id) this._notePhysicsSpawn(`ai:${tool.id}`);
    },

    spawnTechBall(tech, opts = {}) {
      const { scroll = true, track = true, ...spawnOpts } = opts;
      const ball = resolveTechBall(tech);
      this._heroPhysics?.spawnTechBall?.(ball, spawnOpts);
      if (scroll) this.scrollToHero();
      if (track && ball?.id) this._notePhysicsSpawn(`tech:${ball.id}`);
    },

    spawnAvatarSquare({ track = true } = {}) {
      this._heroPhysics?.spawnAvatarSquare?.({
        src: this.avatar,
        label: this.name,
      });
      if (track) this._notePhysicsSpawn("avatar");
    },

    /**
     * Persist discovery progress; unlock spawnCollector when the catalog is full.
     * @param {string} key
     */
    _notePhysicsSpawn(key) {
      const { complete } = markPhysicsSpawned(key);
      if (!complete) return;
      this.unlockAchievementRecord?.(SPAWN_COLLECTOR_ACHIEVEMENT_ID);
    },

    /**
     * Drop every catalog body into the hero (spawnCollector effect).
     * Skips tracking so auto-drops don't re-toast; no scroll spam.
     */
    applyPhysicsSpawnCollectorEffect() {
      if (
        !isAchievementEffectEnabled(
          SPAWN_COLLECTOR_ACHIEVEMENT_ID,
          this.achievementUnlocks
        )
      ) {
        return;
      }
      if (!this._heroPhysics) return;

      this._clearPhysicsCatalogSpawnTimers();

      const physics = this._heroPhysics;
      const jobs = buildPhysicsCatalogSpawnJobs({
        spawnFlag: (opts) =>
          physics.spawnFlagSquare?.({ ...opts, unique: true }),
        spawnAvatar: () =>
          physics.spawnAvatarSquare?.({
            src: this.avatar,
            label: this.name,
            unique: true,
          }),
        spawnTech: (ball, spawnOpts) =>
          physics.spawnTechBall?.(ball, { ...spawnOpts, unique: true }),
        spawnAi: (tool) => physics.spawnAiSquare?.(tool, { unique: true }),
        aiTools: this.aiTools || [],
      });

      this._physicsCatalogSpawnTimers = jobs.map((job, index) =>
        window.setTimeout(() => {
          try {
            job();
          } catch {
            /* ignore spawn errors */
          }
        }, 80 + index * CATALOG_SPAWN_STAGGER_MS)
      );
    },

    _clearPhysicsCatalogSpawnTimers() {
      if (!this._physicsCatalogSpawnTimers?.length) return;
      for (const id of this._physicsCatalogSpawnTimers) {
        window.clearTimeout(id);
      }
      this._physicsCatalogSpawnTimers = null;
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
      const full = String(text ?? "");
      if (!full) return;
      this._offerSpeech({
        identity: `text:${full}`,
        text: full,
        i18nPath: null,
        holdMs,
      });
    },

    showSpeechI18n(path, { holdMs = DEFAULT_HOLD_MS } = {}) {
      if (!path) return;
      this._offerSpeech({
        identity: `i18n:${path}`,
        text: "",
        i18nPath: path,
        holdMs,
      });
    },

    hideSpeech() {
      // Scroll moves the cursor across tipped nodes → mouseleave. Don't let that
      // dismiss timed / event speeches (only sticky hover tips use holdMs: null).
      if (this._pageScrolling && this._avatarSpeechHoldMs != null) return;

      // Never cancel a timed beat via mouseleave / focusout.
      if (this._avatarSpeechHoldMs != null) return;

      this._requestSpeechHide();
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

    /** @returns {ReturnType<typeof createSpeechQueue>} */
    _queue() {
      if (!this._avatarSpeechQueue) {
        this._avatarSpeechQueue = createSpeechQueue();
      }
      return this._avatarSpeechQueue;
    },

    _isSpeechBusy() {
      return this.avatarSpeechOpen || this.avatarSpeechTyping;
    },

    /**
     * Admit a speech job: play now, refresh same line, or enqueue (no dups).
     * Never interrupts a line that is still speaking — newcomers wait in queue.
     * @param {import("./speech-queue.js").SpeechJob} job
     */
    _offerSpeech(job) {
      if (this._shouldSuppressHoverSpeech(job.holdMs)) return;

      // Same line again (locale refresh): update copy in place, keep the beat.
      if (
        job.identity &&
        job.identity === this._avatarSpeechIdentity &&
        this.avatarSpeechOpen
      ) {
        this._playSpeechJob(job);
        return;
      }

      if (this._queue().has(job.identity)) return;

      if (!this._isSpeechBusy()) {
        this._playSpeechJob(job);
        return;
      }

      this._queue().enqueue(job);

      // If the current line already finished typing, start winding it down so
      // the queued message can follow (sticky tips otherwise wait for mouseleave).
      if (!this.avatarSpeechTyping && this.avatarSpeechOpen) {
        this._scheduleReleaseForQueue();
      }
    },

    /**
     * @param {import("./speech-queue.js").SpeechJob} job
     * @param {{ deferredSticky?: boolean }} [opts]
     */
    _playSpeechJob(job, { deferredSticky = false } = {}) {
      const holdMs =
        deferredSticky && job.holdMs == null
          ? DEFERRED_STICKY_HOLD_MS
          : job.holdMs;

      const text = job.i18nPath
        ? resolveI18nPath(this.t, job.i18nPath)
        : String(job.text ?? "");

      if (!text) {
        this._advanceSpeechQueue();
        return;
      }

      this._avatarSpeechIdentity = job.identity;
      this._avatarSpeechI18nPath = job.i18nPath ?? null;
      this._beginSpeech(text, holdMs, { identity: job.identity });
    },

    _advanceSpeechQueue() {
      const next = this._queue().dequeue();
      if (!next) return;
      if (this._shouldSuppressHoverSpeech(next.holdMs)) {
        this._advanceSpeechQueue();
        return;
      }
      this._playSpeechJob(next, { deferredSticky: next.holdMs == null });
    },

    _beginSpeech(full, holdMs, { identity } = {}) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHidePending = false;
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
        this._afterSpeechTyped();
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
          this._afterSpeechTyped();
        }
      }, WORD_INTERVAL_MS);
    },

    /** Called once the current line is fully on screen (or shown instantly). */
    _afterSpeechTyped() {
      if (this._avatarSpeechHidePending) {
        this._scheduleHoverSpeechHide();
        return;
      }
      if (this._queue().size > 0) {
        this._scheduleReleaseForQueue();
        return;
      }
      this._scheduleAvatarSpeechHide();
    },

    /**
     * Short beat after the line is spoken, then clear and play the next job.
     * Used when something is already waiting so sticky tips don't block the queue.
     */
    _scheduleReleaseForQueue() {
      if (this._queue().size === 0) return;
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHideTimer = window.setTimeout(() => {
        this._avatarSpeechHideTimer = null;
        this._clearSpeech({ advance: true });
      }, HOVER_HIDE_DELAY_MS);
    },

    /**
     * Hide after the typewriter finishes (if still typing), then a short hold.
     * Lets hover tips finish reading out when the pointer leaves early.
     */
    _requestSpeechHide() {
      if (this.avatarSpeechTyping) {
        this._avatarSpeechHidePending = true;
        return;
      }
      this._scheduleHoverSpeechHide();
    },

    _scheduleHoverSpeechHide() {
      this._avatarSpeechHidePending = false;
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHideTimer = window.setTimeout(() => {
        this._avatarSpeechHideTimer = null;
        this._clearSpeech({ advance: true });
      }, HOVER_HIDE_DELAY_MS);
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
        this._clearSpeech({ advance: true });
      }, this._avatarSpeechHoldMs);
    },

    /**
     * @param {{ advance?: boolean }} [opts]
     */
    _clearSpeech({ advance = false } = {}) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHidePending = false;
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this._avatarSpeechI18nPath = null;
      this._avatarSpeechIdentity = null;
      this._avatarSpeechHoldMs = DEFAULT_HOLD_MS;

      if (advance) this._advanceSpeechQueue();
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
            this._requestSpeechHide();
          }
          this._queue().removeWhere((job) => job.holdMs == null);
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
      this._queue().clear();
      this._clearSpeech({ advance: false });
      this._clearPhysicsCatalogSpawnTimers();
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
