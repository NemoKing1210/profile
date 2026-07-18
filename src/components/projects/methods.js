export function projectsMethods() {
  return {
    setProjectGroupFilter(groupId) {
      this.projectGroupFilter = groupId || "all";
    },

    setProjectKindFilter(kind) {
      this.projectKindFilter = kind || "all";
    },

    setProjectGroupBy(mode) {
      this.projectGroupBy = mode === "shelf" ? "shelf" : "kind";
    },

    clearProjectFilters() {
      this.projectQuery = "";
      this.projectGroupFilter = "all";
      this.projectKindFilter = "all";
    },

    onProjectTagClick(tag) {
      const next = String(tag || "").trim();
      if (!next) return;
      this.projectQuery = next;
    },

    clearProjectQuery() {
      this.projectQuery = "";
    },
  };
}
