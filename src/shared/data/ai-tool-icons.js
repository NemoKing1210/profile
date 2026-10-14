/**
 * AI brand marks from @lobehub/icons-static-svg (color variants where
 * available; mono icons are tinted white via CSS).
 * Pi / OMP / Command Code have no official mark in that set — they use simple
 * local glyphs in `./ai-icons/`.
 */
import cursor from "@lobehub/icons-static-svg/icons/cursor.svg?url";
import claude from "@lobehub/icons-static-svg/icons/claude-color.svg?url";
import codex from "@lobehub/icons-static-svg/icons/codex-color.svg?url";
import claudeCode from "@lobehub/icons-static-svg/icons/claudecode-color.svg?url";
import opencode from "@lobehub/icons-static-svg/icons/opencode.svg?url";
import geminiCli from "@lobehub/icons-static-svg/icons/geminicli-color.svg?url";
import hermes from "@lobehub/icons-static-svg/icons/nousresearch.svg?url";
import copilot from "@lobehub/icons-static-svg/icons/copilot-color.svg?url";
import windsurf from "@lobehub/icons-static-svg/icons/windsurf.svg?url";
import kiro from "@lobehub/icons-static-svg/icons/kiro-color.svg?url";
import antigravity from "@lobehub/icons-static-svg/icons/antigravity-color.svg?url";
import anthropic from "@lobehub/icons-static-svg/icons/anthropic.svg?url";
import pi from "./ai-icons/pi.svg?url";
import omp from "./ai-icons/omp.svg?url";
import commandCode from "./ai-icons/commandcode.svg?url";

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
  opencode: { src: opencode, mono: true, fill: "#1d2026" },
  omp: { src: omp, mono: true, fill: "#2a2114" },
  pi: { src: pi, mono: true, fill: "#1d2a22" },
  commandcode: { src: commandCode, mono: true, fill: "#2a1d33" },
  hermes: { src: hermes, mono: true, fill: "#1c2133" },
  geminicli: { src: geminiCli, mono: false, fill: "#1a2238" },
  copilot: { src: copilot, mono: false, fill: "#1a2230" },
  windsurf: { src: windsurf, mono: true, fill: "#10292b" },
  kiro: { src: kiro, mono: false, fill: "#251a3a" },
  antigravity: { src: antigravity, mono: false, fill: "#1b2238" },
};
