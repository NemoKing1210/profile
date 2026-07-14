/**
 * Flag SVGs for UI locales (country-flag-icons, 3×2).
 * Locale code → ISO 3166-1 alpha-2 used by the package.
 */
import CN from "country-flag-icons/string/3x2/CN";
import DE from "country-flag-icons/string/3x2/DE";
import ES from "country-flag-icons/string/3x2/ES";
import GB from "country-flag-icons/string/3x2/GB";
import JP from "country-flag-icons/string/3x2/JP";
import RU from "country-flag-icons/string/3x2/RU";
import UA from "country-flag-icons/string/3x2/UA";

export const localeFlagSvg = {
  ru: RU,
  uk: UA,
  en: GB,
  es: ES,
  de: DE,
  zh: CN,
  ja: JP,
};

/** Data-URL for <img> — avoids inline SVG blowing up Matter hitboxes. */
export function localeFlagDataUrl(locale) {
  const svg = localeFlagSvg[locale] || localeFlagSvg.en;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
