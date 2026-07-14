import profile from "../../shared/data/profile.js";
import { projectMarks } from "../../shared/data/project-marks.js";

export function projectsViewMethods() {
  return {
    get projects() {
      const copy = this.t.projects || {};
      return profile.projects.map((project) => ({
        ...project,
        blurb: copy.blurbs?.[project.id] || "",
        highlights: copy.highlights?.[project.id] || [],
        kindLabel: copy.kinds?.[project.kind] || project.kind,
        statusLabel: copy.status?.[project.status] || project.status,
        mark: projectMarks[project.mark] || projectMarks.steam,
        speechI18n: copy.speechTips?.[project.id]
          ? `projects.speechTips.${project.id}`
          : null,
      }));
    },

    get projectsTitle() {
      return this.t.projects.title;
    },
  };
}
