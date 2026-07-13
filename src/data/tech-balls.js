/**
 * Tech / language balls for the hero physics layer.
 * Icons from simple-icons (path + brand hex).
 */
import {
  siAlpinedotjs,
  siCss,
  siDotnet,
  siHtml5,
  siJavascript,
  siLaravel,
  siLua,
  siNodedotjs,
  siNuxt,
  siPhp,
  siReact,
  siTypescript,
  siVite,
  siVuedotjs,
  siYii,
} from "simple-icons";

function ball(id, icon, label, fill) {
  const resolvedFill = fill || `#${icon.hex}`;
  const r = parseInt(resolvedFill.slice(1, 3), 16) / 255;
  const g = parseInt(resolvedFill.slice(3, 5), 16) / 255;
  const b = parseInt(resolvedFill.slice(5, 7), 16) / 255;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return {
    id,
    label: label || icon.title,
    path: icon.path,
    /** Ball fill — brand hex, or override when brand is too dark. */
    fill: resolvedFill,
    ink: luma > 0.55 ? "#1b2838" : "#ffffff",
  };
}

/** Ordered set shown in the hero (subset on narrow viewports). */
export const techBalls = [
  ball("vue", siVuedotjs),
  ball("nuxt", siNuxt),
  ball("js", siJavascript, "JavaScript"),
  ball("ts", siTypescript),
  ball("html", siHtml5),
  ball("css", siCss),
  ball("node", siNodedotjs),
  ball("php", siPhp),
  ball("laravel", siLaravel),
  ball("yii", siYii, "Yii2"),
  ball("lua", siLua, "Lua", "#3c6eb4"),
  ball("csharp", siDotnet, "C#"),
  ball("vite", siVite),
  ball("alpine", siAlpinedotjs),
];

/** Extra marks (not in hero spawn set) for stack UI. */
const stackOnlyBalls = [ball("react", siReact)];

/** Lookup by id for stack chip spawns. */
export const techBallById = Object.fromEntries(
  [...techBalls, ...stackOnlyBalls].map((item) => [item.id, item])
);
