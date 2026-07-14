/**
 * Achievement catalog + localStorage persistence.
 * Copy lives in i18n (`t.achievements.items[id]`).
 */

export const ACHIEVEMENTS_STORAGE_KEY = "profile:achievements";
/** Legacy key from before the achievements system. */
const LEGACY_LIGHT_THEME_KEY = "profile:light-theme-unlocked";

/** Stable ids — keep in sync with locale `achievements.items`. */
export const ACHIEVEMENT_IDS = Object.freeze(["lightTheme"]);

/** Heroicon key per achievement (see `shared/data/heroicons.js`). */
export const ACHIEVEMENT_ICONS = Object.freeze({
  lightTheme: "sun",
});

/**
 * @typedef {{ unlockedAt: number }} AchievementUnlock
 * @typedef {Record<string, AchievementUnlock>} AchievementUnlockMap
 */

/**
 * @returns {AchievementUnlockMap}
 */
export function readAchievementUnlocks() {
  /** @type {AchievementUnlockMap} */
  let map = {};

  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.unlocked) {
        for (const [id, value] of Object.entries(parsed.unlocked)) {
          if (!ACHIEVEMENT_IDS.includes(id)) continue;
          const unlockedAt =
            typeof value?.unlockedAt === "number"
              ? value.unlockedAt
              : Date.now();
          map[id] = { unlockedAt };
        }
      }
    }
  } catch {
    map = {};
  }

  map = migrateLegacyLightTheme(map);
  return map;
}

/**
 * @param {string} id
 * @returns {boolean} true when newly unlocked
 */
export function unlockAchievement(id) {
  if (!ACHIEVEMENT_IDS.includes(id)) return false;

  const map = readAchievementUnlocks();
  if (map[id]) return false;

  map[id] = { unlockedAt: Date.now() };
  writeAchievementUnlocks(map);
  return true;
}

/**
 * @param {string} id
 */
export function isAchievementUnlocked(id) {
  return Boolean(readAchievementUnlocks()[id]);
}

export function achievementsTotalCount() {
  return ACHIEVEMENT_IDS.length;
}

/**
 * @param {AchievementUnlockMap} [map]
 */
export function achievementsUnlockedCount(map = readAchievementUnlocks()) {
  return Object.keys(map).length;
}

/**
 * @param {AchievementUnlockMap} map
 */
function writeAchievementUnlocks(map) {
  try {
    localStorage.setItem(
      ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify({ unlocked: map })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * @param {AchievementUnlockMap} map
 * @returns {AchievementUnlockMap}
 */
function migrateLegacyLightTheme(map) {
  if (map.lightTheme) return map;

  try {
    if (localStorage.getItem(LEGACY_LIGHT_THEME_KEY) === "1") {
      map = { ...map, lightTheme: { unlockedAt: Date.now() } };
      writeAchievementUnlocks(map);
      localStorage.removeItem(LEGACY_LIGHT_THEME_KEY);
    }
  } catch {
    /* ignore */
  }
  return map;
}
