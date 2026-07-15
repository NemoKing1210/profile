# Profile Landing

Personal profile site for **[NemoKing1210](https://github.com/NemoKing1210)** (Кирилл) — a Steam Store–inspired dark landing published on **GitHub Pages**.

**Live:** [nemoking1210.github.io/profile](https://nemoking1210.github.io/profile/)

Built with **Vite**, **Alpine.js**, and **Handlebars** partials. Sources stay modular; production ships a static `dist/`.

---

## Features

- Full-bleed hero (banner, avatar, role, CTAs with service favicons)
- Sections: About, Stack, Projects, Interests, Links
- About highlights: skill badges, rich copy, AI tooling strip (Cursor, Claude, Codex, Claude Code)
- Multilingual UI: **en** / **ru** / **uk** / **es** / **de** / **zh** / **ja** — browser language on first visit (fallback **en**), switcher in the topbar
- Steam dark palette (see [`DESIGN.md`](DESIGN.md))
- Accessible basics: skip link, focus-visible, reduced motion, `x-cloak`
- CI deploy via GitHub Actions → Pages

---

## Stack

| Layer | Choice |
|-------|--------|
| Bundler | [Vite](https://vitejs.dev/) |
| Markup | `index.html` + Handlebars `{{> section/name }}` from `src/components/` |
| Style | Shared foundation + colocated component CSS |
| Behavior | [Alpine.js](https://alpinejs.dev/) via `src/app/profile-page.js` (one root) |
| Data | `src/shared/data/profile.js` (IDs, URLs, stack) |
| Copy / i18n | `src/shared/i18n/locales/{ru,uk,en,es,de,zh,ja}/` |
| AI brand icons | [`@lobehub/icons-static-svg`](https://www.npmjs.com/package/@lobehub/icons-static-svg) |
| Hosting | GitHub Pages from `dist/` (Actions) |

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173/profile/
npm run build    # → dist/
npm run preview  # preview production build
```

> Base path is `/profile/` (repo name). Dev and prod URLs must include it.

---

## Versioning

This project follows **[Semantic Versioning](https://semver.org/)** and **[Keep a Changelog](https://keepachangelog.com/)**.

| Source of truth | Role |
|-----------------|------|
| [`package.json`](package.json) `version` | Current release number |
| [`CHANGELOG.md`](CHANGELOG.md) | Human-readable history of changes |

Bump both when shipping a meaningful release (see [`AGENTS.md`](AGENTS.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md)).

**Current version:** see `package.json` → `version`.

---

## Customize

| What | Where |
|------|--------|
| Name, stack, projects, links, AI tools, badges | [`src/shared/data/profile.js`](src/shared/data/profile.js) |
| Audience presets (`?from=steam`, …) | [`src/shared/data/audiences.js`](src/shared/data/audiences.js) |
| Hero game-ball covers (`?from=steam`) | [`public/assets/images/hero-games/`](public/assets/images/hero-games/) + [`game-balls.js`](src/shared/data/game-balls.js) |
| Bio, UI strings, translations | [`src/shared/i18n/locales/`](src/shared/i18n/locales/) |
| Section UI (HTML/CSS/JS) | [`src/components/`](src/components/) |
| Page shell / section order | [`index.html`](index.html) (`{{> section/name }}`) |
| Alpine composer | [`src/app/profile-page.js`](src/app/profile-page.js), [`src/main.js`](src/main.js) |
| Shared styles | [`src/shared/styles/`](src/shared/styles/) |
| Static images | [`public/assets/images/`](public/assets/images/) |
| Vite / Pages base / Handlebars | [`vite.config.js`](vite.config.js) |
| Deploy pipeline | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |

**Content rule of thumb:** IDs and URLs in `profile.js`; user-facing text in **all** locale files.

---

## Structure

```
├── index.html                 # shell + {{> section/name }}
├── vite.config.js             # Vite + vite-plugin-handlebars, base: /profile/
├── package.json               # version + scripts + deps
├── CHANGELOG.md               # release history
├── DESIGN.md                  # visual contract
├── AGENTS.md                  # instructions for AI coding agents
├── public/assets/images/
├── src/
│   ├── main.js                # boot Alpine + CSS cascade
│   ├── app.css                # foundation CSS barrel
│   ├── app/                   # profile-page composer + shared view-model
│   ├── shared/
│   │   ├── data/              # profile.js, icons, marks
│   │   ├── i18n/locales/      # ru uk en es de zh ja
│   │   ├── styles/            # tokens, base, panels, motion
│   │   └── lib/               # confetti, reveal
│   └── components/            # colocated HTML + CSS + JS per section
├── dist/                      # build output (not committed)
└── .github/workflows/deploy.yml
```

---

## Internationalization

- Initial language: browser (`navigator.languages`), then **English**; saved preference wins (`document.documentElement.lang` follows the switcher).
- Locales: `ru`, `uk`, `en`, `es`, `de`, `zh`, `ja`.
- Spoken-language chips in the hero come from `profile.spokenLanguages` + each locale’s `spoken` map.
- Preference is stored in `localStorage` (see Alpine `profile-page`).

When you add a string, add it to **every** locale file.

---

## Deploy (GitHub Pages)

1. Push to `main` — the workflow builds and publishes `dist/`.
2. Repo **Settings → Pages → Source:** **GitHub Actions** (not “Deploy from a branch”).
3. Open https://nemoking1210.github.io/profile/

If the **repo name** (Pages path) changes, update `base` in `vite.config.js` to match (`/new-name/`).

---

## Design

Visual rules live in [`DESIGN.md`](DESIGN.md): Steam dark palette, Exo 2 + Source Sans 3, brand-first hero, capsule project shelf. Prefer tokens over one-off colors.

---

## Docs map

| Doc | Purpose |
|-----|---------|
| [`README.md`](README.md) | Overview, setup, deploy |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |
| [`DESIGN.md`](DESIGN.md) | Visual contract |
| [`AGENTS.md`](AGENTS.md) | Rules for AI coding agents |
| [`CLAUDE.md`](CLAUDE.md) | Short Claude-oriented summary |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution norms |

---

## License

Add a license if you publish the source as a reusable template. Personal content and assets remain yours.
