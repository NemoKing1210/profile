import { localeFlagDataUrl } from "../data/locale-flags.js";
import ru from "./locales/ru/index.js";
import uk from "./locales/uk/index.js";
import en from "./locales/en/index.js";
import es from "./locales/es/index.js";
import de from "./locales/de/index.js";
import zh from "./locales/zh/index.js";
import ja from "./locales/ja/index.js";

export const STORAGE_KEY = "profile-locale";
export const DEFAULT_LOCALE = "en";

export const locales = { ru, uk, en, es, de, zh, ja };

export const localeList = [ru, uk, en, es, de, zh, ja].map((locale) => ({
  code: locale.code,
  nativeName: locale.nativeName,
  flag: localeFlagDataUrl(locale.code),
}));

/** Map a BCP 47 tag to a supported locale code, or null. */
function matchLocale(tag) {
  const browser = (tag || "").toLowerCase();
  if (!browser) return null;
  if (browser.startsWith("zh")) return "zh";
  if (browser.startsWith("uk")) return "uk";
  if (browser.startsWith("ja")) return "ja";
  const short = browser.slice(0, 2);
  if (locales[short]) return short;
  return null;
}

/**
 * Saved preference → browser languages → English.
 */
export function resolveInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locales[saved]) return saved;
  } catch {
    /* ignore */
  }

  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
  ].filter(Boolean);

  for (const tag of candidates) {
    const matched = matchLocale(tag);
    if (matched) return matched;
  }

  return DEFAULT_LOCALE;
}
