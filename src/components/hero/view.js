import profile from "../../shared/data/profile.js";
import { locales } from "../../shared/i18n/index.js";
import { getAudiencePreset } from "../../shared/lib/audience.js";

const LOCALIZED_NAME_LOCALES = new Set(["ru", "uk", "en"]);

function formatHandle(raw) {
  if (!raw) return "";
  const value = String(raw).trim();
  if (!value) return "";
  return value.startsWith("@") ? value : `@${value}`;
}

export function heroViewMethods() {
  return {
    get audienceHeroCopy() {
      const id = this.audience;
      if (!id) return null;
      return this.t.audiences?.[id]?.hero ?? null;
    },

    /** Hero h1: audience persona, else ru/uk/en native forms; other UI locales → English. */
    get displayName() {
      const preset = getAudiencePreset(this.audience);
      if (preset?.heroIdentity === "steam") {
        const steamName = profile.media?.steam?.name;
        if (steamName) return steamName;
      }

      if (LOCALIZED_NAME_LOCALES.has(this.locale)) {
        return this.t.hero.name || this.name;
      }
      return locales.en.hero.name || this.name;
    },

    get displayHandle() {
      const preset = getAudiencePreset(this.audience);
      if (preset?.heroIdentity === "steam") {
        const steamHandle = formatHandle(profile.media?.steam?.handle);
        if (steamHandle) return steamHandle;
      }
      return this.handle;
    },

    get status() {
      return this.t.hero.status;
    },

    get role() {
      return this.audienceHeroCopy?.role || this.t.hero.role;
    },

    get tagline() {
      return this.audienceHeroCopy?.tagline || this.t.hero.tagline;
    },

    get roleTipPath() {
      return this.audienceHeroCopy?.roleTip
        ? `audiences.${this.audience}.hero.roleTip`
        : "hero.roleTip";
    },

    get nameTipPath() {
      return this.audienceHeroCopy?.nameTip
        ? `audiences.${this.audience}.hero.nameTip`
        : "hero.nameTip";
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
