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

    toggleProjectFilters() {
      this.projectFiltersOpen = !this.projectFiltersOpen;
    },

    toggleProject(id) {
      this.projectOpenIds = this.projectOpenIds.includes(id)
        ? this.projectOpenIds.filter((openId) => openId !== id)
        : [...this.projectOpenIds, id];
    },

    isProjectOpen(id) {
      return this.projectOpenIds.includes(id);
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
