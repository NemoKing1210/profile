/** Normalize search query for case-insensitive substring match. */
export function normalizeProjectQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function haystackIncludes(haystack, needle) {
  return haystack.includes(needle);
}

/** Build searchable text from an enriched project. */
export function projectSearchText(project) {
  const parts = [
    project.title,
    project.kindLabel,
    project.groupLabel,
    project.statusLabel,
    ...(project.tags || []),
    project.blurb,
    ...(project.highlights || []),
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function projectMatchesQuery(project, query) {
  const needle = normalizeProjectQuery(query);
  if (!needle) return true;
  return haystackIncludes(projectSearchText(project), needle);
}

/**
 * @param {object[]} projects - enriched visible projects
 * @param {{ query?: string, groupId?: string, kind?: string }} filters
 */
export function filterProjects(projects, { query, groupId, kind } = {}) {
  const groupFilter = groupId && groupId !== "all" ? groupId : null;
  const kindFilter = kind && kind !== "all" ? kind : null;

  return projects.filter((project) => {
    if (groupFilter && project.group !== groupFilter) return false;
    if (kindFilter && project.kind !== kindFilter) return false;
    return projectMatchesQuery(project, query);
  });
}

/**
 * Build ordered shelf sections from filtered projects by platform group.
 * Empty groups are omitted. Unknown group ids fall into a trailing bucket.
 *
 * @param {object[]} projects
 * @param {object[]} groupDefs - profile.projectGroups
 */
export function buildProjectSections(projects, groupDefs) {
  return buildOrderedSections(projects, groupDefs, (project) => project.group || "other");
}

/**
 * Build ordered sections by project kind (userscript / desktop / website).
 *
 * @param {object[]} projects
 * @param {object[]} kindDefs - profile.projectKinds
 */
export function buildProjectSectionsByKind(projects, kindDefs) {
  return buildOrderedSections(projects, kindDefs, (project) => project.kind || "other");
}

function buildOrderedSections(projects, defs, keyFn) {
  const byKey = new Map();
  for (const project of projects) {
    const key = keyFn(project);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(project);
  }

  const sections = [];
  const seen = new Set();

  for (const def of defs || []) {
    const items = byKey.get(def.id);
    if (!items?.length) continue;
    seen.add(def.id);
    sections.push({
      id: def.id,
      mark: def.mark || null,
      icon: def.icon || null,
      tone: def.tone || def.id,
      projects: items,
      count: items.length,
    });
  }

  for (const [id, items] of byKey) {
    if (seen.has(id) || !items.length) continue;
    sections.push({
      id,
      mark: items[0]?.markKey || null,
      icon: null,
      tone: items[0]?.tone || id,
      projects: items,
      count: items.length,
    });
  }

  return sections;
}

/**
 * Facet chips with counts under the *other* active filters.
 *
 * @param {object[]} projects - full enriched catalog (visible)
 * @param {{ query?: string, groupId?: string, kind?: string }} filters
 * @param {object[]} groupDefs
 * @param {object[]} kindDefs
 */
export function buildProjectFacets(projects, filters, groupDefs, kindDefs) {
  const { query, groupId, kind } = filters || {};

  const forGroups = filterProjects(projects, {
    query,
    kind,
    groupId: "all",
  });
  const groupCounts = new Map();
  for (const project of forGroups) {
    const key = project.group || "other";
    groupCounts.set(key, (groupCounts.get(key) || 0) + 1);
  }

  const groups = [
    {
      id: "all",
      count: forGroups.length,
    },
    ...(groupDefs || [])
      .map((def) => ({
        id: def.id,
        count: groupCounts.get(def.id) || 0,
      }))
      .filter((chip) => chip.count > 0 || chip.id === groupId),
  ];

  const forKinds = filterProjects(projects, {
    query,
    groupId,
    kind: "all",
  });
  const kindCounts = new Map();
  for (const project of forKinds) {
    kindCounts.set(project.kind, (kindCounts.get(project.kind) || 0) + 1);
  }

  const kinds = [
    {
      id: "all",
      count: forKinds.length,
    },
    ...(kindDefs || [])
      .map((def) => ({
        id: def.id,
        count: kindCounts.get(def.id) || 0,
      }))
      .filter((chip) => chip.count > 0 || chip.id === kind),
    ...[...kindCounts.entries()]
      .filter(([id]) => !(kindDefs || []).some((def) => def.id === id))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, count]) => ({ id, count }))
      .filter((chip) => chip.count > 0 || chip.id === kind),
  ];

  return { groups, kinds };
}

export function projectFiltersActive({ query, groupId, kind } = {}) {
  return Boolean(
    normalizeProjectQuery(query) ||
      (groupId && groupId !== "all") ||
      (kind && kind !== "all")
  );
}
