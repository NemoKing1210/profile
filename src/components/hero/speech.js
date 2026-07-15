import { isAchievementEffectEnabled } from "../../shared/data/achievements.js";
import {
  SPAWN_COLLECTOR_ACHIEVEMENT_ID,
  buildPhysicsCatalogSpawnJobs,
  markPhysicsSpawned,
  resolveTechBall,
} from "../../shared/data/physics-spawns.js";
import {
  SPEECH_ANCHOR_BRAND,
  SPEECH_AVATAR_SELECTOR,
  SPEECH_AVATAR_THRESHOLDS,
  applySpeechAvatarEntry,
  pickSpeechAnchor,
} from "./speech-avatars.js";
import { createSpeechQueue } from "./speech-queue.js";

/**
 * Temporary kill-switch: when false, new speech replaces the current line
 * immediately (no FIFO wait). Flip back to true to restore the queue.
 */
const SPEECH_QUEUE_ENABLED = false;

const DEFAULT_HOLD_MS = 5000;
/** Delay between typewriter word ticks (lower = faster). */
const WORD_INTERVAL_MS = 52;
/** Outgoing beat when replacing copy while the bubble stays open. */
const SPEECH_TEXT_SWAP_OUT_MS = 240;
/** Extra hold after typewriter finishes when hide was requested early (hover leave). */
const HOVER_HIDE_DELAY_MS = 1000;
/** Match `.avatar-speech-motion--leave` so CTA/copy stay painted through the fade-out. */
const SPEECH_LEAVE_MS = 380;
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
    /** null | "out" | "in" — crossfade when copy changes while the bubble is open. */
    avatarSpeechTextPhase: null,
    /** Bumps word keys so type-in animations replay on each line. */
    avatarSpeechEpoch: 0,
    avatarSpeechAnchor: SPEECH_ANCHOR_BRAND,
    avatarInView: false,
    /** @type {{ label: string, method: string, iconHtml: string, tone: string|null } | null} */
    avatarSpeechAction: null,
    /** Raw action spec kept for locale refresh. */
    _avatarSpeechActionSpec: null,
    _avatarSpeechI18nPath: null,
    _avatarSpeechHoldMs: DEFAULT_HOLD_MS,
    _avatarSpeechIdentity: null,
    _avatarSpeechHeard: null,
    _avatarSpeechQueue: null,
    _speechPlayAlongDone: false,
    _physicsPlayTipCursor: 0,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
    _avatarSpeechSwapTimer: null,
    /** Clears action/copy after the leave transition (keeps CTA visible while fading). */
    _speechDomScrubTimer: null,
    /** Set when hide is requested while words are still typing out. */
    _avatarSpeechHidePending: false,
    _avatarSpeechObserver: null,
    /** @type {Map<string, import("./speech-avatars.js").SpeechAvatarVisibility> | null} */
    _speechAvatarVisibility: null,
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
      if (this._avatarSpeechObserver) return;

      const hosts = document.querySelectorAll(SPEECH_AVATAR_SELECTOR);
      this._speechAvatarVisibility = new Map();

      this._avatarSpeechObserver = new IntersectionObserver(
        (entries) => {
          let changed = false;
          for (const entry of entries) {
            if (applySpeechAvatarEntry(this._speechAvatarVisibility, entry)) {
              changed = true;
            }
          }
          if (changed) this._syncSpeechAnchor();
        },
        { threshold: SPEECH_AVATAR_THRESHOLDS }
      );

      for (const host of hosts) {
        this._avatarSpeechObserver.observe(host);
      }

      this._syncSpeechAnchor();
      this._bindSpeechScrollGuard();
    },

    /**
     * Resolve the best visible profile avatar; brand (header) if none.
     * @returns {string}
     */
    _preferredSpeechAnchor() {
      return pickSpeechAnchor(this._speechAvatarVisibility);
    },

    /** Keep reactive anchor + avatarInView in sync with viewport hosts. */
    _syncSpeechAnchor() {
      const next = this._preferredSpeechAnchor();
      this.avatarInView = next !== SPEECH_ANCHOR_BRAND;
      if (this.avatarSpeechOpen) {
        this.avatarSpeechAnchor = next;
      }
    },

    showSpeech(text, { holdMs = DEFAULT_HOLD_MS, action = null } = {}) {
      const full = String(text ?? "");
      if (!full) return;
      this._offerSpeech({
        identity: `text:${full}`,
        text: full,
        i18nPath: null,
        holdMs,
        action: normalizeSpeechAction(action),
      });
    },

    showSpeechI18n(path, { holdMs = DEFAULT_HOLD_MS, action = null } = {}) {
      if (!path) return;
      this._offerSpeech({
        identity: `i18n:${path}`,
        text: "",
        i18nPath: path,
        holdMs,
        action: normalizeSpeechAction(action),
      });
    },

    onAvatarSpeechAction() {
      if (!this.avatarSpeechOpen) return;
      const method = this.avatarSpeechAction?.method;
      this._clearSpeech({ advance: true });
      if (method && typeof this[method] === "function") {
        this[method]();
      }
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

      if (!SPEECH_QUEUE_ENABLED) {
        this._queue().clear();
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
      this._avatarSpeechActionSpec = job.action ?? null;
      this.avatarSpeechAction = resolveSpeechAction(this.t, job.action, this.icons);
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
      this._stopAvatarSpeechSwapTimer();
      this._stopSpeechDomScrub();
      this._avatarSpeechHidePending = false;
      this._avatarSpeechHoldMs = holdMs;
      this.avatarSpeechAnchor = this._preferredSpeechAnchor();
      this.avatarInView = this.avatarSpeechAnchor !== SPEECH_ANCHOR_BRAND;

      const replacingOpen = this.avatarSpeechOpen;
      this.avatarSpeechOpen = true;

      if (replacingOpen && !prefersReducedMotion()) {
        this._swapSpeechText(full, holdMs, identity);
        return;
      }

      this.avatarSpeechTextPhase = null;
      this._revealSpeechText(full, holdMs, identity);
    },

    /**
     * Crossfade the line out, then type the next one in (bubble stays open).
     * @param {string} full
     * @param {number|null} holdMs
     * @param {string|undefined} identity
     */
    _swapSpeechText(full, holdMs, identity) {
      this.avatarSpeechTyping = false;
      this.avatarSpeechTextPhase = "out";

      this._avatarSpeechSwapTimer = window.setTimeout(() => {
        this._avatarSpeechSwapTimer = null;
        this.avatarSpeechTextPhase = "in";
        this._revealSpeechText(full, holdMs, identity);

        this._avatarSpeechSwapTimer = window.setTimeout(() => {
          this._avatarSpeechSwapTimer = null;
          if (this.avatarSpeechTextPhase === "in") {
            this.avatarSpeechTextPhase = null;
          }
        }, 420);
      }, SPEECH_TEXT_SWAP_OUT_MS);
    },

    /**
     * Start typewriter (or instant reveal) for the current line.
     * @param {string} full
     * @param {number|null} holdMs
     * @param {string|undefined} identity
     */
    _revealSpeechText(full, holdMs, identity) {
      this._avatarSpeechHoldMs = holdMs;
      this.avatarSpeechEpoch += 1;

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
      this._stopAvatarSpeechSwapTimer();
      this._avatarSpeechHidePending = false;
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this.avatarSpeechTextPhase = null;
      // Keep action + copy until leave finishes — otherwise the CTA pops blank mid-fade.
      this._avatarSpeechI18nPath = null;
      this._avatarSpeechIdentity = null;
      this._avatarSpeechHoldMs = DEFAULT_HOLD_MS;
      this._scheduleSpeechDomScrub();

      if (advance) this._advanceSpeechQueue();
    },

    _scheduleSpeechDomScrub() {
      this._stopSpeechDomScrub();
      const delay = prefersReducedMotion() ? 0 : SPEECH_LEAVE_MS;
      this._speechDomScrubTimer = window.setTimeout(() => {
        this._speechDomScrubTimer = null;
        if (this.avatarSpeechOpen) return;
        this.avatarSpeechAction = null;
        this._avatarSpeechActionSpec = null;
      }, delay);
    },

    _stopSpeechDomScrub() {
      if (this._speechDomScrubTimer != null) {
        window.clearTimeout(this._speechDomScrubTimer);
        this._speechDomScrubTimer = null;
      }
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

    _stopAvatarSpeechSwapTimer() {
      if (this._avatarSpeechSwapTimer != null) {
        window.clearTimeout(this._avatarSpeechSwapTimer);
        this._avatarSpeechSwapTimer = null;
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

    bindSpeechDebugApi() {
      const resolve = (ref) => resolveSpeechTemplate(ref);

      const api = {
        templates: () =>
          SPEECH_TEMPLATES.map((tpl, index) => ({
            n: index + 1,
            id: tpl.id,
            i18nPath: tpl.i18nPath || null,
            holdMs: tpl.holdMs ?? DEFAULT_HOLD_MS,
            hasAction: Boolean(tpl.action),
          })),
        list: () => api.templates(),
        state: () => ({
          open: this.avatarSpeechOpen,
          typing: this.avatarSpeechTyping,
          text: this.avatarSpeechText,
          i18nPath: this._avatarSpeechI18nPath,
          holdMs: this._avatarSpeechHoldMs,
          action: this.avatarSpeechAction
            ? {
                label: this.avatarSpeechAction.label,
                method: this.avatarSpeechAction.method,
                tone: this.avatarSpeechAction.tone,
              }
            : null,
          queueLen: this._queue().size,
        }),
        say: (text, opts = {}) => {
          const full = String(text ?? "").trim();
          if (!full) {
            console.warn("[speech] empty text");
            return false;
          }
          const holdMs =
            opts.holdMs === null ? null : Number(opts.holdMs) || DEFAULT_HOLD_MS;
          this.showSpeech(full, {
            holdMs,
            action: opts.action ?? null,
          });
          console.info(`[speech] say (${full.length} chars)`);
          return true;
        },
        i18n: (path, opts = {}) => {
          const key = String(path ?? "").trim();
          if (!key) {
            console.warn("[speech] empty i18n path");
            return false;
          }
          const holdMs =
            opts.holdMs === null ? null : Number(opts.holdMs) || DEFAULT_HOLD_MS;
          this.showSpeechI18n(key, {
            holdMs,
            action: opts.action ?? null,
          });
          console.info(`[speech] i18n: ${key}`);
          return true;
        },
        template: (ref, overrides = {}) => {
          const tpl = resolve(ref);
          if (!tpl) {
            console.warn("[speech] unknown template:", ref);
            return false;
          }
          const holdMs =
            overrides.holdMs !== undefined
              ? overrides.holdMs
              : (tpl.holdMs ?? DEFAULT_HOLD_MS);
          const action =
            overrides.action !== undefined
              ? overrides.action
              : (tpl.action ?? null);

          if (tpl.text != null && !tpl.i18nPath) {
            this.showSpeech(tpl.text, { holdMs, action });
          } else if (tpl.i18nPath) {
            this.showSpeechI18n(tpl.i18nPath, { holdMs, action });
          } else {
            console.warn("[speech] template has no text/i18n:", tpl.id);
            return false;
          }
          console.info(`[speech] template: ${tpl.id}`);
          return true;
        },
        demo: () => {
          this.showSpeech("Console demo — press Play", {
            holdMs: 12_000,
            action: {
              label: "Play",
              method: "onSpeechMusicListen",
              icon: "play",
              tone: "green",
            },
          });
          console.info("[speech] demo with green play CTA");
          return true;
        },
        hide: () => {
          this._queue().clear();
          this._clearSpeech({ advance: false });
          console.info("[speech] hidden");
          return true;
        },
        /**
         * Clear the one-shot music-listen tip flag so the timed hint can fire again.
         */
        resetMusicHint: () => {
          try {
            localStorage.removeItem("profile:music-listen-hint-shown");
          } catch {
            /* ignore */
          }
          this._musicListenHintAccumMs = 0;
          this._musicListenHintStartedAt = null;
          this.destroyMusicListenHint?.();
          this.bindMusicListenHint?.();
          console.info("[speech] music listen hint flag cleared + timer rebound");
          return true;
        },
        tones: () => [...SPEECH_ACTION_TONES],
        help: () => {
          console.info(
            [
              "speech API (avatar bubble)",
              "  speech.templates()              — catalog with 1-based numbers",
              "  speech.template(1|id, overrides?) — play a preset (opts: holdMs, action)",
              "  speech.say(text, opts?)          — custom copy",
              "  speech.i18n(path, opts?)         — showSpeechI18n path (e.g. ui.langSwitched)",
              "  speech.demo()                    — sample line + green Play CTA",
              "  speech.hide()                    — force-dismiss + clear queue",
              "  speech.state()                   — current bubble state",
              "  speech.tones()                   — CTA tones: green|accent|hot|danger|muted",
              "  speech.resetMusicHint()          — clear music tip localStorage + rebind",
              "  speech.help()                    — this text",
              "",
              "opts.action = { label | labelI18n, method, icon?, tone? }",
              "  e.g. speech.say('Hi', { holdMs: 8000, action: { label: 'Go', method: 'hideSpeech', tone: 'accent' } })",
              "  e.g. speech.template('musicListen')",
              "  e.g. speech.i18n('hero.playAlong', { holdMs: 6000 })",
            ].join("\n")
          );
          return api.templates();
        },
      };

      window.speech = api;
      return api;
    },

    destroyHeroSpeech() {
      this._queue().clear();
      this._clearSpeech({ advance: false });
      this._stopSpeechDomScrub();
      this.avatarSpeechAction = null;
      this._avatarSpeechActionSpec = null;
      this._clearPhysicsCatalogSpawnTimers();
      this._avatarSpeechObserver?.disconnect();
      this._avatarSpeechObserver = null;
      this._speechAvatarVisibility = null;
      if (this._onSpeechPageScroll) {
        window.removeEventListener("scroll", this._onSpeechPageScroll);
        this._onSpeechPageScroll = null;
      }
      if (this._speechScrollIdleTimer != null) {
        window.clearTimeout(this._speechScrollIdleTimer);
        this._speechScrollIdleTimer = null;
      }
      this._pageScrolling = false;
      if (window.speech) {
        delete window.speech;
      }
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

const SPEECH_ACTION_TONES = new Set([
  "green",
  "accent",
  "hot",
  "danger",
  "muted",
]);

/**
 * Preset lines for the console debug API (`window.speech`).
 * @type {ReadonlyArray<{
 *   id: string,
 *   i18nPath?: string,
 *   text?: string,
 *   holdMs?: number|null,
 *   action?: import("./speech-queue.js").SpeechAction,
 * }>}
 */
const SPEECH_TEMPLATES = Object.freeze([
  {
    id: "musicListen",
    i18nPath: "ui.musicListenTip",
    holdMs: 12_000,
    action: {
      labelI18n: "ui.musicListenCta",
      method: "onSpeechMusicListen",
      icon: "play",
      tone: "green",
    },
  },
  {
    id: "achievementsDiscover",
    i18nPath: "ui.achievementsDiscoverTip",
  },
  {
    id: "langSwitched",
    i18nPath: "ui.langSwitched",
  },
  {
    id: "playEnough",
    i18nPath: "hero.playEnough",
  },
  {
    id: "playAlong",
    i18nPath: "hero.playAlong",
  },
  {
    id: "activityStart",
    i18nPath: "about.activity.startSpeech",
  },
  {
    id: "activityPlayStart",
    i18nPath: "about.activity.playStartSpeech",
  },
  {
    id: "activityPlayWin",
    i18nPath: "about.activity.playWinSpeech",
  },
]);

/**
 * @param {string|number} ref
 * @returns {(typeof SPEECH_TEMPLATES)[number]|null}
 */
function resolveSpeechTemplate(ref) {
  if (typeof ref === "number" && Number.isFinite(ref)) {
    const index = Math.trunc(ref) - 1;
    return SPEECH_TEMPLATES[index] ?? null;
  }
  const key = String(ref ?? "").trim();
  if (!key) return null;
  if (/^\d+$/.test(key)) {
    const index = Number(key) - 1;
    return SPEECH_TEMPLATES[index] ?? null;
  }
  return SPEECH_TEMPLATES.find((tpl) => tpl.id === key) ?? null;
}

/**
 * @param {unknown} action
 * @returns {import("./speech-queue.js").SpeechAction|null}
 */
function normalizeSpeechAction(action) {
  if (!action || typeof action !== "object") return null;
  const method = String(action.method || "").trim();
  if (!method) return null;
  const labelI18n =
    typeof action.labelI18n === "string" && action.labelI18n
      ? action.labelI18n
      : null;
  const label =
    typeof action.label === "string" && action.label ? action.label : "";
  if (!labelI18n && !label) return null;
  const icon =
    typeof action.icon === "string" && action.icon.trim()
      ? action.icon.trim()
      : null;
  const toneRaw = typeof action.tone === "string" ? action.tone.trim() : "";
  const tone = SPEECH_ACTION_TONES.has(toneRaw) ? toneRaw : null;
  return { method, labelI18n, label, icon, tone };
}

/**
 * @param {object} tree
 * @param {import("./speech-queue.js").SpeechAction|null|undefined} action
 * @param {Record<string, string>|null|undefined} icons
 * @returns {{ label: string, method: string, iconHtml: string, tone: string|null } | null}
 */
function resolveSpeechAction(tree, action, icons) {
  if (!action?.method) return null;
  const label = action.labelI18n
    ? resolveI18nPath(tree, action.labelI18n)
    : String(action.label || "");
  if (!label) return null;
  const iconKey = action.icon;
  const iconHtml =
    iconKey && icons && typeof icons[iconKey] === "string" ? icons[iconKey] : "";
  return {
    label,
    method: action.method,
    iconHtml,
    tone: action.tone || null,
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
