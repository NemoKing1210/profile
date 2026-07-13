# CLAUDE.md

Context for Claude (and compatible agents) in this repo.

## What this is

Static profile landing on **GitHub Pages**, built with **Vite**. Steam-dark UI, Alpine.js for interactivity. Content in `src/data/profile.js`.

Read [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md) before UI or structure changes.

## Stack

| Layer | Choice |
|-------|--------|
| Bundler | Vite (`npm run dev` / `build`) |
| Markup | `index.html` + Handlebars `{{> partial }}` from `src/partials/` |
| Style | Split CSS in `src/styles/` |
| Behavior | Alpine.js via `src/main.js` |
| Data | `src/data/profile.js` (ESM export) |
| Hosting | GitHub Pages from `dist/` (Actions) |

## Working agreement

1. Smallest change that satisfies the request.
2. Content edits → `src/data/profile.js` first.
3. Visual changes stay within DESIGN.md tokens.
4. Keep `base: '/profile/'` unless the repo/Pages path changes.
5. Run `npm run build` after toolchain or import changes.
6. Release-worthy changes: bump `package.json` `version` **and** update [`CHANGELOG.md`](CHANGELOG.md) together (see [`AGENTS.md`](AGENTS.md)).

## File priorities

```
src/data/profile.js     → IDs, URLs, stack
src/i18n/locales/*      → copy & translations
src/partials/*.html     → section blocks (Handlebars)
src/styles/*            → look & feel
index.html              → shell + {{> partial }}
src/alpine/*            → component logic
src/main.js             → boot Alpine + CSS
vite.config.js          → base path, handlebars, build
package.json            → version + deps
CHANGELOG.md            → release history
DESIGN.md               → design source of truth
AGENTS.md               → agent rules
```
