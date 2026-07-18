import profile from "../../shared/data/profile.js";
import { projectMarks } from "../../shared/data/project-marks.js";
import {
  buildProjectFacets,
  buildProjectSections,
  buildProjectSectionsByKind,
  filterProjects,
  projectFiltersActive,
} from "./filter.js";

function enrichProject(project, copy, groupCopy) {
  const groupId = project.group || "other";
  const groupMeta = groupCopy?.[groupId] || {};
  const kindMeta = copy.kindGroups?.[project.kind] || {};
  return {
    ...project,
    markKey: project.mark,
    blurb: copy.blurbs?.[project.id] || "",
    highlights: copy.highlights?.[project.id] || [],
    kindLabel:
      kindMeta.title || copy.kinds?.[project.kind] || project.kind,
    statusLabel: copy.status?.[project.status] || project.status,
    groupLabel: groupMeta.title || groupId,
    groupDescription: groupMeta.description || "",
    mark: projectMarks[project.mark] || projectMarks.steam,
  };
}

function resolveSectionChrome(section, meta, icons) {
  if (section.icon && icons?.[section.icon]) {
    return {
      markMode: "icon",
      markFill: "var(--accent)",
      markHtml: icons[section.icon],
      mark: null,
    };
  }

  const markKey = section.mark || section.projects[0]?.markKey;
  const mark = projectMarks[markKey] || projectMarks.steam;
  return {
    markMode: "brand",
    markFill: mark.fill,
    markHtml: "",
    mark,
  };
}

export function projectsViewMethods() {
  return {
    get projectCatalog() {
      const copy = this.t.projects || {};
      const groupCopy = copy.groups || {};
      return profile.projects
        .filter((project) => !project.hidden)
        .map((project) => enrichProject(project, copy, groupCopy));
    },

    get projectFilterState() {
      return {
        query: this.projectQuery,
        groupId: this.projectGroupFilter,
        kind: this.projectKindFilter,
      };
    },

    get projects() {
      return filterProjects(this.projectCatalog, this.projectFilterState);
    },

    get projectSections() {
      const filtered = this.projects;
      const byKind = this.projectGroupBy === "kind";
      const sections = byKind
        ? buildProjectSectionsByKind(filtered, profile.projectKinds)
        : buildProjectSections(filtered, profile.projectGroups);

      const copy = this.t.projects || {};
      const metaMap = byKind ? copy.kindGroups || {} : copy.groups || {};

      return sections.map((section) => {
        const meta = metaMap[section.id] || {};
        const chrome = resolveSectionChrome(section, meta, this.icons);
        return {
          ...section,
          title: meta.title || copy.kinds?.[section.id] || section.id,
          description: meta.description || "",
          markMode: chrome.markMode,
          markFill: chrome.markFill,
          markHtml: chrome.markHtml,
          mark: chrome.mark,
        };
      });
    },

    get projectFacets() {
      return buildProjectFacets(
        this.projectCatalog,
        this.projectFilterState,
        profile.projectGroups,
        profile.projectKinds
      );
    },

    get projectGroupByChips() {
      const copy = this.t.projects || {};
      return [
        {
          id: "kind",
          label: copy.groupByKind || "Type",
        },
        {
          id: "shelf",
          label: copy.groupByShelf || "Shelf",
        },
      ];
    },

    get projectGroupChips() {
      const copy = this.t.projects || {};
      const groupCopy = copy.groups || {};
      return this.projectFacets.groups.map((chip) => ({
        ...chip,
        label:
          chip.id === "all"
            ? copy.filtersAll || "All"
            : groupCopy[chip.id]?.title || chip.id,
      }));
    },

    get projectKindChips() {
      const copy = this.t.projects || {};
      const kindCopy = copy.kindGroups || {};
      return this.projectFacets.kinds.map((chip) => ({
        ...chip,
        label:
          chip.id === "all"
            ? copy.filtersAll || "All"
            : kindCopy[chip.id]?.title ||
              copy.kinds?.[chip.id] ||
              chip.id,
      }));
    },

    get projectResultCount() {
      return this.projects.length;
    },

    get projectResultLabel() {
      const copy = this.t.projects || {};
      const count = this.projectResultCount;
      const template =
        count === 1
          ? copy.resultsOne || copy.results || "{count}"
          : copy.results || "{count}";
      return template.replace("{count}", String(count));
    },

    get projectFiltersActive() {
      return projectFiltersActive(this.projectFilterState);
    },

    get projectsTitle() {
      return this.t.projects.title;
    },
  };
}
