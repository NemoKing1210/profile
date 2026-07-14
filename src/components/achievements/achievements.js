import {
  ACHIEVEMENT_ICONS,
  ACHIEVEMENT_IDS,
  achievementsTotalCount,
  achievementsUnlockedCount,
  isAchievementEffectEnabled,
  readAchievementUnlocks,
  setAchievementEffectEnabled,
  unlockAchievement,
} from "../../shared/data/achievements.js";

export function achievementsState() {
  return {
    achievementsOpen: false,
    achievementUnlocks: readAchievementUnlocks(),
    achievementTipId: null,
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

    get unlockedAchievements() {
      const items = this.t.achievements?.items || {};
      return ACHIEVEMENT_IDS.filter((id) => this.achievementUnlocks[id]).map(
        (id) => {
          const copy = items[id] || {};
          const unlock = this.achievementUnlocks[id];
          const unlockedAt = unlock?.unlockedAt;
          const iconKey = ACHIEVEMENT_ICONS[id] || "trophy";
          return {
            id,
            title: copy.title || id,
            how: copy.how || "",
            effect: copy.effect || "",
            effectEnabled: unlock?.effectEnabled !== false,
            unlockedAt,
            unlockedAtLabel: this.formatAchievementUnlockedAt(unlockedAt),
            icon: this.icons?.[iconKey] || this.icons?.trophy || "",
          };
        }
      );
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

    /**
     * Enable / disable the gameplay effect of an unlocked achievement.
     * @param {string} id
     */
    toggleAchievementEffect(id) {
      const currentlyOn = isAchievementEffectEnabled(id, this.achievementUnlocks);
      const next = !currentlyOn;
      setAchievementEffectEnabled(id, next);
      this.achievementUnlocks = readAchievementUnlocks();

      if (id === "lightTheme") {
        this._syncLightThemeEffect(next);
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

    /**
     * Persist + refresh reactive unlock map.
     * @param {string} id
     * @returns {boolean} newly unlocked
     */
    unlockAchievementRecord(id) {
      const wasNew = unlockAchievement(id);
      this.achievementUnlocks = readAchievementUnlocks();
      return wasNew;
    },

    refreshAchievements() {
      this.achievementUnlocks = readAchievementUnlocks();
    },
  };
}
