import profile from "../shared/data/profile.js";
import { DEFAULT_LOCALE, locales } from "../shared/i18n/index.js";

/** Cross-cutting page view-model (locale + nav). Section getters live in components. */
export function viewModelMethods() {
  return {
    get t() {
      return locales[this.locale] || locales[DEFAULT_LOCALE];
    },

    get nav() {
      const commentsCount = this.commentFeed.length;
      return profile.nav.map((item) => ({
        ...item,
        label: this.t.nav[item.id] || item.id,
        badge: item.id === "comments" ? commentsCount : null,
      }));
    },
  };
}
