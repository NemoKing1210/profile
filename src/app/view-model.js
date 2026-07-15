import profile from "../shared/data/profile.js";
import { DEFAULT_LOCALE, locales } from "../shared/i18n/index.js";
import {
  getHiddenSections,
  removeHiddenSections,
  resolveAudience,
} from "../shared/lib/audience.js";

/** Cross-cutting page view-model (locale + nav + audience). Section getters live in components. */
export function viewModelState() {
  const audience = resolveAudience();
  return {
    audience,
    hiddenSections: getHiddenSections(audience),
  };
}

export function viewModelMethods() {
  return {
    get t() {
      return locales[this.locale] || locales[DEFAULT_LOCALE];
    },

    isSectionVisible(id) {
      return !this.hiddenSections.has(id);
    },

    applyAudienceLayout() {
      removeHiddenSections(this.$root ?? document, this.hiddenSections);
    },

    get nav() {
      const commentsCount = this.commentFeed.length;
      return profile.nav
        .filter((item) => this.isSectionVisible(item.id))
        .map((item) => ({
          ...item,
          label: this.t.nav[item.id] || item.id,
          badge: item.id === "comments" ? commentsCount : null,
        }));
    },
  };
}
