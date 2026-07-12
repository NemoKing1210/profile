# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

Static personal profile landing for GitHub Pages.

- **No backend**, no server-side rendering, no databases.
- **No build step** required for production; files are served as-is.
- **UI logic:** [Alpine.js](https://alpinejs.dev/) (CDN) + [`js/main.js`](js/main.js) (`Alpine.data('profilePage')`).
- Content source of truth: [`data/profile.js`](data/profile.js) (`window.PROFILE`).
- Visual system: Steam Store dark theme — see [`DESIGN.md`](DESIGN.md).
- Page language: Russian (`lang="ru"`).

## Do

- Prefer editing `data/profile.js` for copy, links, and project list.
- Bind UI with Alpine directives (`x-text`, `x-for`, `:href`, …); register behavior in `alpine:init`.
- Keep HTML semantic; keep CSS tokens in `:root`.
- Preserve accessibility: skip link, focus styles, `prefers-reduced-motion`, `[x-cloak]`.
- Keep the site deployable by pushing the repo root to GitHub Pages.
- Match existing naming and file layout before inventing new folders.

## Don’t

- Don’t add a backend, auth, or secret API keys.
- Don’t introduce a bundler or replace Alpine with another framework unless the human asks.
- Don’t restyle away from the Steam dark palette (see DESIGN.md anti-patterns).
- Don’t put personal secrets, private emails you shouldn’t publish, or tokens in the repo.
- Don’t create drive-by refactors or unrelated files.

## Common tasks

| Task | Touch |
|------|--------|
| Update bio / projects / links | `data/profile.js` |
| Change layout / sections | `index.html` (+ Alpine bindings) |
| Alpine component logic | `js/main.js` |
| Theme / spacing / type | `css/styles.css` + `DESIGN.md` |
| Replace art | `assets/images/*` |

## Verification

1. Open `index.html` via a local static server (or file open for quick check).
2. Confirm all sections render from `PROFILE`.
3. Check mobile width (~375px) and desktop.
4. Keyboard-tab through nav, CTAs, capsules, and links.

## Docs map

- [`README.md`](README.md) — human overview & deploy
- [`DESIGN.md`](DESIGN.md) — visual contract
- [`CLAUDE.md`](CLAUDE.md) — Claude-oriented summary
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution norms
