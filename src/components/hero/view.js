import profile from "../../shared/data/profile.js";
import { locales } from "../../shared/i18n/index.js";

const LOCALIZED_NAME_LOCALES = new Set(["ru", "uk", "en"]);

export function heroViewMethods() {
  return {
    /** Hero h1: ru/uk/en native forms; all other UI locales → English. */
    get displayName() {
      if (LOCALIZED_NAME_LOCALES.has(this.locale)) {
        return this.t.hero.name || this.name;
      }
      return locales.en.hero.name || this.name;
    },

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
