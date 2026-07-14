/**
 * Brand marks for Links hub pills + direct link rows (simple-icons path + hex).
 */
import {
  siDiscord,
  siFacebook,
  siGithub,
  siLetterboxd,
  siLinktree,
  siNotion,
  siOrcid,
  siSteam,
  siTelegram,
  siWhatsapp,
} from "simple-icons";

function mark(icon, fill) {
  const resolved = fill || `#${icon.hex}`;
  return {
    path: icon.path,
    fill: resolved,
  };
}

/** Envelope mark (Heroicons solid) — no generic email brand in simple-icons. */
const emailMark = {
  path: "M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67ZM22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z",
  fill: "#66c0f4",
};

/** Backloggd is not in simple-icons — compact “B” glyph. */
const backloggdMark = {
  path: "M6 4.5h6.2c3.05 0 5.3 1.95 5.3 4.85 0 1.85-.95 3.35-2.55 4.1L18.2 19.5h-3.35l-2.85-5.35H9.1V19.5H6zm3.1 2.55v4.05h2.95c1.55 0 2.45-.85 2.45-2.05s-.9-2-2.45-2z",
  fill: "#7ec8ff",
};

export const linkMarks = {
  github: mark(siGithub),
  linktree: mark(siLinktree),
  letterboxd: mark(siLetterboxd),
  orcid: mark(siOrcid),
  telegram: mark(siTelegram),
  discord: mark(siDiscord),
  whatsapp: mark(siWhatsapp),
  facebook: mark(siFacebook),
  steam: mark(siSteam),
  notion: mark(siNotion, "#c7d5e0"),
  email: emailMark,
  backloggd: backloggdMark,
};
