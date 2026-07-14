const GLITCH = "░▒▓█▌▐╱╲|_-=+*~?#@";
const LOOKALIKES = {
  a: "а",
  e: "е",
  o: "о",
  p: "р",
  c: "с",
  x: "х",
  y: "у",
  A: "А",
  E: "Е",
  O: "О",
  P: "Р",
  C: "С",
  X: "Х",
  H: "Н",
  а: "a",
  е: "e",
  о: "0",
  р: "p",
  с: "c",
  х: "x",
  у: "y",
  и: "u",
  А: "A",
  Е: "E",
  О: "0",
  Р: "P",
  С: "C",
  Н: "H",
  0: "O",
  1: "l",
  3: "З",
  4: "A",
  5: "S",
  7: "T",
};

const VOID_SNIPPETS = [
  "NO EXIT",
  "LEVEL 0",
  "████",
  "гул",
  "…",
  "help",
  "where",
];

/**
 * Progressive Backrooms text decay for cloned echo trees.
 * `intensity` is 0…1 (eased), not a raw loop count.
 */
export function corruptEchoContent(root, intensity, options = {}) {
  if (!root || intensity < 0.02) return;

  const t = Math.min(1, Math.max(0, intensity));
  const nodes = collectTextNodes(root);
  if (!nodes.length) return;

  const budget =
    options.budget ??
    Math.max(
      2,
      Math.floor(nodes.length * (0.045 + t * 0.2)) + Math.ceil(t * 12)
    );

  let remaining = budget;
  const order = shuffled(nodes);

  for (const node of order) {
    if (remaining <= 0) break;
    const before = node.nodeValue;
    const next = mutateText(before, t, remaining);
    if (next === before) continue;
    const spent = countDiffs(before, next);
    node.nodeValue = next;
    remaining -= Math.max(1, spent);
  }

  // Void / replace whole words more often as depth climbs.
  const voidChance = 0.12 + t * 0.45;
  if (t >= 0.18 && Math.random() < voidChance) {
    voidAWord(nodes, t);
  }
  if (t >= 0.45 && Math.random() < voidChance * 0.7) {
    voidAWord(nodes, t);
  }
}

function collectTextNodes(root) {
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !/\S/.test(node.nodeValue)) {
        return NodeFilter.FILTER_REJECT;
      }
      const el = node.parentElement;
      if (!el) return NodeFilter.FILTER_REJECT;
      if (el.closest("svg, script, style, noscript")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    out.push(current);
    current = walker.nextNode();
  }
  return out;
}

function mutateText(text, t, budget) {
  const chars = [...text];
  const maxSwaps = Math.min(
    budget,
    Math.max(1, Math.ceil(chars.length * (0.035 + t * 0.22)))
  );
  let swaps = 0;

  // Early intensity prefers lookalikes; glyphs dominate later.
  const lookalikeChance = 0.55 - t * 0.35;
  const caseChance = t >= 0.2 ? 0.18 + t * 0.12 : 0.08;

  for (let attempt = 0; attempt < maxSwaps * 4 && swaps < maxSwaps; attempt += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    const ch = chars[idx];
    if (/\s/.test(ch)) continue;

    const roll = Math.random();
    if (roll < lookalikeChance && LOOKALIKES[ch]) {
      chars[idx] = LOOKALIKES[ch];
    } else if (roll < lookalikeChance + caseChance && /[A-Za-zА-Яа-яЁё]/.test(ch)) {
      chars[idx] = Math.random() < 0.5 ? ch.toUpperCase() : ch.toLowerCase();
    } else {
      chars[idx] = GLITCH[Math.floor(Math.random() * GLITCH.length)];
    }
    swaps += 1;
  }

  // Local scramble kicks in earlier and more often.
  if (t >= 0.22 && chars.length > 4 && Math.random() < 0.2 + t * 0.45) {
    const start = Math.floor(Math.random() * (chars.length - 3));
    const end = Math.min(chars.length, start + 2 + Math.floor(Math.random() * 4));
    const slice = chars.slice(start, end);
    for (let i = slice.length - 1; i > 0; i -= 1) {
      if (/\s/.test(slice[i]) || /\s/.test(slice[i - 1])) continue;
      const j = Math.floor(Math.random() * (i + 1));
      [slice[i], slice[j]] = [slice[j], slice[i]];
    }
    chars.splice(start, end - start, ...slice);
  }

  return chars.join("");
}

function voidAWord(nodes, t) {
  const candidates = nodes.filter((n) => n.nodeValue && n.nodeValue.trim().length > 3);
  if (!candidates.length) return;
  const node = candidates[Math.floor(Math.random() * candidates.length)];
  const parts = node.nodeValue.split(/(\s+)/);
  const wordIdxs = parts
    .map((part, i) => (/^\S{3,}$/.test(part) ? i : -1))
    .filter((i) => i >= 0);
  if (!wordIdxs.length) return;
  const idx = wordIdxs[Math.floor(Math.random() * wordIdxs.length)];
  const snippet =
    VOID_SNIPPETS[Math.floor(Math.random() * VOID_SNIPPETS.length)];
  parts[idx] =
    Math.random() < 0.35 + t * 0.4
      ? snippet
      : "█".repeat(Math.min(10, parts[idx].length));
  node.nodeValue = parts.join("");
}

function countDiffs(a, b) {
  const aa = [...a];
  const bb = [...b];
  const len = Math.max(aa.length, bb.length);
  let n = 0;
  for (let i = 0; i < len; i += 1) {
    if (aa[i] !== bb[i]) n += 1;
  }
  return n;
}

function shuffled(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
