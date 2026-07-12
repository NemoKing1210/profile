import ru from "./locales/ru.js";
import en from "./locales/en.js";
import es from "./locales/es.js";
import de from "./locales/de.js";
import zh from "./locales/zh.js";

export const STORAGE_KEY = "profile-locale";
export const DEFAULT_LOCALE = "ru";

export const locales = { ru, en, es, de, zh };

export const localeList = [ru, en, es, de, zh].map((locale) => ({
  code: locale.code,
  nativeName: locale.nativeName,
}));

export function resolveInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locales[saved]) return saved;
  } catch {
    /* ignore */
  }

  const browser = (navigator.language || "").toLowerCase();
  if (browser.startsWith("zh")) return "zh";
  const short = browser.slice(0, 2);
  if (locales[short]) return short;

  return DEFAULT_LOCALE;
}
