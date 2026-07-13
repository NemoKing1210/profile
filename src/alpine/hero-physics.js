import Matter from "matter-js";
import { techBalls } from "../data/tech-balls.js";

const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Runner, Events } =
  Matter;

const WALL = 80;
const RESTITUTION = 0.78;
const FRICTION = 0.05;
const FRICTION_AIR = 0.01;

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

function syncBallEl(el, body, radius) {
  const { x, y } = body.position;
  el.style.transform = `translate3d(${x - radius}px, ${y - radius}px, 0) rotate(${body.angle}rad)`;
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
 * Interactive physics balls in the hero.
 * @param {HTMLElement} container
 * @returns {() => void} cleanup
 */
export function initHeroPhysics(container) {
  if (!container) return () => {};

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
  const items = techBalls.slice(0, narrow ? 9 : techBalls.length);

  if (prefersReducedMotion()) {
    placeStatic(container, items, radius);
    return () => {
      container.replaceChildren();
      container.classList.remove("is-ready");
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

  /** @type {{ body: import("matter-js").Body, el: HTMLElement, radius: number }[]} */
  const actors = [];

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
      syncBallEl(actor.el, actor.body, actor.radius);
    }
  };
  Events.on(engine, "afterUpdate", afterUpdate);

  Runner.run(runner, engine);

  const spawnTimers = [];
  items.forEach((ball, i) => {
    const timer = window.setTimeout(() => {
      const el = createBallEl(ball, radius);
      container.appendChild(el);

      // Bias toward the open right side of the hero so the pile stays visible.
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
      actors.push({ body, el, radius });
      syncBallEl(el, body, radius);
    }, 60 + i * 95);
    spawnTimers.push(timer);
  });

  const onResize = () => {
    const next = measure();
    if (next.width === width && next.height === height) return;
    width = next.width;
    height = next.height;

    World.remove(world, wallBodies);
    wallBodies = makeWalls(width, height);
    World.add(world, wallBodies);

    for (const actor of actors) {
      const { body } = actor;
      const r = actor.radius;
      const x = Math.min(Math.max(body.position.x, r), width - r);
      const y = Math.min(Math.max(body.position.y, r), height - r);
      Body.setPosition(body, { x, y });
    }

    Mouse.setElement(mouse, container);
  };

  const resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(container);

  return () => {
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
  };
}
