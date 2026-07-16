/**
 * Brand marks for project capsules (simple-icons path + hex).
 */
import { siElectron, siGithub, siSteam, siYoutube } from "simple-icons";

function mark(icon, fill) {
  const resolved = fill || `#${icon.hex}`;
  return {
    path: icon.path,
    fill: resolved,
  };
}

/** Backloggd is not in simple-icons — compact “B” glyph (same as link-marks). */
const backloggdMark = {
  path: "M6 4.5h6.2c3.05 0 5.3 1.95 5.3 4.85 0 1.85-.95 3.35-2.55 4.1L18.2 19.5h-3.35l-2.85-5.35H9.1V19.5H6zm3.1 2.55v4.05h2.95c1.55 0 2.45-.85 2.45-2.05s-.9-2-2.45-2z",
  fill: "#7ec8ff",
};

export const projectMarks = {
  steam: mark(siSteam),
  youtube: mark(siYoutube),
  electron: mark(siElectron),
  backloggd: backloggdMark,
  /** Light fill so the mark reads on Steam-dark capsules (brand hex is near-black). */
  github: mark(siGithub, "#e6edf3"),
};
