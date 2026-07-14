/** Persisted unlock for the future light theme (UI ships separately). */
export const LIGHT_THEME_UNLOCK_KEY = "profile:light-theme-unlocked";

export function isLightThemeUnlocked() {
  try {
    return localStorage.getItem(LIGHT_THEME_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockLightTheme() {
  try {
    localStorage.setItem(LIGHT_THEME_UNLOCK_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
