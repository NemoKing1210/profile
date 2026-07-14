/**
 * Resolve a service favicon from an outbound link URL.
 */
export function faviconForHref(href, size = 64) {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
  } catch {
    return "";
  }
}
