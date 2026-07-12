# CLAUDE.md

Context for Claude (and compatible agents) in this repo.

## What this is

A **static** profile landing page hosted on **GitHub Pages**. Steam-dark visual language. Content lives in `data/profile.js`.

Read [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md) before making UI or structure changes.

## Stack

| Layer | Choice |
|-------|--------|
| Markup | Plain HTML + Alpine.js directives (`index.html`) |
| Style | Plain CSS (`css/styles.css`) |
| Behavior | Alpine.js CDN + `Alpine.data('profilePage')` in `js/main.js` |
| Data | `window.PROFILE` in `data/profile.js` |
| Hosting | GitHub Pages (root `index.html`) |

No React, no Vite, no npm required for the default workflow. Alpine loads from jsDelivr CDN.

## Working agreement

1. Smallest change that satisfies the request.
2. Content edits → `data/profile.js` first.
3. Visual changes must stay within DESIGN.md tokens and layout rules.
4. Do not add a backend or build pipeline unless explicitly requested.
5. After UI work, sanity-check responsive layout and reduced-motion path.

## File priorities

```
data/profile.js   → copy & links
css/styles.css    → look & feel
index.html        → landmarks, sections, Alpine bindings
js/main.js        → Alpine.data + scroll reveal
DESIGN.md         → design source of truth
```

## Output expectations

- Prefer concrete file edits over long plans.
- If inventing placeholder copy, keep it obviously editable.
- When unsure about personal facts (name, links, bio), use clear placeholders rather than guessing private details.
