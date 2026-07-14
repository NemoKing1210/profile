# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

### Planned

- (none yet)

## [1.53.0] — 2026-07-14

### Added

- Stack “want to learn” subsection: Svelte & SvelteKit, SolidJS, and Go (with why-copy in all locales)

## [1.52.5] — 2026-07-14

### Added

- Reusable avatar speech system (word cascade, motion, session memory, brand-bar fallback when avatar is off-screen)
- Hover speech across hero tips, media covers, projects, AI kit, stack flip/grow, about card, status, hobbies, ORCID
- Component-folder layout (`src/components/*`, `src/shared/*`, `src/app/`)
- Smooth image fade-in on load

### Changed

- Steam invite copy (gamer tone, no “add me / let’s play”)
- React↔Vue flip uses `rotateX`; language switcher with flags + blur handoff; topbar brand uses favicon

### Removed

- CSS tooltips superseded by speech on several surfaces; About “not hiring” blur overlay

## [1.39.0] — 2026-07-13

### Added

- Hero physics (Matter.js balls, AI/flag/avatar spawn, scroll kick) and early speech bubbles
- Fake Steam comments wall + joke form (`-rep` lock, farm-raid egg, infinite send + confetti)
- Infinite “backrooms” scroll so the footer stays out of reach
- Interests: Letterboxd / Backloggd shelves, Steam invite; Minecraft pickaxe mining egg
- Projects as Steam-library capsules; stack pillars + grow callout + React→Vue flip card
- Theme-joke / Sith flash, online→offline epoch joke, mobile hamburger, back-to-top ring
- Birth-chip confetti; uk/ja locales; richer i18n and about availability jokes

### Changed

- Focus merged into Stack; links hub + direct rows; about badges refreshed

## [1.0.0] — 2026-07-12

### Added

- Vite + Alpine.js + Handlebars profile landing (Steam dark UI)
- Sections: hero, about, focus/stack, projects, interests, links
- i18n (`ru` default, `en`, `es`, `de`, `zh`), Pages deploy (`/profile/`), `DESIGN.md`

### Removed

- Legacy static HTML/CSS layout

## [0.1.0] — 2026-07-11

### Added

- Initial profile landing prototype
