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

export const aiToolIcons = {
  cursor: { src: cursor, mono: true },
  claude: { src: claude, mono: false },
  codex: { src: codex, mono: false },
  claudecode: { src: claudeCode, mono: false },
};
