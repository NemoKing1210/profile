# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

### Planned

- (none yet)

## [1.38.0] — 2026-07-13

### Added

- Hero physics: scroll inertia — bodies wake and get a velocity kick when the page scrolls (same direction as scroll; fades with hero visibility; ignores teleport jumps)

## [1.37.0] — 2026-07-13

### Changed

- About highlight badges: approach-focused set (frontend first, details, idea→UI, backend when needed, AI in the loop, remote) instead of stack/AI buzzword chips

## [1.36.0] — 2026-07-13

### Added

- Farm-raid comment easter egg: voting on «Через 2 часа нашу ферму будут рейдить» spawns a delayed reply chain from the same author

## [1.35.0] — 2026-07-13

### Added

- Minecraft cover easter egg: click the poster for a pickaxe cursor (JE1 diamond pickaxe sprite) and hold LMB to mine UI with destroy-stage crack overlays (Esc to exit)

## [1.34.1] — 2026-07-13

### Fixed

- Links: lighter icon tiles only for dark brand marks (GitHub, Letterboxd)

## [1.34.0] — 2026-07-13

### Changed

- Links section: Linktree hub with avatar/CTA (media-shelf style), brand icon chips, and direct link rows with marks + external affordance

## [1.33.2] — 2026-07-13

### Added

- Letterboxd and Backloggd shelf headers show profile avatar + display name

## [1.33.1] — 2026-07-13

### Changed

- Steam invite: avatar + nickname, full-width text, removed handle line

## [1.33.0] — 2026-07-13

### Added

- Steam invite card in Interests: co-op welcome + link to [mrnemoking](https://steamcommunity.com/id/mrnemoking/)

## [1.32.2] — 2026-07-13

### Changed

- Backloggd favorites use real cover images; Minecraft links to [minecraft--1](https://backloggd.com/games/minecraft--1/)

## [1.32.1] — 2026-07-13

### Added

- Roblox cover tooltip: programming origin story

### Removed

- Film / game count badges from Letterboxd and Backloggd shelves

## [1.32.0] — 2026-07-13

### Added

- Backloggd shelf in Interests (favorite games from [NemoKing](https://backloggd.com/u/NemoKing/), genres, SVG cover stubs)
- Short “what is this service” blurbs for Letterboxd and Backloggd

### Changed

- Game genre badges moved into the Backloggd shelf footer

## [1.31.3] — 2026-07-13

### Added

- Letterboxd shelf footer: favorite film subgenres

## [1.31.2] — 2026-07-13

### Changed

- Interests: intro copy merged with hobby chips; removed chip highlight interactivity

## [1.31.1] — 2026-07-13

### Changed

- Interests film shelf uses vertical 2:3 posters in a 4-across row (Letterboxd-style)

## [1.31.0] — 2026-07-13

### Changed

- Interests: hobby chips with icons, genre badges, interactive highlight, Letterboxd film-banner shelf (SVG stubs in `public/assets/images/films/` — replace with real banners)

## [1.30.1] — 2026-07-13

### Added

- Projects footer notice: starting small for now, bigger work ahead

## [1.30.0] — 2026-07-13

### Changed

- Projects shelf: richer Steam-library capsules with brand marks, kind labels, highlight bullets, longer blurbs, and GitHub CTA

## [1.29.1] — 2026-07-13

### Changed

- Stack flip card stays on Vue after the reveal; Vue side calls out the favorite framework

## [1.29.0] — 2026-07-13

### Added

- Stack joke card: React-branded face flips toward Vue as you scroll closer

## [1.28.0] — 2026-07-13

### Added

- Flag square from `country-flag-icons` drops into the hero physics layer when the UI locale changes

## [1.27.3] — 2026-07-13

### Added

- Fake comment from `WonderKusWhy` (+rep Stalcraft teammate)

## [1.27.2] — 2026-07-13

### Changed

- Replaced the fake trade +rep comment with `kalerkin_dust` farm-raid note

## [1.27.1] — 2026-07-13

### Changed

- Repeated `-rep` attempts double the joke lock (10s → 20s → 40s …)

## [1.27.0] — 2026-07-13

### Added

- Typing `-rep` in the comment form shows a joke moderation tooltip and locks the input for 10s

## [1.26.0] — 2026-07-13

### Added

- Fake `-rep` comments blur bait words that look like insults until hover (actually praise)

## [1.25.3] — 2026-07-13

### Fixed

- Scroll jumping backward when recycling old infinite-scroll echoes (instant compensation + no overflow anchoring)

## [1.25.2] — 2026-07-13

### Changed

- Backrooms distortion ramps in more slowly (ease-in over more loops, softer early text decay)

## [1.25.1] — 2026-07-13

### Fixed

- Alpine errors on infinite-scroll clones (`link` / `item` is not defined) by neutralizing directives with `x-ignore`

## [1.25.0] — 2026-07-13

### Added

- Backrooms echo text keeps decaying on scroll: lookalike swaps, glyph noise, word voids

## [1.24.1] — 2026-07-13

### Fixed

- Horizontal page scroll caused by Backrooms echo warp/overlays

## [1.24.0] — 2026-07-13

### Added

- Infinite-scroll echoes intensify with Backrooms-style liminal distortion (yellow haze, warp, flicker, glitched marks)

## [1.23.0] — 2026-07-13

### Added

- Infinite scroll that keeps cloning page sections so the footer stays forever out of reach (with rotating taunt lines)

## [1.22.1] — 2026-07-13

### Changed

- Avatar speech bubbles auto-hide 5 seconds after typing finishes

## [1.22.0] — 2026-07-13

### Added

- At 30 hero physics interactions, a second speech bubble and an auto-spawned avatar join the play

## [1.21.0] — 2026-07-13

### Added

- After 20 hero physics interactions, a typewriter speech bubble appears above the avatar nudging visitors to keep reading

## [1.20.0] — 2026-07-13

### Added

- Language meta chips show a “Hello, world!” tooltip in that language

## [1.19.1] — 2026-07-13

### Fixed

- Hero meta chip tooltips now receive hover (Alpine class binding no longer dropped `meta-chip--has-tip`)

## [1.19.0] — 2026-07-13

### Added

- Joke tooltips on hero meta chips: location (“in the Matrix”) and birth year (“Zoomer”)

## [1.18.0] — 2026-07-13

### Added

- Hover/focus tooltip on the hero name with a playful “that’s my name” note

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
