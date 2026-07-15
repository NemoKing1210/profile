import { aiToolIcons } from "../../shared/data/ai-tool-icons.js";
import profile from "../../shared/data/profile.js";
import { getAudiencePreset } from "../../shared/lib/audience.js";

export function aboutViewMethods() {
  return {
    get about() {
      const base = this.t.about || {};
      const audienceAbout = this.t.audiences?.[this.audience]?.about || {};
      const badgeSource =
        getAudiencePreset(this.audience)?.aboutBadges ||
        profile.aboutBadges ||
        [];
      const badgeLabels = {
        ...(base.badges || {}),
        ...(audienceAbout.badges || {}),
      };

      return {
        ...base,
        ...audienceAbout,
        badges: badgeSource.map((badge) => ({
          id: badge.id,
          tone: badge.tone || "muted",
          label: badgeLabels[badge.id] || badge.id,
          speechI18n: badge.speechI18n || null,
        })),
        activity: {
          ...(base.activity || {}),
          ...(audienceAbout.activity || {}),
        },
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
