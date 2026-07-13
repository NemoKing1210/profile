# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

### Planned

- (none yet)

## [1.17.0] — 2026-07-13

### Added

- Ukrainian and Japanese UI locales; Ukrainian in spoken languages
- Redesigned hero meta chips with icons (location, languages, birth year)

## [1.16.1] — 2026-07-13

### Added

- Comments nav item shows a live count badge in the topbar

## [1.16.0] — 2026-07-13

### Added

- Online badge flips to Offline on hover with a Unix epoch timestamp tooltip joke

## [1.15.5] — 2026-07-13

### Changed

- Panel backgrounds also shift to dark red during Sith theme

## [1.15.4] — 2026-07-13

### Changed

- Smoother Sith theme crossfade via `@property` color tokens; hero banner veil, avatar, and CTAs tint red too

## [1.15.3] — 2026-07-13

### Added

- Theme joke button briefly paints the site dark-red (Sith mode) for 5 seconds

## [1.15.2] — 2026-07-13

### Changed

- Grouped locale, theme toggle, and online status in a tighter topbar tools cluster

## [1.15.1] — 2026-07-13

### Changed

- Theme-joke toast now nods to the Sith / dark side of the Force

## [1.15.0] — 2026-07-13

### Added

- Joke theme toggle in the topbar that refuses light mode with localized copy

## [1.14.0] — 2026-07-13

### Added

- Mobile hamburger menu in the topbar (drawer nav under 860px)

## [1.13.2] — 2026-07-13

### Changed

- Avatar spawns grow size and density ×1.5 each click with no size cap; avatar limit raised to 8

## [1.13.1] — 2026-07-13

### Changed

- Each hero avatar click spawns a square 1.5× larger than the previous one (capped to the hero)

## [1.13.0] — 2026-07-13

### Changed

- Moved the “AI & agents” toolkit block from About into Stack

## [1.12.0] — 2026-07-13

### Added

- About “availability” aside: not looking for work, always looking for happiness (localized joke copy)

## [1.11.1] — 2026-07-13

### Changed

- Avatar physics square is 5× heavier than before (~10× a normal AI square)

## [1.11.0] — 2026-07-13

### Added

- Clicking the hero avatar spawns a 2× larger, 2× heavier physics square with the same photo

## [1.10.0] — 2026-07-13

### Added

- At ~75% fake send progress, inject a live Steam-style comment with a half-mangled nickname and a random spoof body

## [1.9.2] — 2026-07-13

### Changed

- Proofread comment wait/finale copy across locales; fake wall comments stay in English on purpose

## [1.9.1] — 2026-07-13

### Changed

- Comment wait taunts start at 30s with 15s gaps; updated finale copy; removed progress hint under the bar

## [1.9.0] — 2026-07-13

### Added

- Timed joke taunts during fake comment send (60–300s), finale “no server” error, and 10s `canvas-confetti` celebration

## [1.8.0] — 2026-07-13

### Added

- Fake Steam-style comment wall (`+rep` / `-rep`) above the joke comment form

## [1.7.0] — 2026-07-13

### Added

- Joke **Comments** panel at the end: empty state, form, and an infinite progress bar that slows as it nears “done”

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
