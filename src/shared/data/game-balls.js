/**
 * Hero physics balls for the Steam / gamer audience (`?from=steam`).
 * Covers live in `public/assets/images/hero-games/` (`{id}.jpg`).
 */
const base = import.meta.env.BASE_URL;
const DIR = `${base}assets/images/hero-games`;

/**
 * @param {string} id
 * @param {string} label
 * @param {string} fill — CSS hex behind / around the cover
 * @param {string} [file]
 */
function gameBall(id, label, fill, file = `${id}.jpg`) {
  return {
    id,
    label,
    fill,
    image: `${DIR}/${file}`,
  };
}

/**
 * Ordered set dropped into the hero (subset on narrow viewports — first 9).
 */
export const gameBalls = [
  gameBall("dying-light", "Dying Light", "#c45c26"),
  gameBall("terraria", "Terraria", "#7eb238"),
  gameBall("metro-exodus", "Metro Exodus", "#4a5d4a"),
  gameBall("half-life-2", "Half-Life 2", "#e0972f"),
  gameBall("counter-strike-2", "Counter-Strike 2", "#de9b35"),
  gameBall("project-zomboid", "Project Zomboid", "#6b4f2a"),
  gameBall("rimworld", "RimWorld", "#c4a35a"),
  gameBall("teardown", "Teardown", "#3d7ea6"),
  gameBall("abiotic-factor", "Abiotic Factor", "#5b8c5a"),
  gameBall("it-takes-two", "It Takes Two", "#e85d4c"),
  gameBall("human-fall-flat", "Human: Fall Flat", "#f0c75e"),
  gameBall("peak", "PEAK", "#4a90a4"),
];

export const gameBallById = Object.fromEntries(
  gameBalls.map((item) => [item.id, item])
);
