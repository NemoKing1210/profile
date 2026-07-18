export function projectsState() {
  return {
    projectQuery: "",
    projectGroupFilter: "all",
    projectKindFilter: "all",
    /** "shelf" = platform groups; "kind" = userscript / desktop / website */
    projectGroupBy: "kind",
  };
}
