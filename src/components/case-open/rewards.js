/**
 * Weighted CS-style loot table for the profile case opener.
 * Weights sum to 100; jackpot is fixed at 1%.
 */

/** @typedef {'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert'} CaseRarity */

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
  { id: "caseJackpot", rarity: "covert", weight: 1, emoji: "🏆" },
  { id: "confetti", rarity: "restricted", weight: 14, emoji: "🎉" },
  { id: "emojiBalloons", rarity: "milspec", weight: 12, emoji: "🎈" },
  { id: "progFact", rarity: "industrial", weight: 14, emoji: "💡" },
  { id: "screenShake", rarity: "milspec", weight: 8, emoji: "💥" },
  { id: "heroSpawn", rarity: "restricted", weight: 10, emoji: "⚛️" },
  { id: "vacJoke", rarity: "classified", weight: 6, emoji: "🚫" },
  { id: "titleGlitch", rarity: "industrial", weight: 7, emoji: "📺" },
  { id: "accentPulse", rarity: "consumer", weight: 8, emoji: "✨" },
  { id: "emptyCase", rarity: "consumer", weight: 10, emoji: "📦" },
  { id: "profileTip", rarity: "industrial", weight: 10, emoji: "🗺️" },
]);

const TOTAL_WEIGHT = CASE_REWARDS.reduce((sum, r) => sum + r.weight, 0);

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
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const reward of CASE_REWARDS) {
    roll -= reward.weight;
    if (roll <= 0) return reward;
  }
  return CASE_REWARDS[CASE_REWARDS.length - 1];
}

/**
 * @param {string} id
 * @returns {CaseRewardDef | undefined}
 */
export function getRewardById(id) {
  return CASE_REWARDS.find((r) => r.id === id);
}

/**
 * Build a decoy strip with the winner fixed at `winIndex`.
 * @param {CaseRewardDef} winner
 * @param {number} [length]
 * @param {number} [winIndex]
 * @returns {{ id: string, rarity: CaseRarity, emoji: string, win: boolean }[]}
 */
export function buildReel(winner, length = 48, winIndex = 38) {
  const decoys = CASE_REWARDS.filter((r) => r.id !== "caseJackpot");
  /** @type {{ id: string, rarity: CaseRarity, emoji: string, win: boolean }[]} */
  const items = [];

  for (let i = 0; i < length; i++) {
    if (i === winIndex) {
      items.push({
        id: winner.id,
        rarity: winner.rarity,
        emoji: winner.emoji,
        win: true,
      });
      continue;
    }
    // Rare gold tease slots (not the actual winner).
    if (i !== winIndex && Math.random() < 0.04) {
      const gold = CASE_REWARDS[0];
      items.push({
        id: gold.id,
        rarity: gold.rarity,
        emoji: gold.emoji,
        win: false,
      });
      continue;
    }
    const pick = decoys[Math.floor(Math.random() * decoys.length)];
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
