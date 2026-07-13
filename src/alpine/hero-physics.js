import Matter from "matter-js";
import { techBalls } from "../data/tech-balls.js";

const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Runner, Events } =
  Matter;

const WALL = 80;
const RESTITUTION = 0.78;
const FRICTION = 0.05;
const FRICTION_AIR = 0.01;
const MAX_AI_SQUARES = 16;

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
 * @returns {{ spawnAiSquare: (tool: object) => void, destroy: () => void }}
 */
export function initHeroPhysics(container) {
  const noop = {
    spawnAiSquare() {},
    destroy() {},
  };

  if (!container) return noop;

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
  const items = techBalls.slice(0, narrow ? 9 : techBalls.length);

  /** @type {{ body?: import("matter-js").Body, el: HTMLElement, half: number, kind: string }[]} */
  const actors = [];
  /** @type {number[]} */
  const spawnTimers = [];

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

  if (prefersReducedMotion()) {
    placeStatic(container, items, radius);
    return {
      spawnAiSquare(tool) {
        if (!tool?.icon) return;
        placeStaticAi(tool);
      },
      destroy() {
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
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.18,
      damping: 0.1,
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);

  container.classList.add("is-grab");

  const onStartDrag = () => container.classList.add("is-dragging");
  const onEndDrag = () => container.classList.remove("is-dragging");
  Events.on(mouseConstraint, "startdrag", onStartDrag);
  Events.on(mouseConstraint, "enddrag", onEndDrag);

  const afterUpdate = () => {
    for (const actor of actors) {
      if (!actor.body) continue;
      syncActorEl(actor.el, actor.body, actor.half);
    }
  };
  Events.on(engine, "afterUpdate", afterUpdate);

  Runner.run(runner, engine);

  const removeActor = (actor) => {
    if (actor.body) World.remove(world, actor.body);
    actor.el.remove();
    const idx = actors.indexOf(actor);
    if (idx >= 0) actors.splice(idx, 1);
  };

  const spawnBall = (ball, i) => {
    const el = createBallEl(ball, radius);
    container.appendChild(el);

    const leftPad = narrow ? radius + 16 : width * 0.28;
    const span = Math.max(40, width - leftPad - radius - 24);
    const x = leftPad + Math.random() * span;
    const y = -radius - 40 - Math.random() * 160 - i * 28;
    const body = Bodies.circle(x, y, radius, {
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
    actors.push({ body, el, half: radius, kind: "ball" });
    syncActorEl(el, body, radius);
  };

  items.forEach((ball, i) => {
    const timer = window.setTimeout(() => spawnBall(ball, i), 60 + i * 95);
    spawnTimers.push(timer);
  });

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
      density: 0.0022,
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

    Mouse.setElement(mouse, container);
  };

  const resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(container);

  return {
    spawnAiSquare,
    destroy() {
      spawnTimers.forEach((id) => clearTimeout(id));
      resizeObserver.disconnect();
      Events.off(engine, "afterUpdate", afterUpdate);
      Events.off(mouseConstraint, "startdrag", onStartDrag);
      Events.off(mouseConstraint, "enddrag", onEndDrag);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      container.replaceChildren();
      container.classList.remove("is-ready", "is-grab", "is-dragging");
    },
  };
}
