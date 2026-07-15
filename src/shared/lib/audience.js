import { AUDIENCE_PARAM, audiences } from "../data/audiences.js";

/**
 * @param {string} [search]
 * @returns {string | null} Normalized audience id, or null for the full profile.
 */
export function resolveAudience(search = window.location.search) {
  const raw = new URLSearchParams(search).get(AUDIENCE_PARAM);
  if (!raw) return null;
  const id = String(raw).trim().toLowerCase();
  return audiences[id] ? id : null;
}

/**
 * @param {string | null | undefined} audienceId
 * @returns {{ hide: string[], primaryLinkIds?: string[], hideLinkIds?: string[] } | null}
 */
export function getAudiencePreset(audienceId) {
  if (!audienceId) return null;
  return audiences[audienceId] ?? null;
}

/**
 * @param {string | null | undefined} audienceId
 * @returns {ReadonlySet<string>}
 */
export function getHiddenSections(audienceId) {
  return new Set(getAudiencePreset(audienceId)?.hide ?? []);
}

/**
 * Drop hidden panels from the live DOM so nav spy / infinite-scroll
 * never see them (call before those bind).
 * @param {ParentNode} [root]
 * @param {Iterable<string>} sectionIds
 */
export function removeHiddenSections(root = document, sectionIds) {
  for (const id of sectionIds) {
    root.querySelector?.(`#${CSS.escape(id)}`)?.remove();
  }
}
