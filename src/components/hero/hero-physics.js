import Matter from "matter-js";
import { localeFlagDataUrl } from "../../shared/data/locale-flags.js";
import { techBalls } from "../../shared/data/tech-balls.js";

const {
  Engine,
  World,
  Bodies,
  Body,
  Mouse,
  MouseConstraint,
  Runner,
  Events,
  Sleeping,
} = Matter;

const WALL = 80;
const RESTITUTION = 0.78;
const FRICTION = 0.05;
const FRICTION_AIR = 0.01;
const AI_DENSITY = 0.0022;
const MAX_AI_SQUARES = 16;
const MAX_AVATAR_SQUARES = 8;
const MAX_FLAG_SQUARES = 12;
const AVATAR_SIZE_GROWTH = 1.5;
const AVATAR_BASE_DENSITY = AI_DENSITY * 2.5;
const MAX_BALLS = 28;
/** Scroll px РІвЂ вЂ™ Matter velocity scale (down scroll pushes bodies down). */
const SCROLL_IMPULSE = 0.055;
const SCROLL_MAX_VY = 14;
const SCROLL_JUMP_PX = 240;
const SCROLL_MIN_DELTA = 0.8;
const SCROLL_SPIN = 0.018;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function iconMarkup(ball) {
  return `<svg class="hero-ball__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${ball.path}"/></svg>`;
}

function relativeLuminance(hex) {
  const raw = hex.replace("#", "");
  const n =
    raw.length === 3
      ? raw.split("").map((c) => parseInt(c + c, 16))
      : [
          parseInt(raw.slice(0, 2), 16),
          parseInt(raw.slice(2, 4), 16),
          parseInt(raw.slice(4, 6), 16),
        ];
  const [r, g, b] = n.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function createBallEl(ball, radius) {
  const el = document.createElement("div");
  el.className = "hero-ball";
  el.style.width = `${radius * 2}px`;
  el.style.height = `${radius * 2}px`;
  el.style.setProperty("--ball-fill", ball.fill);
  el.style.color =
    relativeLuminance(ball.fill) > 0.55 ? "#1b2838" : "#ffffff";
  el.innerHTML = iconMarkup(ball);
  el.title = ball.label;
  el.setAttribute("aria-hidden", "true");
  return el;
}

function createAiSquareEl(tool, size) {
  const el = document.createElement("div");
  el.className = "hero-ai";
  if (tool.mono) el.classList.add("hero-ai--mono");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.setProperty("--ai-fill", tool.fill || "#1a2332");
  el.innerHTML = `<img class="hero-ai__img" src="${tool.icon}" alt="" width="48" height="48" decoding="async" draggable="false" />`;
  el.title = tool.label;
  el.setAttribute("aria-hidden", "true");
  el.dataset.tool = tool.id;
  return el;
}

function createAvatarSquareEl(src, size, label) {
  const el = document.createElement("div");
  el.className = "hero-ai hero-ai--avatar";
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.innerHTML = `<img class="hero-ai__img hero-ai__img--avatar" src="${src}" alt="" width="128" height="128" decoding="async" draggable="false" />`;
  if (label) el.title = label;
  el.setAttribute("aria-hidden", "true");
  el.dataset.avatar = "1";
  return el;
}

function createFlagSquareEl(locale, size, label) {
  const el = document.createElement("div");
  el.className = "hero-ai hero-flag";
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.innerHTML = `<img class="hero-flag__img" src="${localeFlagDataUrl(locale)}" alt="" width="128" height="128" decoding="async" draggable="false" />`;
  if (label) el.title = label;
  el.setAttribute("aria-hidden", "true");
  el.dataset.flag = locale;
  return el;
}

function syncActorEl(el, body, half) {
  const { x, y } = body.position;
  el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0) rotate(${body.angle}rad)`;
}

function makeWalls(width, height) {
  const opts = { isStatic: true, render: { visible: false } };
  return [
    Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, opts),
    Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 2, opts),
    Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 2, opts),
  ];
}

function placeStatic(container, items, radius) {
  const { width, height } = container.getBoundingClientRect();
  const cols = Math.max(3, Math.floor(width / (radius * 2.6)));
  items.forEach((ball, i) => {
    const el = createBallEl(ball, radius);
    el.classList.add("hero-ball--static");
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = radius + 12 + col * (radius * 2.4) + (row % 2) * radius * 0.4;
    const y = height - radius - 16 - row * (radius * 2.2);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    container.appendChild(el);
  });
}

/**
 * Interactive physics layer in the hero.
 * @param {HTMLElement} container
 * @param {{ onInteract?: () => void }} [options]
 * @returns {{
 *   spawnAiSquare: (tool: object) => void,
 *   spawnTechBall: (ball: object, opts?: { scale?: number }) => void,
 *   spawnAvatarSquare: (opts: { src: string, label?: string }) => void,
 *   spawnFlagSquare: (opts: { locale: string, label?: string }) => void,
 *   destroy: () => void
 * }}
 */
export function initHeroPhysics(container, options = {}) {
  const noop = {
    spawnAiSquare() {},
    spawnTechBall() {},
    spawnAvatarSquare() {},
    spawnFlagSquare() {},
    destroy() {},
  };

  if (!container) return noop;

  const notifyInteract = () => {
    try {
      options.onInteract?.();
    } catch {
      /* ignore consumer errors */
    }
  };

  container.replaceChildren();
  container.classList.add("is-ready");

  const measure = () => {
    const rect = container.getBoundingClientRect();
    return {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height)),
    };
  };

  let { width, height } = measure();
  const narrow = width < 640;
  const radius = narrow ? 24 : 64;
  const aiSize = narrow ? 56 : 112;
  const baseAvatarSize = aiSize * 2;
  let avatarGeneration = 0;
  const items = techBalls.slice(0, narrow ? 9 : techBalls.length);

  /** @type {{ body?: import("matter-js").Body, el: HTMLElement, half: number, kind: string }[]} */
  const actors = [];
  /** @type {number[]} */
  const spawnTimers = [];

  const nextAvatarStats = () => {
    const scale = AVATAR_SIZE_GROWTH ** avatarGeneration;
    avatarGeneration += 1;
    return {
      size: baseAvatarSize * scale,
      density: AVATAR_BASE_DENSITY * scale,
    };
  };

  const placeStaticAi = (tool) => {
    const el = createAiSquareEl(tool, aiSize);
    el.classList.add("hero-ai--static");
    const half = aiSize / 2;
    const x = width * 0.55 + Math.random() * Math.max(20, width * 0.35 - aiSize);
    const y = height - aiSize - 20 - Math.random() * 40;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    container.appendChild(el);
    actors.push({ el, half, kind: "ai" });
  };

  const placeStaticAvatar = ({ src, label }) => {
    const { size } = nextAvatarStats();
    const el = createAvatarSquareEl(src, size, label);
    el.classList.add("hero-ai--static");
    const half = size / 2;
    const x = width * 0.4 + Math.random() * Math.max(20, width * 0.4 - size);
    const y = height - size - 16 - Math.random() * 24;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    container.appendChild(el);
    actors.push({ el, half, kind: "avatar" });
  };

  const placeStaticFlag = ({ locale, label }) => {
    const el = createFlagSquareEl(locale, aiSize, label);
    el.classList.add("hero-ai--static");
    const half = aiSize / 2;
    const x = width * 0.5 + Math.random() * Math.max(20, width * 0.35 - aiSize);
    const y = height - aiSize - 20 - Math.random() * 40;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    container.appendChild(el);
    actors.push({ el, half, kind: "flag" });
  };

  if (prefersReducedMotion()) {
    const onStaticPointer = () => notifyInteract();
    container.addEventListener("pointerdown", onStaticPointer);

    placeStatic(container, items, radius);
    return {
      spawnAiSquare(tool) {
        if (!tool?.icon) return;
        placeStaticAi(tool);
      },
      spawnTechBall(ball, { scale = 1 } = {}) {
        if (!ball?.path) return;
        const r = radius * scale;
        const el = createBallEl(ball, r);
        el.classList.add("hero-ball--static");
        const x =
          width * 0.45 + Math.random() * Math.max(20, width * 0.4 - r * 2);
        const y = height - r * 2 - 20 - Math.random() * 36;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        container.appendChild(el);
        actors.push({ el, half: r, kind: "ball" });
      },
      spawnAvatarSquare(opts) {
        if (!opts?.src) return;
        placeStaticAvatar(opts);
      },
      spawnFlagSquare(opts) {
        if (!opts?.locale) return;
        placeStaticFlag(opts);
      },
      destroy() {
        container.removeEventListener("pointerdown", onStaticPointer);
        container.replaceChildren();
        container.classList.remove("is-ready");
      },
    };
  }

  const engine = Engine.create({
    gravity: { x: 0, y: 1.05 },
    enableSleeping: true,
  });
  const world = engine.world;
  const runner = Runner.create();

  let wallBodies = makeWalls(width, height);
  World.add(world, wallBodies);

  const mouse = Mouse.create(container);
  // Matter 0.20 binds `wheel` (not legacy mousewheel) and calls preventDefault —
  // that blocks page scroll over the full-bleed hero physics layer.
  mouse.element.removeEventListener("wheel", mouse.mousewheel);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.18,
      damping: 0.1,
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);

  // Matter touch handlers use passive:false + preventDefault on every move.
  // Allow page scroll unless a body is grabbed.
  let touchDragging = false;
  mouse.element.removeEventListener("touchmove", mouse.mousemove);
  mouse.element.removeEventListener("touchstart", mouse.mousedown);
  mouse.element.removeEventListener("touchend", mouse.mouseup);
  const withOptionalTouchBlock = (handler) => (event) => {
    if (event.changedTouches && !touchDragging) {
      const blocked = event.preventDefault.bind(event);
      event.preventDefault = () => {};
      try {
        handler(event);
      } finally {
        event.preventDefault = blocked;
      }
      return;
    }
    handler(event);
  };
  const onTouchMove = withOptionalTouchBlock(mouse.mousemove);
  const onTouchStart = withOptionalTouchBlock(mouse.mousedown);
  const onTouchEnd = withOptionalTouchBlock(mouse.mouseup);
  mouse.element.addEventListener("touchmove", onTouchMove, { passive: false });
  mouse.element.addEventListener("touchstart", onTouchStart, { passive: false });
  mouse.element.addEventListener("touchend", onTouchEnd, { passive: false });

  container.classList.add("is-grab");

  const onStartDrag = () => {
    touchDragging = true;
    container.classList.add("is-dragging");
    notifyInteract();
  };
  const onEndDrag = () => {
    touchDragging = false;
    container.classList.remove("is-dragging");
  };
  Events.on(mouseConstraint, "startdrag", onStartDrag);
  Events.on(mouseConstraint, "enddrag", onEndDrag);

  const afterUpdate = () => {
    for (const actor of actors) {
      if (!actor.body) continue;
      syncActorEl(actor.el, actor.body, actor.half);
    }
  };
  Events.on(engine, "afterUpdate", afterUpdate);

  let running = false;
  const setRunning = (shouldRun) => {
    if (shouldRun === running) return;
    running = shouldRun;
    if (shouldRun) Runner.run(runner, engine);
    else Runner.stop(runner);
  };

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      setRunning(Boolean(entry?.isIntersecting));
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(container);

  {
    const rect = container.getBoundingClientRect();
    const viewH = window.innerHeight || 0;
    setRunning(rect.bottom > 0 && rect.top < viewH);
  }

  const removeActor = (actor) => {
    if (actor.body) World.remove(world, actor.body);
    actor.el.remove();
    const idx = actors.indexOf(actor);
    if (idx >= 0) actors.splice(idx, 1);
  };

  const spawnBall = (ball, i = 0, { scale = 1 } = {}) => {
    if (!ball?.path) return;

    const existing = actors.filter((a) => a.kind === "ball");
    if (existing.length >= MAX_BALLS) {
      removeActor(existing[0]);
    }

    const r = radius * scale;
    const el = createBallEl(ball, r);
    container.appendChild(el);

    const leftPad = narrow ? r + 16 : width * 0.28;
    const span = Math.max(40, width - leftPad - r - 24);
    const x = leftPad + Math.random() * span;
    const y = -r - 40 - Math.random() * 160 - i * 28;
    const body = Bodies.circle(x, y, r, {
      restitution: RESTITUTION,
      friction: FRICTION,
      frictionAir: FRICTION_AIR,
      density: 0.0018,
      label: ball.id,
      sleepThreshold: 45,
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
    Body.setVelocity(body, {
      x: (Math.random() - 0.35) * 2.5,
      y: Math.random() * 1.5,
    });
    World.add(world, body);
    actors.push({ body, el, half: r, kind: "ball" });
    syncActorEl(el, body, r);
  };

  items.forEach((ball, i) => {
    const timer = window.setTimeout(() => spawnBall(ball, i), 60 + i * 95);
    spawnTimers.push(timer);
  });

  const spawnTechBall = (ball, opts) => spawnBall(ball, 0, opts);

  const spawnAiSquare = (tool) => {
    if (!tool?.icon) return;

    const existing = actors.filter((a) => a.kind === "ai");
    if (existing.length >= MAX_AI_SQUARES) {
      removeActor(existing[0]);
    }

    const half = aiSize / 2;
    const el = createAiSquareEl(tool, aiSize);
    container.appendChild(el);

    const leftPad = narrow ? half + 16 : width * 0.3;
    const span = Math.max(40, width - leftPad - half - 24);
    const x = leftPad + Math.random() * span;
    const y = -half - 30 - Math.random() * 80;
    const body = Bodies.rectangle(x, y, aiSize, aiSize, {
      restitution: 0.55,
      friction: 0.12,
      frictionAir: FRICTION_AIR,
      density: AI_DENSITY,
      chamfer: { radius: 12 },
      label: `ai-${tool.id}`,
      sleepThreshold: 45,
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 3,
      y: 2 + Math.random() * 2,
    });
    World.add(world, body);
    actors.push({ body, el, half, kind: "ai" });
    syncActorEl(el, body, half);
  };

  /** Starts at 2Р“вЂ” AI square size; each click grows size & density Р“вЂ”1.5. */
  const spawnAvatarSquare = ({ src, label } = {}) => {
    if (!src) return;

    const existing = actors.filter((a) => a.kind === "avatar");
    if (existing.length >= MAX_AVATAR_SQUARES) {
      removeActor(existing[0]);
    }

    const { size, density } = nextAvatarStats();
    const half = size / 2;
    const el = createAvatarSquareEl(src, size, label);
    container.appendChild(el);

    const leftPad = narrow ? half + 16 : width * 0.28;
    const span = Math.max(40, width - leftPad - half - 24);
    const x = leftPad + Math.random() * span;
    const y = -half - 40 - Math.random() * 60;
    const body = Bodies.rectangle(x, y, size, size, {
      restitution: 0.42,
      friction: 0.16,
      frictionAir: FRICTION_AIR,
      density,
      chamfer: { radius: Math.max(10, Math.round(size * 0.07)) },
      label: "avatar",
      sleepThreshold: 50,
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 2.2,
      y: 1.5 + Math.random() * 1.5,
    });
    World.add(world, body);
    actors.push({ body, el, half, kind: "avatar" });
    syncActorEl(el, body, half);
  };

  const spawnFlagSquare = ({ locale, label } = {}) => {
    if (!locale) return;

    const existing = actors.filter((a) => a.kind === "flag");
    if (existing.length >= MAX_FLAG_SQUARES) {
      removeActor(existing[0]);
    }

    const half = aiSize / 2;
    const el = createFlagSquareEl(locale, aiSize, label);
    container.appendChild(el);

    const leftPad = narrow ? half + 16 : width * 0.3;
    const span = Math.max(40, width - leftPad - half - 24);
    const x = leftPad + Math.random() * span;
    const y = -half - 30 - Math.random() * 80;
    const body = Bodies.rectangle(x, y, aiSize, aiSize, {
      restitution: 0.55,
      friction: 0.12,
      frictionAir: FRICTION_AIR,
      density: AI_DENSITY,
      chamfer: { radius: 12 },
      label: `flag-${locale}`,
      sleepThreshold: 45,
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 3,
      y: 2 + Math.random() * 2,
    });
    World.add(world, body);
    actors.push({ body, el, half, kind: "flag" });
    syncActorEl(el, body, half);
  };

  const onResize = () => {
    const next = measure();
    if (next.width === width && next.height === height) return;
    width = next.width;
    height = next.height;

    World.remove(world, wallBodies);
    wallBodies = makeWalls(width, height);
    World.add(world, wallBodies);

    for (const actor of actors) {
      if (!actor.body) continue;
      const h = actor.half;
      const x = Math.min(Math.max(actor.body.position.x, h), width - h);
      const y = Math.min(Math.max(actor.body.position.y, h), height - h);
      Body.setPosition(actor.body, { x, y });
    }
  };

  const resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(container);

  let lastScrollY = window.scrollY;
  let scrollRaf = 0;

  const applyScrollInertia = () => {
    scrollRaf = 0;
    const y = window.scrollY;
    const delta = y - lastScrollY;
    lastScrollY = y;

    if (Math.abs(delta) < SCROLL_MIN_DELTA) return;
    // Ignore teleport jumps (infinite-scroll loop, programmatic scroll).
    if (Math.abs(delta) > SCROLL_JUMP_PX) return;

    const rect = container.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    if (rect.bottom <= 0 || rect.top >= viewH) return;

    const visible =
      Math.min(rect.bottom, viewH) - Math.max(rect.top, 0);
    const visibility = Math.max(0, Math.min(1, visible / Math.max(1, rect.height)));
    if (visibility <= 0.05) return;

    let vy = delta * SCROLL_IMPULSE * visibility;
    if (vy > SCROLL_MAX_VY) vy = SCROLL_MAX_VY;
    else if (vy < -SCROLL_MAX_VY) vy = -SCROLL_MAX_VY;

    const spin = Math.abs(vy) * SCROLL_SPIN;

    for (const actor of actors) {
      const body = actor.body;
      if (!body) continue;
      Sleeping.set(body, false);
      Body.setVelocity(body, {
        x: body.velocity.x + (Math.random() - 0.5) * Math.abs(vy) * 0.22,
        y: body.velocity.y + vy,
      });
      Body.setAngularVelocity(
        body,
        body.angularVelocity + (Math.random() - 0.5) * spin,
      );
    }
  };

  const onScroll = () => {
    if (!running) return;
    if (!scrollRaf) {
      scrollRaf = requestAnimationFrame(applyScrollInertia);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    spawnAiSquare,
    spawnTechBall,
    spawnAvatarSquare,
    spawnFlagSquare,
    destroy() {
      spawnTimers.forEach((id) => clearTimeout(id));
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      Events.off(engine, "afterUpdate", afterUpdate);
      Events.off(mouseConstraint, "startdrag", onStartDrag);
      Events.off(mouseConstraint, "enddrag", onEndDrag);
      mouse.element.removeEventListener("mousemove", mouse.mousemove);
      mouse.element.removeEventListener("mousedown", mouse.mousedown);
      mouse.element.removeEventListener("mouseup", mouse.mouseup);
      mouse.element.removeEventListener("touchmove", onTouchMove);
      mouse.element.removeEventListener("touchstart", onTouchStart);
      mouse.element.removeEventListener("touchend", onTouchEnd);
      setRunning(false);
      World.clear(world, false);
      Engine.clear(engine);
      container.replaceChildren();
      container.classList.remove("is-ready", "is-grab", "is-dragging");
    },
  };
}
