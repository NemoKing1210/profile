/**
 * Weighted CS-style loot table for the profile case opener.
 * Weights sum to 100; jackpot 1%, fake jackpot 2%, rickroll 2%.
 */

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
  /** Looks identical to Covert Drop on the reel; reveal is a bait-and-switch. */
  { id: "fakeJackpot", rarity: "gold", weight: 2, emoji: "🏆" },
  { id: "rickroll", rarity: "classified", weight: 2, emoji: "🎵" },
  { id: "echoMidpath", rarity: "classified", weight: 2, emoji: "∞" },
  { id: "textCorrupt", rarity: "classified", weight: 3, emoji: "░" },
  { id: "blockFall", rarity: "restricted", weight: 7, emoji: "🧱" },
  { id: "alphabetCubes", rarity: "milspec", weight: 8, emoji: "🔤" },
  { id: "localeSwitch", rarity: "restricted", weight: 7, emoji: "🌐" },
  { id: "lightFlash", rarity: "milspec", weight: 6, emoji: "☀️" },
  { id: "socialCredit", rarity: "restricted", weight: 6, emoji: "📈" },
  { id: "dizziness", rarity: "milspec", weight: 5, emoji: "😵" },
  { id: "confetti", rarity: "restricted", weight: 6, emoji: "🎉" },
  { id: "emojiBalloons", rarity: "milspec", weight: 6, emoji: "🎈" },
  { id: "progFact", rarity: "industrial", weight: 8, emoji: "💡" },
  { id: "screenShake", rarity: "milspec", weight: 5, emoji: "💥" },
  { id: "siteLock", rarity: "classified", weight: 4, emoji: "🔒" },
  { id: "vacJoke", rarity: "classified", weight: 4, emoji: "🚫" },
  { id: "titleGlitch", rarity: "industrial", weight: 5, emoji: "📺" },
  { id: "accentPulse", rarity: "consumer", weight: 6, emoji: "✨" },
  { id: "emptyCase", rarity: "consumer", weight: 3, emoji: "📦" },
  { id: "profileTip", rarity: "industrial", weight: 4, emoji: "🗺️" },
]);

/** Trophy skins — keep off random decoy slots so gold stays rare. */
const REEL_GOLD_IDS = new Set(["caseJackpot", "fakeJackpot"]);

const TOTAL_WEIGHT = CASE_REWARDS.reduce((sum, r) => sum + r.weight, 0);

/** Total weight used by the roller (100 with the current table). */
export const CASE_TOTAL_WEIGHT = TOTAL_WEIGHT;

/**
 * Drop chance as a percentage (weights are tuned to sum ≈ 100).
 * @param {{ weight: number } | null | undefined} reward
 * @returns {number}
 */
export function getRewardChancePercent(reward) {
  if (!reward || !TOTAL_WEIGHT) return 0;
  return Math.round((reward.weight / TOTAL_WEIGHT) * 1000) / 10;
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
  const decoys = CASE_REWARDS.filter((r) => !REEL_GOLD_IDS.has(r.id));
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
