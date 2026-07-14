/** @deprecated Prefer achievements.js — kept as a thin adapter. */
import {
  isAchievementUnlocked,
  unlockAchievement,
} from "./achievements.js";

export const LIGHT_THEME_UNLOCK_KEY = "profile:light-theme-unlocked";

export function isLightThemeUnlocked() {
  return isAchievementUnlocked("lightTheme");
}

export function unlockLightTheme() {
  unlockAchievement("lightTheme");
}
