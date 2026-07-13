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
  siTypescript,
  siVite,
  siVuedotjs,
  siYii,
} from "simple-icons";

function ball(id, icon, label, fill) {
  return {
    id,
    label: label || icon.title,
    path: icon.path,
    /** Ball fill — brand hex, or override when brand is too dark. */
    fill: fill || `#${icon.hex}`,
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
