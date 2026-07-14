# CLAUDE.md

Context for Claude (and compatible agents) in this repo.

## What this is

Static profile landing on **GitHub Pages**, built with **Vite**. Steam-dark UI, Alpine.js for interactivity. Content in `src/shared/data/profile.js`.

Read [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md) before UI or structure changes.

## Stack

| Layer | Choice |
|-------|--------|
| Bundler | Vite (`npm run dev` / `build`) |
| Markup | `index.html` + Handlebars `{{> section/name }}` from `src/components/` |
| Style | Shared foundation + colocated component CSS |
| Behavior | Alpine.js via `src/app/profile-page.js` (one root) |
| Data | `src/shared/data/profile.js` (ESM export) |
| Hosting | GitHub Pages from `dist/` (Actions) |

## Working agreement

1. Smallest change that satisfies the request.
2. Content edits → `src/shared/data/profile.js` first.
3. Visual changes stay within DESIGN.md tokens.
4. Keep `base: '/profile/'` unless the repo/Pages path changes.
5. Run `npm run build` after toolchain or import changes.
6. Release-worthy changes: bump `package.json` `version` **and** update [`CHANGELOG.md`](CHANGELOG.md) together (see [`AGENTS.md`](AGENTS.md)).

## File priorities

```
src/shared/data/profile.js     → IDs, URLs, stack
src/shared/i18n/locales/*      → copy & translations
src/components/<section>/*     → section markup, CSS, Alpine mixins
src/shared/styles/*            → tokens / base / panels / motion
src/app/profile-page.js        → compose mixins + lifecycle
index.html                     → shell + {{> section/name }}
src/main.js                    → boot Alpine + CSS cascade
vite.config.js                 → base path, handlebars, build
package.json                   → version + deps
CHANGELOG.md                   → release history
DESIGN.md                      → design source of truth
AGENTS.md                      → agent rules
```
