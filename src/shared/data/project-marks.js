/**
 * Brand marks for project capsules (simple-icons path + hex).
 */
import { siElectron, siSteam, siYoutube } from "simple-icons";

function mark(icon, fill) {
  const resolved = fill || `#${icon.hex}`;
  return {
    path: icon.path,
    fill: resolved,
  };
}

export const projectMarks = {
  steam: mark(siSteam),
  youtube: mark(siYoutube),
  electron: mark(siElectron),
};
