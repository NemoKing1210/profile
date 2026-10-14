export function projectsState() {
  return {
    projectQuery: "",
    projectGroupFilter: "all",
    projectKindFilter: "all",
    /** "shelf" = platform groups; "kind" = userscript / desktop / website */
    projectGroupBy: "kind",
    projectFiltersOpen: false,
    /** Ids of project rows expanded to show details. */
    projectOpenIds: [],
  };
}
