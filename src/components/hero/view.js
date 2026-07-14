import profile from "../../shared/data/profile.js";

export function heroViewMethods() {
  return {
    get status() {
      return this.t.hero.status;
    },

    get role() {
      return this.t.hero.role;
    },

    get tagline() {
      return this.t.hero.tagline;
    },

    get metaChips() {
      const chips = [
        {
          id: "location",
          kind: "location",
          icon: "mapPin",
          label: this.t.hero.location,
          speechI18n: "hero.locationTip",
        },
        ...(profile.spokenLanguages || []).map((code) => ({
          id: `lang-${code}`,
          kind: "lang",
          icon: "language",
          label: this.t.spoken[code] || code,
          speechText: profile.spokenHellos?.[code] || null,
        })),
      ];

      if (this.birthYear) {
        chips.push({
          id: "birth",
          kind: "birth",
          icon: "cake",
          label: `${this.t.ui.birthPrefix} ${this.birthYear}`,
          speechI18n: "hero.birthTip",
        });
      }

      return chips;
    },
  };
}
