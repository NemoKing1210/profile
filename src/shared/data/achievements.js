/**
 * Achievement catalog + localStorage persistence.
 * Copy lives in i18n (`t.achievements.items[id]`).
 */

export const ACHIEVEMENTS_STORAGE_KEY = "profile:achievements";
/** Legacy key from before the achievements system. */
const LEGACY_LIGHT_THEME_KEY = "profile:light-theme-unlocked";

/** Stable ids — keep in sync with locale `achievements.items`. */
export const ACHIEVEMENT_IDS = Object.freeze([
  "lightTheme",
  "activitySnake",
  "longStay",
  "commentMod",
  "interfaceMine",
  "foundFooter",
  "spawnCollector",
]);

/** Heroicon key per achievement (see `shared/data/heroicons.js`). */
export const ACHIEVEMENT_ICONS = Object.freeze({
  lightTheme: "sun",
  activitySnake: "puzzlePiece",
  longStay: "clock",
  commentMod: "handThumbUp",
  interfaceMine: "cube",
  foundFooter: "mapPin",
  spawnCollector: "sparkles",
});

/** Active dwell time on the page required to unlock `longStay`. */
export const LONG_STAY_MS = 5 * 60 * 1000;

/** Visible dwell before avatar mentions achievements (if none unlocked yet). */
export const ACHIEVEMENTS_HINT_MS = 90_000;

/** Shown-once flag for the empty-achievements avatar tip. */
export const ACHIEVEMENTS_HINT_STORAGE_KEY = "profile:achievements-hint-shown";

/** Achievements with a toggleable gameplay effect in the drawer. */
export const ACHIEVEMENT_EFFECT_IDS = Object.freeze(
  new Set(["lightTheme", "commentMod", "spawnCollector"])
);

/**
 * @typedef {{ unlockedAt: number, effectEnabled?: boolean }} AchievementUnlock
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
          map[id] = {
            unlockedAt,
            effectEnabled: value?.effectEnabled !== false,
          };
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
 * Unlocked and its gameplay effect currently enabled (default on).
 * @param {string} id
 * @param {AchievementUnlockMap} [map]
 */
export function isAchievementEffectEnabled(id, map = readAchievementUnlocks()) {
  const unlock = map[id];
  if (!unlock) return false;
  return unlock.effectEnabled !== false;
}

/**
 * @param {string} id
 * @param {boolean} enabled
 * @returns {boolean} whether the record was updated
 */
export function setAchievementEffectEnabled(id, enabled) {
  if (!ACHIEVEMENT_IDS.includes(id)) return false;

  const map = readAchievementUnlocks();
  if (!map[id]) return false;

  map[id] = {
    ...map[id],
    effectEnabled: Boolean(enabled),
  };
  writeAchievementUnlocks(map);
  return true;
}

/**
 * @param {string} id
 * @returns {boolean} true when newly unlocked
 */
export function unlockAchievement(id) {
  if (!ACHIEVEMENT_IDS.includes(id)) return false;

  const map = readAchievementUnlocks();
  if (map[id]) return false;

  map[id] = { unlockedAt: Date.now(), effectEnabled: true };
  writeAchievementUnlocks(map);
  return true;
}

/**
 * @param {string} id
 * @returns {boolean} true when it was unlocked and is now locked
 */
export function lockAchievement(id) {
  if (!ACHIEVEMENT_IDS.includes(id)) return false;

  const map = readAchievementUnlocks();
  if (!map[id]) return false;

  delete map[id];
  writeAchievementUnlocks(map);
  return true;
}

/** Wipe all persisted unlocks. */
export function clearAllAchievements() {
  writeAchievementUnlocks({});
}

/**
 * Resolve catalog id from 1-based index, 0-based index, or id string.
 * @param {string | number} ref
 * @returns {string | null}
 */
export function resolveAchievementRef(ref) {
  if (typeof ref === "number" && Number.isFinite(ref)) {
    const asOneBased = ACHIEVEMENT_IDS[ref - 1];
    if (asOneBased) return asOneBased;
    const asZeroBased = ACHIEVEMENT_IDS[ref];
    if (asZeroBased && ref >= 0) return asZeroBased;
    return null;
  }

  const raw = String(ref ?? "").trim();
  if (!raw) return null;
  if (ACHIEVEMENT_IDS.includes(raw)) return raw;

  const asNum = Number(raw);
  if (Number.isInteger(asNum)) return resolveAchievementRef(asNum);

  return null;
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
      map = {
        ...map,
        lightTheme: { unlockedAt: Date.now(), effectEnabled: true },
      };
      writeAchievementUnlocks(map);
      localStorage.removeItem(LEGACY_LIGHT_THEME_KEY);
    }
  } catch {
    /* ignore */
  }
  return map;
}
