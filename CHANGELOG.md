# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

### Planned

- (none yet)

## [1.6.1] — 2026-07-13

### Changed

- Stack grow mark uses Heroicons `arrow-trending-up` (generic UI icons via `heroicons` package)

## [1.6.0] — 2026-07-13

### Added

- Stack “always learning” callout under the tech pillars (copy + tags in all locales)

## [1.5.0] — 2026-07-13

### Changed

- Merged Focus and Stack into one **Стек** section: three pillars (Frontend / Backend / Languages) with narrative + clickable tech chips
- Nav no longer lists Focus separately (`#stack` only)

### Removed

- Standalone Focus panel (`src/partials/focus.html`)

## [1.4.0] — 2026-07-13

### Added

- Richer Focus cards with brand marks and clickable tech badges that spawn hero physics balls
- Focus eyebrow + tech chip labels across all locales

### Changed

- Focus copy refreshed (UI / frameworks / remote+backend pillars)

## [1.3.0] — 2026-07-13

### Added

- Click an AI tool chip (Cursor, Claude, Codex, Claude Code) to drop a matching physics square into the hero

## [1.2.0] — 2026-07-13

### Added

- Hero physics layer: colorful tech/language balls fall in on load (Matter.js), collide, and can be dragged
- Tech ball icons via `simple-icons` (Vue, Nuxt, JS/TS, HTML/CSS, Node, PHP, Laravel, Yii, Lua, C#/.NET, Vite, Alpine)

### Changed

- Hero veil softened on the right so the ball pile stays readable
- Hero min-height slightly increased to give the physics playfield more room

## [1.1.0] — 2026-07-13

### Added

- About section highlights: lead copy with emphasis, skill badges, frontend-first / backend-capable messaging
- AI tooling strip with official brand icons via `@lobehub/icons-static-svg` (Cursor, Claude, Codex, Claude Code)
- Hero CTA favicons for primary links (GitHub, Linktree)
- Project versioning via `CHANGELOG.md` + `package.json` version

### Changed

- Richer multilingual About copy across `ru`, `en`, `es`, `de`, `zh`
- Expanded README with features, stack, i18n, and versioning notes
- AGENTS.md documents changelog / semver workflow

## [1.0.0] — 2026-07-12

### Added

- Vite + Alpine.js + Handlebars partials architecture
- Steam dark UI sections: hero, about, focus, stack, projects, interests, links
- i18n locales: Russian (default), English, Spanish, German, Chinese
- GitHub Actions deploy to GitHub Pages (`/profile/` base)
- Design system documented in `DESIGN.md`

### Removed

- Legacy static HTML/CSS layout superseded by the modular Vite build

## [0.1.0] — 2026-07-11

### Added

- Initial profile landing prototype
