/**
 * Weighted CS-style loot table for the profile case opener.
 * Weights sum to 100; jackpot 1%, fake jackpot 2%, rickroll 2%.
 * Some drops leave the live pool after related unlocks (see `getActiveCaseRewards`).
 */

import {
  achievementsTotalCount,
  achievementsUnlockedCount,
  isAchievementUnlocked,
} from "../../shared/data/achievements.js";

/** @typedef {'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'gold'} CaseRarity */

/**
 * @typedef {{
 *   id: string,
 *   rarity: CaseRarity,
 *   weight: number,
 *   emoji: string,
 * }} CaseRewardDef
 */

/** @type {readonly CaseRewardDef[]} */
export const CASE_REWARDS = Object.freeze([
  { id: "caseJackpot", rarity: "gold", weight: 1, emoji: "🏆" },
  /** Looks identical to Gold Drop on the reel; reveal is a bait-and-switch. */
  { id: "fakeJackpot", rarity: "gold", weight: 2, emoji: "🏆" },
  { id: "rickroll", rarity: "classified", weight: 2, emoji: "🎵" },
  { id: "echoMidpath", rarity: "classified", weight: 2, emoji: "∞" },
  { id: "textCorrupt", rarity: "classified", weight: 3, emoji: "░" },
  { id: "blockFall", rarity: "restricted", weight: 7, emoji: "🧱" },
  { id: "alphabetCubes", rarity: "milspec", weight: 7, emoji: "🔤" },
  { id: "localeSwitch", rarity: "restricted", weight: 6, emoji: "🌐" },
  { id: "lightFlash", rarity: "milspec", weight: 5, emoji: "☀️" },
  { id: "socialCredit", rarity: "restricted", weight: 5, emoji: "📈" },
  { id: "dizziness", rarity: "milspec", weight: 4, emoji: "😵" },
  { id: "confetti", rarity: "restricted", weight: 5, emoji: "🎉" },
  { id: "emojiBalloons", rarity: "milspec", weight: 6, emoji: "🎈" },
  { id: "progFact", rarity: "industrial", weight: 6, emoji: "💡" },
  { id: "screenShake", rarity: "milspec", weight: 5, emoji: "💥" },
  { id: "siteLock", rarity: "classified", weight: 4, emoji: "🔒" },
  { id: "vacJoke", rarity: "classified", weight: 4, emoji: "🚫" },
  { id: "blockSwap", rarity: "industrial", weight: 4, emoji: "🔀" },
  { id: "accentPulse", rarity: "consumer", weight: 4, emoji: "✨" },
  { id: "blockResize", rarity: "restricted", weight: 5, emoji: "📐" },
  { id: "textBlind", rarity: "classified", weight: 4, emoji: "👓" },
  { id: "taunt", rarity: "milspec", weight: 4, emoji: "😈" },
  { id: "emptyCase", rarity: "consumer", weight: 2, emoji: "📦" },
  { id: "profileTip", rarity: "industrial", weight: 3, emoji: "🗺️" },
]);

/** Trophy skins — keep off random decoy slots so gold stays rare. */
const REEL_GOLD_IDS = new Set(["caseJackpot", "fakeJackpot"]);

const TOTAL_WEIGHT = CASE_REWARDS.reduce((sum, r) => sum + r.weight, 0);

/** Total weight of the full catalog (before unlock-gated filters). */
export const CASE_TOTAL_WEIGHT = TOTAL_WEIGHT;

/**
 * @param {CaseRewardDef} reward
 * @returns {boolean}
 */
function isRewardInLivePool(reward) {
  if (reward.id === "lightFlash" && isAchievementUnlocked("lightTheme")) {
    return false;
  }
  if (
    reward.id === "profileTip" &&
    achievementsUnlockedCount() >= achievementsTotalCount()
  ) {
    return false;
  }
  return true;
}

/**
 * Live loot table — drops leave once their tease unlock is permanent.
 * @returns {CaseRewardDef[]}
 */
export function getActiveCaseRewards() {
  return CASE_REWARDS.filter(isRewardInLivePool);
}

/**
 * @param {CaseRewardDef[]} [pool]
 * @returns {number}
 */
function poolTotalWeight(pool = getActiveCaseRewards()) {
  return pool.reduce((sum, r) => sum + r.weight, 0);
}

/**
 * Drop chance as a percentage against the live (filtered) pool.
 * @param {{ id?: string, weight: number } | null | undefined} reward
 * @returns {number}
 */
export function getRewardChancePercent(reward) {
  if (!reward) return 0;
  const pool = getActiveCaseRewards();
  const total = poolTotalWeight(pool);
  if (!total) return 0;
  if (reward.id && !pool.some((r) => r.id === reward.id)) return 0;
  return Math.round((reward.weight / total) * 1000) / 10;
}

/** Floating emoji pool for balloon drops. */
export const BALLOON_EMOJIS = Object.freeze([
  "🎈",
  "⭐",
  "🔥",
  "💜",
  "🎮",
  "🚀",
  "👾",
  "💿",
  "🦴",
  "🐸",
  "⚡",
  "🧑‍💻",
]);

/**
 * @returns {CaseRewardDef}
 */
export function rollWeightedReward() {
  const pool = getActiveCaseRewards();
  const total = poolTotalWeight(pool);
  let roll = Math.random() * total;
  for (const reward of pool) {
    roll -= reward.weight;
    if (roll <= 0) return reward;
  }
  return pool[pool.length - 1] || CASE_REWARDS[CASE_REWARDS.length - 1];
}

/** Stable reward ids in catalog order (1-based console refs). */
export const CASE_REWARD_IDS = Object.freeze(CASE_REWARDS.map((r) => r.id));

/**
 * @param {string} id
 * @returns {CaseRewardDef | undefined}
 */
export function getRewardById(id) {
  return CASE_REWARDS.find((r) => r.id === id);
}

/**
 * Resolve reward from 1-based index, 0-based index, or id string.
 * Index refs use the live pool so console numbers match `ids()`.
 * @param {string | number} ref
 * @returns {CaseRewardDef | null}
 */
export function resolveRewardRef(ref) {
  const pool = getActiveCaseRewards();

  if (typeof ref === "number" && Number.isFinite(ref)) {
    const asOneBased = pool[ref - 1];
    if (asOneBased) return asOneBased;
    const asZeroBased = pool[ref];
    if (asZeroBased && ref >= 0) return asZeroBased;
    return null;
  }

  const raw = String(ref ?? "").trim();
  if (!raw) return null;

  const byId = getRewardById(raw);
  if (byId) {
    // Force-by-id still works for debug even if filtered from the live pool.
    return byId;
  }

  const asNum = Number(raw);
  if (Number.isInteger(asNum)) return resolveRewardRef(asNum);

  return null;
}

/**
 * Build a decoy strip with the winner fixed at `winIndex`.
 * @param {CaseRewardDef} winner
 * @param {number} [length]
 * @param {number} [winIndex]
 * @returns {{ id: string, rarity: CaseRarity, emoji: string, win: boolean }[]}
 */
export function buildReel(winner, length = 48, winIndex = 38) {
  const pool = getActiveCaseRewards();
  const decoys = pool.filter((r) => !REEL_GOLD_IDS.has(r.id));
  /** @type {{ id: string, rarity: CaseRarity, emoji: string, win: boolean }[]} */
  const items = [];
  const gold = CASE_REWARDS.find((r) => r.id === "caseJackpot");
  // Fake jackpot uses the real gold jackpot skin on the strip.
  const winSkin =
    winner.id === "fakeJackpot" && gold
      ? { id: winner.id, rarity: gold.rarity, emoji: gold.emoji }
      : winner;

  for (let i = 0; i < length; i++) {
    if (i === winIndex) {
      items.push({
        id: winSkin.id,
        rarity: winSkin.rarity,
        emoji: winSkin.emoji,
        win: true,
      });
      continue;
    }
    // Rare gold tease slots (not the actual winner).
    if (gold && Math.random() < 0.04) {
      items.push({
        id: gold.id,
        rarity: gold.rarity,
        emoji: gold.emoji,
        win: false,
      });
      continue;
    }
    const pick = decoys[Math.floor(Math.random() * decoys.length)] || pool[0];
    if (!pick) continue;
    items.push({
      id: pick.id,
      rarity: pick.rarity,
      emoji: pick.emoji,
      win: false,
    });
  }

  return items;
}

export const REEL_WIN_INDEX = 38;
export const REEL_ITEM_WIDTH = 112;
