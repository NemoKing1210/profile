import profile from "../../shared/data/profile.js";
import { projectMarks } from "../../shared/data/project-marks.js";

export function interestsViewMethods() {
  return {
    get interests() {
      const copy = this.t.interests || {};
      const hobbyLabels = copy.hobbies || {};
      const hobbies = (profile.interests?.hobbies || []).map((hobby) => ({
        ...hobby,
        label: hobbyLabels[hobby.id] || hobby.id,
        icon: this.icons[hobby.icon] || "",
      }));
      return {
        title: copy.title || "",
        blurb: copy.blurb || "",
        hobbies,
      };
    },

    get letterboxd() {
      const media = profile.media?.letterboxd || {};
      const copy = this.t.letterboxd || {};
      const subgenreLabels = copy.subgenres || {};
      return {
        href: media.href || "",
        name: media.name || "",
        avatar: media.avatar || "",
        about: copy.about || "",
        favorites: (media.favorites || []).map((film) =>
          typeof film === "string"
            ? {
                id: film,
                title: film,
                year: null,
                cover: "",
                href: media.href || "",
              }
            : {
                id: film.id,
                title: film.title,
                year: film.year || null,
                cover: film.banner || film.cover || "",
                href: film.href || media.href || "",
              }
        ),
        subgenres: (media.subgenres || []).map((item) => ({
          ...item,
          label: subgenreLabels[item.id] || item.id,
        })),
      };
    },

    get letterboxdCta() {
      return (
        this.t.letterboxd.openProfile || this.t.letterboxd.title || "Letterboxd"
      );
    },

    get backloggd() {
      const media = profile.media?.backloggd || {};
      const copy = this.t.backloggd || {};
      const genreLabels = copy.genres || {};
      const tipCopy = copy.tips || {};
      return {
        href: media.href || "",
        name: media.name || "",
        avatar: media.avatar || "",
        about: copy.about || "",
        favorites: (media.favorites || []).map((game) =>
          typeof game === "string"
            ? {
                id: game,
                title: game,
                year: null,
                cover: "",
                href: media.href || "",
                tip: "",
                tipKey: "",
                tipMode: "tooltip",
              }
            : {
                id: game.id,
                title: game.title,
                year: game.year || null,
                cover: game.cover || "",
                href: game.href || media.href || "",
                tip: game.tip ? tipCopy[game.tip] || "" : "",
                tipKey: game.tip || "",
                tipMode: game.tipMode === "speech" ? "speech" : "tooltip",
              }
        ),
        genres: (media.genres || []).map((item) => ({
          ...item,
          label: genreLabels[item.id] || item.id,
        })),
      };
    },

    get backloggdCta() {
      return (
        this.t.backloggd.openProfile || this.t.backloggd.title || "Backloggd"
      );
    },

    get steam() {
      const media = profile.media?.steam || {};
      const copy = this.t.steam || {};
      return {
        href: media.href || "",
        handle: media.handle || "",
        name: media.name || "",
        avatar: media.avatar || "",
        title: copy.title || "Steam",
        about: copy.about || "",
        invite: copy.invite || "",
        cta: copy.cta || copy.openProfile || "Steam",
        mark: projectMarks.steam,
      };
    },
  };
}
