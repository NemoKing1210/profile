import { aiKitMark } from "../../shared/data/ai-tool-icons.js";
import profile from "../../shared/data/profile.js";
import { techBallById } from "../../shared/data/tech-balls.js";

export function stackViewMethods() {
  return {
    get stack() {
      const copy = this.t.stack;
      const byId = Object.fromEntries(
        (copy.items || []).map((item) => [item.id, item])
      );
      const flip = copy.favoriteFlip || {};
      const reactMark = techBallById.react || { path: "", fill: "#61dafb" };
      const vueMark = techBallById.vue || { path: "", fill: "#42b883" };

      return {
        title: copy.title,
        eyebrow: copy.eyebrow,
        techsLabel: copy.techsLabel,
        spawnTech: copy.spawnTech,
        toolkitLabel: copy.toolkitLabel,
        toolkitBlurb: copy.toolkitBlurb,
        spawnTool: copy.spawnTool,
        kitMark: aiKitMark,
        tools: this.aiTools,
        growLabel: copy.growLabel,
        growBlurb: copy.growBlurb,
        growTagsLabel: copy.growTagsLabel,
        growTags: copy.growTags || [],
        favoriteFlip: {
          ariaLabel: flip.ariaLabel || "",
          front: {
            badge: flip.frontBadge || "",
            label: flip.frontLabel || "React",
            detail: flip.frontDetail || "",
            mark: reactMark,
          },
          back: {
            badge: flip.backBadge || "",
            label: flip.backLabel || "Vue",
            detail: flip.backDetail || "",
            mark: vueMark,
          },
        },
        items: (profile.stackItems || []).map((item) => {
          const local = byId[item.id] || {};
          const techs = (item.techs || [])
            .map((id) => techBallById[id])
            .filter(Boolean);
          const mark = techBallById[item.mark] || techs[0];
          return {
            id: item.id,
            tone: item.tone || "accent",
            label: local.label || item.id,
            detail: local.detail || "",
            mark: mark || { path: "", fill: "#66c0f4" },
            techs,
          };
        }),
      };
    },

    spawnTechLabel(tech) {
      return (this.t.stack.spawnTech || "{name}").replace("{name}", tech.label);
    },

    spawnToolLabel(tool) {
      return (this.t.stack.spawnTool || "{name}").replace("{name}", tool.label);
    },
  };
}
