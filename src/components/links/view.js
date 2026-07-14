import { faviconForHref } from "../../shared/data/link-icons.js";
import { linkMarks } from "../../shared/data/link-marks.js";
import profile from "../../shared/data/profile.js";

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

    get primaryLinks() {
      return this.links.slice(0, 2).map((link) => ({
        ...link,
        icon: faviconForHref(link.href),
      }));
    },
  };
}
