import {
  ACHIEVEMENT_EFFECT_IDS,
  ACHIEVEMENT_ICONS,
  ACHIEVEMENT_IDS,
  ACHIEVEMENTS_HINT_MS,
  ACHIEVEMENTS_HINT_STORAGE_KEY,
  LONG_STAY_MS,
  achievementsTotalCount,
  achievementsUnlockedCount,
  clearAllAchievements,
  isAchievementEffectEnabled,
  isAchievementUnlocked,
  lockAchievement,
  readAchievementUnlocks,
  resolveAchievementRef,
  setAchievementEffectEnabled,
  unlockAchievement,
} from "../../shared/data/achievements.js";
import {
  SPAWN_COLLECTOR_ACHIEVEMENT_ID,
  clearPhysicsSpawnProgress,
  listPhysicsSpawnKeys,
  readPhysicsSpawnProgress,
} from "../../shared/data/physics-spawns.js";

const ACHIEVEMENT_TOAST_HOLD_MS = 4_800;

export function achievementsState() {
  return {
    achievementsOpen: false,
    achievementUnlocks: readAchievementUnlocks(),
    achievementTipId: null,
    achievementToastOpen: false,
    achievementToast: null,
    achievementBtnPulse: false,
    _achievementToastQueue: [],
    _achievementToastTimer: null,
    _achievementBtnPulseTimer: null,
    _longStayAccumMs: 0,
    _longStayStartedAt: null,
    _longStayTimer: null,
    _onLongStayVisibility: null,
    _achievementsHintAccumMs: 0,
    _achievementsHintStartedAt: null,
    _achievementsHintTimer: null,
    _onAchievementsHintVisibility: null,
  };
}

export function achievementsMethods() {
  return {
    get hasAchievements() {
      return achievementsUnlockedCount(this.achievementUnlocks) > 0;
    },

    get achievementsProgress() {
      const done = achievementsUnlockedCount(this.achievementUnlocks);
      const total = achievementsTotalCount();
      return {
        done,
        total,
        ratio: total > 0 ? done / total : 0,
      };
    },

    get achievementsProgressLabel() {
      const { done, total } = this.achievementsProgress;
      const template = this.t.achievements?.progressLabel || "{done} / {total}";
      return template
        .replace("{done}", String(done))
        .replace("{total}", String(total));
    },

    get achievementsComplete() {
      const { done, total } = this.achievementsProgress;
      return total > 0 && done >= total;
    },

    get unlockedAchievements() {
      const items = this.t.achievements?.items || {};
      return ACHIEVEMENT_IDS.filter((id) => this.achievementUnlocks[id]).map(
        (id) => this._achievementViewItem(id, items)
      );
    },

    _achievementViewItem(id, items = this.t.achievements?.items || {}) {
      const copy = items[id] || {};
      const unlock = this.achievementUnlocks[id];
      const unlockedAt = unlock?.unlockedAt;
      const iconKey = ACHIEVEMENT_ICONS[id] || "trophy";
      return {
        id,
        title: copy.title || id,
        how: copy.how || "",
        effect: copy.effect || "",
        hasEffect: ACHIEVEMENT_EFFECT_IDS.has(id),
        effectEnabled: unlock?.effectEnabled !== false,
        unlockedAt,
        unlockedAtLabel: this.formatAchievementUnlockedAt(unlockedAt),
        icon: this.icons?.[iconKey] || this.icons?.trophy || "",
      };
    },

    /**
     * @param {number | undefined} timestamp
     */
    formatAchievementUnlockedAt(timestamp) {
      if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
        return "";
      }
      const date = new Intl.DateTimeFormat(this.locale || "en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(timestamp));
      const template = this.t.achievements?.unlockedAt || "{date}";
      return template.replace("{date}", date);
    },

    showAchievementTip(id) {
      this.achievementTipId = id;
    },

    hideAchievementTip(id) {
      if (id != null && this.achievementTipId !== id) return;
      this.achievementTipId = null;
    },

    prefersAchievementHover() {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    },

    onAchievementCardEnter(id) {
      if (!this.prefersAchievementHover()) return;
      this.showAchievementTip(id);
    },

    onAchievementCardLeave(id) {
      if (!this.prefersAchievementHover()) return;
      this.hideAchievementTip(id);
    },

    onAchievementCardClick(id) {
      if (this.prefersAchievementHover()) return;
      this.achievementTipId = this.achievementTipId === id ? null : id;
    },

    toggleAchievementsPanel() {
      this.achievementsOpen = !this.achievementsOpen;
      if (this.achievementsOpen) {
        this.themeJokeOpen = false;
        this.closeLangMenu?.();
        this.closeNav?.();
        document.documentElement.classList.add("achievements-drawer-lock");
      } else {
        this.achievementTipId = null;
        document.documentElement.classList.remove("achievements-drawer-lock");
      }
    },

    closeAchievementsPanel() {
      this.achievementsOpen = false;
      this.achievementTipId = null;
      document.documentElement.classList.remove("achievements-drawer-lock");
    },

    openAchievementsFromToast() {
      this.hideAchievementToast({ advance: false });
      this.themeJokeOpen = false;
      this.closeLangMenu?.();
      this.closeNav?.();
      this.achievementsOpen = true;
      document.documentElement.classList.add("achievements-drawer-lock");
    },

    /**
     * Enable / disable the gameplay effect of an unlocked achievement.
     * @param {string} id
     */
    toggleAchievementEffect(id) {
      if (!ACHIEVEMENT_EFFECT_IDS.has(id)) return;

      const currentlyOn = isAchievementEffectEnabled(id, this.achievementUnlocks);
      const next = !currentlyOn;
      setAchievementEffectEnabled(id, next);
      this.achievementUnlocks = readAchievementUnlocks();

      if (id === "lightTheme") {
        this._syncLightThemeEffect(next);
      }
      if (id === SPAWN_COLLECTOR_ACHIEVEMENT_ID && next) {
        this.applyPhysicsSpawnCollectorEffect?.();
      }
    },

    /**
     * @param {boolean} enabled
     */
    _syncLightThemeEffect(enabled) {
      this.lightThemeUnlocked = enabled
        ? true
        : Boolean(this.achievementUnlocks?.lightTheme);

      if (enabled) return;
      if (!this.themeLight) return;

      this._beginThemeSwitch?.(320);
      this.themeLight = false;
      this._persistThemePreference?.();
      this._syncThemeColorMeta?.();
    },

    _syncLightThemeUnlockFlag() {
      const unlocked = Boolean(this.achievementUnlocks?.lightTheme);
      this.lightThemeUnlocked = unlocked
        ? isAchievementEffectEnabled("lightTheme", this.achievementUnlocks)
        : false;
      if (!unlocked && this.themeLight) {
        this._beginThemeSwitch?.(320);
        this.themeLight = false;
        this._persistThemePreference?.();
        this._syncThemeColorMeta?.();
      }
    },

    /**
     * Persist + refresh reactive unlock map, then show Steam-style toast.
     * @param {string} id
     * @param {{ notify?: boolean }} [opts]
     * @returns {boolean} newly unlocked
     */
    unlockAchievementRecord(id, { notify = true } = {}) {
      const wasNew = unlockAchievement(id);
      this.achievementUnlocks = readAchievementUnlocks();

      if (wasNew) {
        if (id === "lightTheme") {
          this.lightThemeUnlocked = true;
        }
        if (notify) {
          this.enqueueAchievementToast(id);
          this.pulseAchievementButton();
        }
      }

      return wasNew;
    },

    pulseAchievementButton() {
      if (this._achievementBtnPulseTimer != null) {
        window.clearTimeout(this._achievementBtnPulseTimer);
        this._achievementBtnPulseTimer = null;
      }

      // Retrigger CSS animation even if already pulsing.
      this.achievementBtnPulse = false;
      this.$nextTick(() => {
        this.achievementBtnPulse = true;
        this._achievementBtnPulseTimer = window.setTimeout(() => {
          this._achievementBtnPulseTimer = null;
          this.achievementBtnPulse = false;
        }, 2_400);
      });
    },

    /**
     * @param {string} id
     * @returns {boolean}
     */
    lockAchievementRecord(id) {
      const wasLocked = lockAchievement(id);
      this.achievementUnlocks = readAchievementUnlocks();
      if (wasLocked && id === "lightTheme") {
        this._syncLightThemeUnlockFlag();
      }
      return wasLocked;
    },

    clearAchievementRecords() {
      clearAllAchievements();
      clearPhysicsSpawnProgress();
      try {
        localStorage.removeItem(ACHIEVEMENTS_HINT_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      this.achievementUnlocks = readAchievementUnlocks();
      this.hideAchievementToast({ advance: false });
      this._achievementToastQueue = [];
      this._syncLightThemeUnlockFlag();
    },

    refreshAchievements() {
      this.achievementUnlocks = readAchievementUnlocks();
    },

    enqueueAchievementToast(id) {
      if (!ACHIEVEMENT_IDS.includes(id)) return;
      if (!this._achievementToastQueue) this._achievementToastQueue = [];

      if (
        this.achievementToast?.id === id ||
        this._achievementToastQueue.includes(id)
      ) {
        return;
      }

      this._achievementToastQueue.push(id);
      if (!this.achievementToastOpen) {
        this._pumpAchievementToastQueue();
      }
    },

    _pumpAchievementToastQueue() {
      const nextId = this._achievementToastQueue.shift();
      if (!nextId) {
        this.achievementToastOpen = false;
        this.achievementToast = null;
        return;
      }

      const item = this._achievementViewItem(nextId);
      this.achievementToast = item;
      this.achievementToastOpen = true;

      if (this._achievementToastTimer != null) {
        window.clearTimeout(this._achievementToastTimer);
      }
      this._achievementToastTimer = window.setTimeout(() => {
        this._achievementToastTimer = null;
        this.hideAchievementToast({ advance: true });
      }, ACHIEVEMENT_TOAST_HOLD_MS);
    },

    hideAchievementToast({ advance = true } = {}) {
      if (this._achievementToastTimer != null) {
        window.clearTimeout(this._achievementToastTimer);
        this._achievementToastTimer = null;
      }
      this.achievementToastOpen = false;
      this.achievementToast = null;

      if (advance && this._achievementToastQueue?.length) {
        window.setTimeout(() => this._pumpAchievementToastQueue(), 120);
      }
    },

    /**
     * Unlock `longStay` after LONG_STAY_MS of visible tab time.
     * Pauses while the document is hidden so background tabs don't count.
     */
    bindLongStayAchievement() {
      if (isAchievementUnlocked("longStay")) return;
      if (this._onLongStayVisibility) return;

      this._longStayAccumMs = 0;
      this._longStayStartedAt = null;
      this._longStayTimer = null;

      this._onLongStayVisibility = () => {
        if (document.hidden) {
          this._pauseLongStayClock();
        } else {
          this._resumeLongStayClock();
        }
      };
      document.addEventListener("visibilitychange", this._onLongStayVisibility);

      if (!document.hidden) {
        this._resumeLongStayClock();
      }
    },

    _resumeLongStayClock() {
      if (isAchievementUnlocked("longStay")) {
        this._teardownLongStayAchievement();
        return;
      }
      if (this._longStayStartedAt != null) return;

      this._longStayStartedAt = performance.now();
      const remaining = Math.max(0, LONG_STAY_MS - this._longStayAccumMs);

      if (this._longStayTimer != null) {
        window.clearTimeout(this._longStayTimer);
      }
      this._longStayTimer = window.setTimeout(() => {
        this._longStayTimer = null;
        this._longStayStartedAt = null;
        this._longStayAccumMs = LONG_STAY_MS;
        this.unlockAchievementRecord("longStay");
        this._teardownLongStayAchievement();
      }, remaining);
    },

    _pauseLongStayClock() {
      if (this._longStayStartedAt == null) return;

      this._longStayAccumMs += performance.now() - this._longStayStartedAt;
      this._longStayStartedAt = null;

      if (this._longStayTimer != null) {
        window.clearTimeout(this._longStayTimer);
        this._longStayTimer = null;
      }
    },

    _teardownLongStayAchievement() {
      this._pauseLongStayClock();
      if (this._onLongStayVisibility) {
        document.removeEventListener(
          "visibilitychange",
          this._onLongStayVisibility
        );
        this._onLongStayVisibility = null;
      }
    },

    /**
     * After ACHIEVEMENTS_HINT_MS of visible time with zero unlocks,
     * avatar tips that achievements exist (once per browser).
     */
    bindAchievementsDiscoverHint() {
      if (this.hasAchievements) return;
      if (this._wasAchievementsHintShown()) return;
      if (this._onAchievementsHintVisibility) return;

      this._achievementsHintAccumMs = 0;
      this._achievementsHintStartedAt = null;
      this._achievementsHintTimer = null;

      this._onAchievementsHintVisibility = () => {
        if (document.hidden) {
          this._pauseAchievementsHintClock();
        } else {
          this._resumeAchievementsHintClock();
        }
      };
      document.addEventListener(
        "visibilitychange",
        this._onAchievementsHintVisibility
      );

      if (!document.hidden) {
        this._resumeAchievementsHintClock();
      }
    },

    _resumeAchievementsHintClock() {
      if (this.hasAchievements || this._wasAchievementsHintShown()) {
        this._teardownAchievementsDiscoverHint();
        return;
      }
      if (this._achievementsHintStartedAt != null) return;

      this._achievementsHintStartedAt = performance.now();
      const remaining = Math.max(
        0,
        ACHIEVEMENTS_HINT_MS - this._achievementsHintAccumMs
      );

      if (this._achievementsHintTimer != null) {
        window.clearTimeout(this._achievementsHintTimer);
      }
      this._achievementsHintTimer = window.setTimeout(() => {
        this._achievementsHintTimer = null;
        this._achievementsHintStartedAt = null;
        this._achievementsHintAccumMs = ACHIEVEMENTS_HINT_MS;
        this._speakAchievementsDiscoverHint();
        this._teardownAchievementsDiscoverHint();
      }, remaining);
    },

    _pauseAchievementsHintClock() {
      if (this._achievementsHintStartedAt == null) return;

      this._achievementsHintAccumMs +=
        performance.now() - this._achievementsHintStartedAt;
      this._achievementsHintStartedAt = null;

      if (this._achievementsHintTimer != null) {
        window.clearTimeout(this._achievementsHintTimer);
        this._achievementsHintTimer = null;
      }
    },

    _speakAchievementsDiscoverHint() {
      if (this.hasAchievements) return;
      if (this._wasAchievementsHintShown()) return;

      this._markAchievementsHintShown();
      this.showSpeechI18n?.("ui.achievementsDiscoverTip");
    },

    _wasAchievementsHintShown() {
      try {
        return localStorage.getItem(ACHIEVEMENTS_HINT_STORAGE_KEY) === "1";
      } catch {
        return false;
      }
    },

    _markAchievementsHintShown() {
      try {
        localStorage.setItem(ACHIEVEMENTS_HINT_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    },

    _teardownAchievementsDiscoverHint() {
      this._pauseAchievementsHintClock();
      if (this._onAchievementsHintVisibility) {
        document.removeEventListener(
          "visibilitychange",
          this._onAchievementsHintVisibility
        );
        this._onAchievementsHintVisibility = null;
      }
    },

    bindAchievementDebugApi() {
      const resolve = (ref) => resolveAchievementRef(ref);

      const api = {
        ids: () =>
          ACHIEVEMENT_IDS.map((id, index) => ({
            n: index + 1,
            id,
            unlocked: Boolean(this.achievementUnlocks?.[id]),
          })),
        list: () => ({ ...this.achievementUnlocks }),
        spawns: () => {
          const found = [...readPhysicsSpawnProgress()].sort();
          const total = listPhysicsSpawnKeys();
          return {
            found: found.length,
            total: total.length,
            keys: found,
            missing: total.filter((key) => !found.includes(key)),
          };
        },
        add: (ref) => {
          const id = resolve(ref);
          if (!id) {
            console.warn("[achievement] unknown ref:", ref);
            return false;
          }
          const ok = this.unlockAchievementRecord(id);
          console.info(
            ok
              ? `[achievement] unlocked: ${id}`
              : `[achievement] already unlocked: ${id}`
          );
          return ok;
        },
        remove: (ref) => {
          const id = resolve(ref);
          if (!id) {
            console.warn("[achievement] unknown ref:", ref);
            return false;
          }
          const ok = this.lockAchievementRecord(id);
          console.info(
            ok
              ? `[achievement] locked: ${id}`
              : `[achievement] was not unlocked: ${id}`
          );
          return ok;
        },
        clear: () => {
          this.clearAchievementRecords();
          console.info("[achievement] cleared all");
          return true;
        },
        addAll: () => {
          let granted = 0;
          for (const id of ACHIEVEMENT_IDS) {
            if (this.unlockAchievementRecord(id, { notify: false })) {
              granted += 1;
            }
          }
          if (granted > 0) this.pulseAchievementButton();
          console.info(
            `[achievement] unlocked all (${granted} new / ${ACHIEVEMENT_IDS.length} total)`
          );
          return api.ids();
        },
        help: () => {
          console.info(
            [
              "achievement API",
              "  achievement.ids()           — catalog with 1-based numbers",
              "  achievement.list()          — unlocked map",
              "  achievement.spawns()        — physics spawn collector progress",
              "  achievement.add(1|id)       — grant + toast",
              "  achievement.addAll()        — grant every achievement (no toast spam)",
              "  achievement.remove(1|id)    — revoke",
              "  achievement.clear()         — wipe all",
              "  achievement.help()          — this text",
            ].join("\n")
          );
          return api.ids();
        },
      };

      window.achievement = api;
      return api;
    },

    destroyAchievements() {
      this.hideAchievementToast({ advance: false });
      this._achievementToastQueue = [];
      if (this._achievementBtnPulseTimer != null) {
        window.clearTimeout(this._achievementBtnPulseTimer);
        this._achievementBtnPulseTimer = null;
      }
      this.achievementBtnPulse = false;
      this._teardownLongStayAchievement();
      this._teardownAchievementsDiscoverHint();
      this.closeAchievementsPanel();
      if (window.achievement) {
        delete window.achievement;
      }
    },
  };
}
