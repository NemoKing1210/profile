import { aiToolIcons } from "../../shared/data/ai-tool-icons.js";
import profile from "../../shared/data/profile.js";

export function aboutViewMethods() {
  return {
    get about() {
      return {
        ...this.t.about,
        badges: (profile.aboutBadges || []).map((badge) => ({
          id: badge.id,
          tone: badge.tone || "muted",
          label: this.t.about.badges?.[badge.id] || badge.id,
        })),
      };
    },

    get aiTools() {
      return (profile.aiTools || []).map((tool) => {
        const icon = aiToolIcons[tool.id] || aiToolIcons.cursor;
        return {
          id: tool.id,
          label: tool.label,
          icon: icon.src,
          mono: icon.mono,
          fill: icon.fill || "#1a2332",
        };
      });
    },
  };
}
