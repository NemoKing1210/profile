import { faviconForHref } from "../../shared/data/link-icons.js";
import { linkMarks } from "../../shared/data/link-marks.js";
import profile from "../../shared/data/profile.js";
import { getAudiencePreset } from "../../shared/lib/audience.js";

function mediaHubLink(id, media, label) {
  if (!media?.href) return null;
  return {
    id,
    label,
    href: media.href,
  };
}

export function linksViewMethods() {
  return {
    get links() {
      return profile.links.map((link) => ({
        ...link,
        hint: this.t.links.hints[link.id] || "",
        mark: linkMarks[link.id] || linkMarks.linktree,
        lightTile: link.id === "github" || link.id === "letterboxd",
        speechI18n: this.t.links.speechTips?.[link.id]
          ? `links.speechTips.${link.id}`
          : null,
      }));
    },

    get linksTitle() {
      return this.t.links.title;
    },

    get hub() {
      return profile.hub;
    },

    get hubPlatforms() {
      return (profile.hub?.platforms || []).map((id) => ({
        id,
        label: this.t.hub.platforms[id] || id,
        mark: linkMarks[id] || linkMarks.linktree,
        lightTile: id === "github" || id === "letterboxd",
      }));
    },

    resolvePrimaryLink(id) {
      const fromLinks = this.links.find((link) => link.id === id);
      if (fromLinks) return fromLinks;

      if (id === "steam") {
        return mediaHubLink(
          "steam",
          profile.media?.steam,
          this.t.hub?.platforms?.steam || this.t.steam?.title || "Steam"
        );
      }

      return null;
    },

    get primaryLinks() {
      const overrideIds = getAudiencePreset(this.audience)?.primaryLinkIds;
      const base = overrideIds
        ? overrideIds.map((id) => this.resolvePrimaryLink(id)).filter(Boolean)
        : this.links.slice(0, 2);

      return base.map((link) => ({
        ...link,
        icon: faviconForHref(link.href),
      }));
    },
  };
}
