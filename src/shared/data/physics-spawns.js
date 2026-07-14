/**
 * Unique user-spawnable hero physics bodies (flags, avatar, stack techs, AI).
 * Progress is separate from achievement unlocks so a partial hunt survives reloads.
 */
import { localeList } from "../i18n/index.js";
import profile from "./profile.js";
import { techBallById } from "./tech-balls.js";

export const PHYSICS_SPAWNS_STORAGE_KEY = "profile:physics-spawns";

export const SPAWN_COLLECTOR_ACHIEVEMENT_ID = "spawnCollector";

/** Explore techs spawn at half size in the stack UI. */
export function physicsExploreTechIds() {
  return new Set((profile.stackExplore || []).map((item) => item.mark));
}

/** Stable ordered list of track keys (`flag:ru`, `tech:vue`, `ai:cursor`, `avatar`). */
export function listPhysicsSpawnKeys() {
  const flags = localeList.map((item) => `flag:${item.code}`);
  const stackTechs = (profile.stackItems || []).flatMap((item) => item.techs || []);
  const exploreTechs = (profile.stackExplore || []).map((item) => item.mark);
  const techs = [...new Set([...stackTechs, ...exploreTechs])].map(
    (id) => `tech:${id}`
  );
  const ais = (profile.aiTools || []).map((tool) => `ai:${tool.id}`);
  return [...flags, "avatar", ...techs, ...ais];
}

export function physicsSpawnCatalogSize() {
  return listPhysicsSpawnKeys().length;
}

/**
 * Resolve a stack chip / explore mark into a tech ball for Matter spawn.
 * @param {string | { id?: string, path?: string }} tech
 */
export function resolveTechBall(tech) {
  if (!tech) return null;
  if (typeof tech === "string") return techBallById[tech] || null;
  if (tech.path && tech.id) return tech;
  if (tech.id) return techBallById[tech.id] || tech;
  return tech.path ? tech : null;
}

/**
 * @returns {Set<string>}
 */
export function readPhysicsSpawnProgress() {
  try {
    const raw = localStorage.getItem(PHYSICS_SPAWNS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const allowed = new Set(listPhysicsSpawnKeys());
    return new Set(parsed.filter((key) => allowed.has(key)));
  } catch {
    return new Set();
  }
}

/**
 * @param {Set<string> | string[]} keys
 */
export function writePhysicsSpawnProgress(keys) {
  try {
    const list = [...keys];
    localStorage.setItem(PHYSICS_SPAWNS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * @param {string} key
 * @returns {{ newlyMarked: boolean, complete: boolean, found: number, total: number }}
 */
export function markPhysicsSpawned(key) {
  const total = physicsSpawnCatalogSize();
  const allowed = new Set(listPhysicsSpawnKeys());
  if (!allowed.has(key)) {
    const found = readPhysicsSpawnProgress().size;
    return { newlyMarked: false, complete: found >= total, found, total };
  }

  const progress = readPhysicsSpawnProgress();
  const newlyMarked = !progress.has(key);
  if (newlyMarked) {
    progress.add(key);
    writePhysicsSpawnProgress(progress);
  }

  const found = progress.size;
  return {
    newlyMarked,
    complete: found >= total,
    found,
    total,
  };
}

export function clearPhysicsSpawnProgress() {
  try {
    localStorage.removeItem(PHYSICS_SPAWNS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Jobs for the collector effect — one spawn per catalog entry.
 * Callers supply live avatar / AI tool payloads (icons need runtime URLs).
 *
 * @param {{
 *   spawnFlag: (opts: { locale: string, label?: string }) => void,
 *   spawnAvatar: () => void,
 *   spawnTech: (ball: object, opts?: { scale?: number }) => void,
 *   spawnAi: (tool: object) => void,
 *   aiTools: object[],
 * }} api
 * @returns {Array<() => void>}
 */
export function buildPhysicsCatalogSpawnJobs(api) {
  const explore = physicsExploreTechIds();
  /** @type {Array<() => void>} */
  const jobs = [];

  for (const locale of localeList) {
    jobs.push(() =>
      api.spawnFlag({
        locale: locale.code,
        label: locale.nativeName,
      })
    );
  }

  jobs.push(() => api.spawnAvatar());

  const stackTechs = (profile.stackItems || []).flatMap((item) => item.techs || []);
  const exploreTechs = (profile.stackExplore || []).map((item) => item.mark);
  for (const id of [...new Set([...stackTechs, ...exploreTechs])]) {
    const ball = techBallById[id];
    if (!ball) continue;
    const scale = explore.has(id) ? 0.5 : 1;
    jobs.push(() => api.spawnTech(ball, { scale }));
  }

  for (const tool of api.aiTools || []) {
    jobs.push(() => api.spawnAi(tool));
  }

  return jobs;
}
