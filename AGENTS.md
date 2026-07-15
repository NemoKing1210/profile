# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

Personal profile landing for GitHub Pages.

- **No backend.**
- **Bundler:** Vite. Dev = modular sources; prod = `dist/`.
- **UI:** Alpine.js + colocated components (`src/components/`) + shared foundation (`src/shared/`).
- Content: [`src/shared/data/profile.js`](src/shared/data/profile.js) (IDs / stack / links).
- i18n: [`src/shared/i18n/locales/`](src/shared/i18n/locales/) — `ru`, `uk`, `en`, `es`, `de`, `zh`, `ja`.
- Visual system: Steam dark theme — [`DESIGN.md`](DESIGN.md).
- Language: UI is multilingual; initial locale from `navigator.languages` (saved preference wins), fallback `en`; switcher in topbar.
- Pages URL base: `/profile/` (see `vite.config.js`).
- HTML includes: [`vite-plugin-handlebars`](https://www.npmjs.com/package/vite-plugin-handlebars) — `partialDirectory` = `src/components`; `{{> section/name }}` → `src/components/<section>/<name>.html`.
- **Versioning:** [`package.json`](package.json) `version` + [`CHANGELOG.md`](CHANGELOG.md) (Keep a Changelog / SemVer).

## Layout

```
src/
  main.js                 # boot Alpine + CSS cascade
  app.css                 # foundation CSS imports
  app/
    profile-page.js       # single Alpine root composer
    view-model.js         # cross-cutting getters (t, nav)
  shared/
    styles/               # tokens, base, buttons, panels, motion
    data/                 # profile IDs/URLs, icons, marks
    i18n/                 # locales (not colocated per component)
    lib/                  # confetti, reveal
  components/<name>/
    index.js              # public API + CSS side-effect import
    *.html                # Handlebars partials
    *.css / *.js          # colocated styles & Alpine mixins / views
```

## Do

- Prefer editing locale files for copy; keep IDs/URLs in `src/shared/data/profile.js`.
- When adding a string, add it to **all** locale files.
- Spoken languages for chips: `profile.spokenLanguages` + `spoken` map in each locale.
- Generic UI icons (non-brand): [`heroicons`](https://heroicons.com) via [`src/shared/data/heroicons.js`](src/shared/data/heroicons.js). Brand logos stay in simple-icons / lobehub.
- Put UI in `src/components/<section>/` (markup + CSS + JS); include via `{{> section/name }}`.
- Export Alpine `*State` / `*Methods` (and view getters) from each component’s `index.js`; compose in `app/profile-page.js`.
- Keep shared styles in `src/shared/styles/`; component CSS loads via `index.js` (order fixed in `main.js`).
- Avoid Handlebars `{{ … }}` inside partials for Alpine text — use `x-text` / bindings.
- Preserve accessibility: skip link, focus styles, reduced motion, `[x-cloak]`.
- After structural changes, run `npm run build` and confirm it succeeds.
- When shipping a meaningful change set (feature, fix, or breaking change), update **versioning**:
  1. Bump `version` in [`package.json`](package.json) (SemVer: MAJOR.MINOR.PATCH).
  2. Record the release under a dated heading in [`CHANGELOG.md`](CHANGELOG.md) (`Added` / `Changed` / `Fixed` / `Removed`).
  3. Move notes out of `[Unreleased]` into the new version section.
  4. Keep README’s versioning pointers accurate if the workflow description changes.

## Don’t

- Don’t add a backend, auth, or secrets.
- Don’t commit `node_modules/` or `dist/`.
- Don’t change `base` unless the GitHub repo name / Pages path changes.
- Don’t restyle away from DESIGN.md palette.
- Don’t invent a second framework or multiple Alpine roots alongside `profilePage`.
- Don’t bump `package.json` version without a matching `CHANGELOG.md` entry (and vice versa for releases).
- Don’t colocate i18n strings into components (keep 7 locales in sync under `shared/i18n`).

## Common tasks

| Task | Touch |
|------|--------|
| Update bio / projects / links | `src/shared/data/profile.js` + `src/shared/i18n/locales/*` |
| Translations | `src/shared/i18n/locales/{ru,uk,en,es,de,zh,ja}/` |
| Layout shell | `index.html` (`{{> section/name }}`) |
| Section UI | `src/components/<section>/*` |
| Page composer | `src/app/profile-page.js` |
| Theme tokens | `src/shared/styles/*`, `DESIGN.md` |
| Images | `public/assets/images/*` |
| Handlebars / Vite config | `vite.config.js` |
| Deploy pipeline | `.github/workflows/deploy.yml` |
| Cut a release / bump version | `package.json` + `CHANGELOG.md` |

## Verification

```bash
npm run dev
npm run build
npm run preview
```

Check mobile width, keyboard nav, and that asset URLs respect `/profile/`.

## Docs map

- [`README.md`](README.md) — overview & deploy
- [`CHANGELOG.md`](CHANGELOG.md) — version history (SemVer)
- [`DESIGN.md`](DESIGN.md) — visual contract
- [`CLAUDE.md`](CLAUDE.md) — Claude-oriented summary
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution norms
