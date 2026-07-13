/** Minecraft pickaxe easter egg — break UI blocks after activating from the cover. */

const HITS_TO_BREAK = 10;
const STAGE_ATTR = "data-mc-stage";
const MINE_TICK_MS = 85;
const BLOCKED =
  ".mc-pickaxe, .mc-mine-toast, .mc-crack, .skip-link, [data-mc-immune], script, style, noscript";

const PREFERRED =
  ".media-cover, .interest-chip, .interest-badge, .btn, .capsule, .meta-chip, .lang-option, .nav-link, .game-card, .project-card, .link-card, .hub-platform, .steam-comment, .ai-tool, .stack-card, .stack-flip, .stack-grow, .stack-grow__tag, .about-activity, .media-shelf, .steam-invite, .panel, .hero__identity, .hero__banner, .topbar, .footer, .brand, .interest-intro";

const DIRT = ["#6b5537", "#8a7148", "#5a4630", "#a08050", "#3d2f1f", "#7a6340"];

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/images/easter/`;
const PICKAXE_SRC = `${ASSET_BASE}diamond-pickaxe.png`;
const DESTROY_SRC = (stage) => `${ASSET_BASE}destroy/destroy_stage_${stage}.png`;

export const minecraftMineState = () => ({
  mineMode: false,
  _mcPickaxeEl: null,
  _mcToastEl: null,
  _mcSwingTimer: null,
  _mcToastTimer: null,
  _mcMineTimer: null,
  _mcMiningBlock: null,
  _mcOnMove: null,
  _mcOnDown: null,
  _mcOnUp: null,
  _mcOnClick: null,
  _mcOnKey: null,
  _mcBroken: new WeakSet(),
});

export const minecraftMineMethods = () => ({
  onMinecraftCoverClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.mineMode) {
      this.exitMineMode();
      return;
    }
    this.enterMineMode(event);
  },

  enterMineMode(event) {
    if (this.mineMode) return;
    this.mineMode = true;
    document.documentElement.classList.add("mc-mine-mode");
    this._ensurePickaxe();
    if (event && Number.isFinite(event.clientX)) {
      this._mcPickaxeEl.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }
    this._showMineToast();
    this._bindMineListeners();
  },

  exitMineMode() {
    if (!this.mineMode) return;
    this.mineMode = false;
    document.documentElement.classList.remove("mc-mine-mode");
    this._stopMining();
    this._unbindMineListeners();
    this._teardownPickaxe();
    this._hideMineToast();
  },

  _ensurePickaxe() {
    if (this._mcPickaxeEl) return;
    const el = document.createElement("div");
    el.className = "mc-pickaxe";
    el.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.className = "mc-pickaxe__img";
    img.src = PICKAXE_SRC;
    img.alt = "";
    img.draggable = false;
    img.width = 48;
    img.height = 48;
    el.appendChild(img);
    document.body.appendChild(el);
    this._mcPickaxeEl = el;
  },

  _teardownPickaxe() {
    if (this._mcSwingTimer != null) {
      window.clearTimeout(this._mcSwingTimer);
      this._mcSwingTimer = null;
    }
    this._mcPickaxeEl?.remove();
    this._mcPickaxeEl = null;
  },

  _showMineToast() {
    this._hideMineToast();
    const text = this.t.ui?.mineToast || "";
    if (!text) return;

    const el = document.createElement("div");
    el.className = "mc-mine-toast";
    el.setAttribute("role", "status");
    el.textContent = text;
    document.body.appendChild(el);
    this._mcToastEl = el;

    requestAnimationFrame(() => el.classList.add("is-visible"));
    this._mcToastTimer = window.setTimeout(() => this._hideMineToast(), 4500);
  },

  _hideMineToast() {
    if (this._mcToastTimer != null) {
      window.clearTimeout(this._mcToastTimer);
      this._mcToastTimer = null;
    }
    const el = this._mcToastEl;
    this._mcToastEl = null;
    if (!el) return;
    el.classList.remove("is-visible");
    window.setTimeout(() => el.remove(), 280);
  },

  _bindMineListeners() {
    this._unbindMineListeners();

    this._mcOnMove = (event) => {
      const pick = this._mcPickaxeEl;
      if (!pick) return;
      pick.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

      if (this._mcMiningBlock && event.buttons === 1) {
        const under = document.elementFromPoint(event.clientX, event.clientY);
        const next = under ? resolveBlock(under) : null;
        if (next !== this._mcMiningBlock) {
          this._startMining(next, event.clientX, event.clientY);
        }
      }
    };

    this._mcOnDown = (event) => {
      if (!this.mineMode || event.button !== 0) return;
      if (event.target.closest?.("[data-mc-activate]")) return;

      event.preventDefault();
      const block = resolveBlock(event.target);
      this._startMining(block, event.clientX, event.clientY);
    };

    this._mcOnUp = () => {
      this._stopMining();
    };

    this._mcOnClick = (event) => {
      if (!this.mineMode || event.button !== 0) return;
      if (event.target.closest?.("[data-mc-activate]")) return;
      event.preventDefault();
      event.stopPropagation();
    };

    this._mcOnKey = (event) => {
      if (event.key === "Escape") this.exitMineMode();
    };

    window.addEventListener("pointermove", this._mcOnMove, { passive: true });
    window.addEventListener("pointerdown", this._mcOnDown, true);
    window.addEventListener("pointerup", this._mcOnUp, true);
    window.addEventListener("pointercancel", this._mcOnUp, true);
    window.addEventListener("click", this._mcOnClick, true);
    window.addEventListener("keydown", this._mcOnKey);
  },

  _unbindMineListeners() {
    if (this._mcOnMove) {
      window.removeEventListener("pointermove", this._mcOnMove);
      this._mcOnMove = null;
    }
    if (this._mcOnDown) {
      window.removeEventListener("pointerdown", this._mcOnDown, true);
      this._mcOnDown = null;
    }
    if (this._mcOnUp) {
      window.removeEventListener("pointerup", this._mcOnUp, true);
      window.removeEventListener("pointercancel", this._mcOnUp, true);
      this._mcOnUp = null;
    }
    if (this._mcOnClick) {
      window.removeEventListener("click", this._mcOnClick, true);
      this._mcOnClick = null;
    }
    if (this._mcOnKey) {
      window.removeEventListener("keydown", this._mcOnKey);
      this._mcOnKey = null;
    }
  },

  _startMining(block, clientX, clientY) {
    this._stopMining();
    if (!block || this._mcBroken.has(block) || block.classList.contains("mc-mined")) {
      return;
    }

    this._mcMiningBlock = block;
    this._swingPickaxe();
    this._hitBlock(block, clientX, clientY);

    this._mcMineTimer = window.setInterval(() => {
      if (!this._mcMiningBlock) return;
      this._swingPickaxe();
      const rect = this._mcMiningBlock.getBoundingClientRect();
      this._hitBlock(
        this._mcMiningBlock,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }, MINE_TICK_MS);
  },

  _stopMining() {
    if (this._mcMineTimer != null) {
      window.clearInterval(this._mcMineTimer);
      this._mcMineTimer = null;
    }
    this._mcMiningBlock = null;
  },

  _swingPickaxe() {
    const pick = this._mcPickaxeEl;
    if (!pick) return;
    pick.classList.remove("is-swinging");
    void pick.offsetWidth;
    pick.classList.add("is-swinging");
    if (this._mcSwingTimer != null) window.clearTimeout(this._mcSwingTimer);
    this._mcSwingTimer = window.setTimeout(() => {
      pick.classList.remove("is-swinging");
      this._mcSwingTimer = null;
    }, 160);
  },

  _hitBlock(block, clientX, clientY) {
    if (this._mcBroken.has(block) || block.classList.contains("mc-mined")) {
      this._stopMining();
      return;
    }

    const stage = Number(block.getAttribute(STAGE_ATTR) || 0) + 1;
    applyCrackStage(block, stage);
    block.classList.remove("mc-hit");
    void block.offsetWidth;
    block.classList.add("mc-hit");

    spawnDigParticles(block, clientX, clientY);

    if (stage >= HITS_TO_BREAK) {
      this._stopMining();
      this._breakBlock(block);
    }
  },

  _breakBlock(block) {
    this._mcBroken.add(block);
    block.classList.remove("mc-cracking", "mc-hit");
    block.removeAttribute(STAGE_ATTR);
    block.querySelector(":scope > .mc-crack")?.remove();
    block.classList.add("mc-mined");

    const rect = block.getBoundingClientRect();
    spawnDebris(block, rect);

    const finish = () => {
      block.style.display = "none";
      block.setAttribute("aria-hidden", "true");
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    window.setTimeout(finish, 420);
  },

  destroyMinecraftMine() {
    this.exitMineMode();
  },
});

function applyCrackStage(block, stage) {
  block.classList.add("mc-cracking");
  block.setAttribute(STAGE_ATTR, String(stage));

  let crack = block.querySelector(":scope > .mc-crack");
  if (!crack) {
    crack = document.createElement("div");
    crack.className = "mc-crack";
    crack.setAttribute("aria-hidden", "true");
    block.appendChild(crack);
  }

  const texture = Math.min(9, Math.max(0, stage - 1));
  const mask = `url("${DESTROY_SRC(texture)}")`;
  crack.style.setProperty("--mc-crack-mask", mask);
  crack.dataset.stage = String(texture);
}

function resolveBlock(start) {
  if (!(start instanceof Element)) return null;
  if (start.closest(BLOCKED)) return null;

  const preferred = start.closest(PREFERRED);
  if (
    preferred &&
    !preferred.classList.contains("mc-mined") &&
    preferred.getAttribute("data-mc-activate") == null
  ) {
    return preferred;
  }

  let node = start;
  while (node && node !== document.body) {
    if (node.matches?.(BLOCKED)) return null;
    if (node.classList?.contains("mc-mined")) return null;

    if (
      node instanceof HTMLElement &&
      !node.matches(
        "main, body, html, .store-shell, [data-infinite-source], .infinite-echoes, .infinite-sentinel"
      )
    ) {
      const rect = node.getBoundingClientRect();
      const area = rect.width * rect.height;
      const viewport = window.innerWidth * window.innerHeight;
      if (
        rect.width >= 36 &&
        rect.height >= 20 &&
        area > 0 &&
        area < viewport * 0.72
      ) {
        return node;
      }
    }
    node = node.parentElement;
  }
  return null;
}

function sampleBlockColors(block) {
  const style = window.getComputedStyle(block);
  const colors = [];
  for (const prop of ["backgroundColor", "borderColor", "color"]) {
    const c = style[prop];
    if (c && c !== "transparent" && !c.includes("rgba(0, 0, 0, 0)")) {
      colors.push(rgbToHex(c) || c);
    }
  }
  return colors.length ? colors : DIRT;
}

function rgbToHex(rgb) {
  const m = String(rgb).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return `#${[m[1], m[2], m[3]]
    .map((n) => Number(n).toString(16).padStart(2, "0"))
    .join("")}`;
}

function spawnDigParticles(block, x, y) {
  if (prefersReducedMotion()) return;
  const colors = sampleBlockColors(block);
  const root = document.createElement("div");
  root.className = "mc-sparks";
  root.style.left = `${x}px`;
  root.style.top = `${y}px`;
  root.setAttribute("aria-hidden", "true");

  for (let i = 0; i < 5; i += 1) {
    const speck = document.createElement("span");
    speck.className = "mc-sparks__bit";
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    const dist = 8 + Math.random() * 16;
    const size = 3 + Math.floor(Math.random() * 4);
    speck.style.width = `${size}px`;
    speck.style.height = `${size}px`;
    speck.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    speck.style.setProperty("--dy", `${Math.sin(angle) * dist + 10}px`);
    speck.style.background = colors[i % colors.length];
    root.appendChild(speck);
  }

  document.body.appendChild(root);
  window.setTimeout(() => root.remove(), 380);
}

function spawnDebris(block, rect) {
  if (prefersReducedMotion()) return;
  const colors = sampleBlockColors(block);
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = Math.min(28, Math.max(12, Math.floor((rect.width * rect.height) / 7000)));

  const root = document.createElement("div");
  root.className = "mc-debris";
  root.style.left = `${cx}px`;
  root.style.top = `${cy}px`;
  root.setAttribute("aria-hidden", "true");

  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("span");
    bit.className = "mc-debris__bit";
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * Math.min(100, Math.max(rect.width, rect.height) * 0.4);
    const size = 4 + Math.floor(Math.random() * 7);
    bit.style.width = `${size}px`;
    bit.style.height = `${size}px`;
    bit.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    bit.style.setProperty("--dy", `${Math.sin(angle) * dist * 0.55}px`);
    bit.style.setProperty("--rot", `${Math.floor(Math.random() * 4) * 90}deg`);
    bit.style.background = colors[i % colors.length];
    root.appendChild(bit);
  }

  document.body.appendChild(root);
  window.setTimeout(() => root.remove(), 800);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
