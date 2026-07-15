/**
 * Audience presets for `?from=<id>`.
 * Section ids match `profile.nav` / panel `id` attributes.
 *
 * Optional `primaryLinkIds` replaces the hero CTA row (default: first two of
 * `profile.links`). Ids may come from `profile.links` or known media hubs
 * (e.g. `steam` → `profile.media.steam`).
 *
 * Optional `hideLinkIds` omits matching direct links and hub platform chips
 * in the Links panel.
 */
export const AUDIENCE_PARAM = "from";

/**
 * @typedef {object} AudiencePreset
 * @property {string[]} hide
 * @property {string[]} [primaryLinkIds]
 * @property {string[]} [hideLinkIds]
 * @property {"steam"} [heroIdentity] — use `profile.media.<id>` for hero name/handle
 * @property {"games"} [physicsBalls] — hero drop catalog (`gameBalls` instead of tech)
 * @property {{ id: string, tone?: string, speechI18n?: string }[]} [aboutBadges]
 */

/** @type {Record<string, AudiencePreset>} */
export const audiences = {
  /** Linked from Steam — focus on the person, not the code portfolio. */
  steam: {
    hide: ["stack", "projects"],
    primaryLinkIds: ["steam", "linktree"],
    hideLinkIds: ["github", "orcid"],
    heroIdentity: "steam",
    physicsBalls: "games",
    aboutBadges: [
      { id: "coop", tone: "accent" },
      { id: "library", tone: "accent" },
      { id: "nights", tone: "hot" },
      { id: "friends", tone: "green" },
      { id: "story", tone: "accent" },
      { id: "chill", tone: "muted" },
    ],
  },
};
