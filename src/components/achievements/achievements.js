import {
  ACHIEVEMENT_ICONS,
  ACHIEVEMENT_IDS,
  achievementsTotalCount,
  achievementsUnlockedCount,
  readAchievementUnlocks,
  unlockAchievement,
} from "../../shared/data/achievements.js";

export function achievementsState() {
  return {
    achievementsOpen: false,
    achievementUnlocks: readAchievementUnlocks(),
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
          const unlockedAt = this.achievementUnlocks[id]?.unlockedAt;
          const iconKey = ACHIEVEMENT_ICONS[id] || "trophy";
          return {
            id,
            title: copy.title || id,
            how: copy.how || "",
            unlockedAt,
            icon: this.icons?.[iconKey] || this.icons?.trophy || "",
          };
        }
      );
    },

    toggleAchievementsPanel() {
      this.achievementsOpen = !this.achievementsOpen;
      if (this.achievementsOpen) {
        this.themeJokeOpen = false;
        this.closeLangMenu?.();
        this.closeNav?.();
        document.documentElement.classList.add("achievements-drawer-lock");
      } else {
        document.documentElement.classList.remove("achievements-drawer-lock");
      }
    },

    closeAchievementsPanel() {
      this.achievementsOpen = false;
      document.documentElement.classList.remove("achievements-drawer-lock");
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
