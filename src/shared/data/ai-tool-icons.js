/**
 * Official AI brand marks from @lobehub/icons-static-svg.
 * Color variants where available; mono icons use currentColor via CSS.
 */
import cursor from "@lobehub/icons-static-svg/icons/cursor.svg?url";
import claude from "@lobehub/icons-static-svg/icons/claude-color.svg?url";
import codex from "@lobehub/icons-static-svg/icons/codex-color.svg?url";
import claudeCode from "@lobehub/icons-static-svg/icons/claudecode-color.svg?url";
import anthropic from "@lobehub/icons-static-svg/icons/anthropic.svg?url";

export const aiKitMark = {
  src: anthropic,
  mono: true,
};

/** Brand fills for hero physics squares. */
export const aiToolIcons = {
  cursor: { src: cursor, mono: true, fill: "#1a2332" },
  claude: { src: claude, mono: false, fill: "#2a1f1c" },
  codex: { src: codex, mono: false, fill: "#1a1f3a" },
  claudecode: { src: claudeCode, mono: false, fill: "#2a1f1c" },
};
