# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

Personal profile landing for GitHub Pages.

- **No backend.**
- **Bundler:** Vite. Dev = modular sources; prod = `dist/`.
- **UI:** Alpine.js + Handlebars partials (`src/partials/`) + CSS (`src/styles/`).
- Content: [`src/data/profile.js`](src/data/profile.js) (IDs / stack / links).
- i18n: [`src/i18n/locales/`](src/i18n/locales/) — `ru`, `en`, `es`, `de`, `zh`.
- Visual system: Steam dark theme — [`DESIGN.md`](DESIGN.md).
- Language: UI is multilingual; default `ru`, switcher in topbar.
- Pages URL base: `/profile/` (see `vite.config.js`).
- HTML includes: [`vite-plugin-handlebars`](https://www.npmjs.com/package/vite-plugin-handlebars) — `{{> name }}` → `src/partials/<name>.html`.

## Do

- Prefer editing locale files for copy; keep IDs/URLs in `src/data/profile.js`.
- When adding a string, add it to **all** locale files.
- Spoken languages for chips: `profile.spokenLanguages` + `spoken` map in each locale.
- Put page sections in `src/partials/*.html`; include them from `index.html` via `{{> name }}`.
- Keep CSS split by concern (`tokens`, `hero`, `panels`, …); import via `src/styles/index.css`.
- Register Alpine behavior in `src/alpine/`; boot from `src/main.js`.
- Avoid Handlebars `{{ … }}` inside partials for Alpine text — use `x-text` / bindings (already the pattern).
- Preserve accessibility: skip link, focus styles, reduced motion, `[x-cloak]`.
- After structural changes, run `npm run build` and confirm it succeeds.

## Don’t

- Don’t add a backend, auth, or secrets.
- Don’t commit `node_modules/` or `dist/`.
- Don’t change `base` unless the GitHub repo name / Pages path changes.
- Don’t restyle away from DESIGN.md palette.
- Don’t invent a second framework alongside Alpine unless asked.

## Common tasks

| Task | Touch |
|------|--------|
| Update bio / projects / links | `src/data/profile.js` + `src/i18n/locales/*` |
| Translations | `src/i18n/locales/{ru,en,es,de,zh}.js` |
| Layout shell | `index.html` (`{{> partial }}`) |
| Section markup (blocks) | `src/partials/*.html` |
| Alpine logic | `src/alpine/*`, `src/main.js` |
| Theme | `src/styles/*`, `DESIGN.md` |
| Images | `public/assets/images/*` |
| Handlebars / Vite config | `vite.config.js` |
| Deploy pipeline | `.github/workflows/deploy.yml` |

## Verification

```bash
npm run dev
npm run build
npm run preview
```

Check mobile width, keyboard nav, and that asset URLs respect `/profile/`.

## Docs map

- [`README.md`](README.md) — overview & deploy
- [`DESIGN.md`](DESIGN.md) — visual contract
- [`CLAUDE.md`](CLAUDE.md) — Claude-oriented summary
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution norms
