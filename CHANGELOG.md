# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

### Fixed

- Avatar speech bubble follows light theme tokens (no hard-coded Steam-dark fill)
- About activity chart / tip adopt light theme tokens
- Stack flip / explore / grow blocks adopt light theme tokens
- Interests intro, media shelves, and Steam invite adopt light theme tokens
- Comments wall / form adopt light theme tokens (plus / minus tones keep readable contrast)

## [1.57.1] — 2026-07-14

### Fixed

- Light theme chrome: topbar tools (lang / achievements / theme / burger) share the same fill; dark wells on about, comments, links, and drawers adapted for `body.theme-light`

## [1.57.0] — 2026-07-14

### Added

- White / light theme (`body.theme-light`) with Steam-inspired light tokens
- Theme preference persistence (`profile:theme`) after the `lightTheme` achievement unlock

### Changed

- Topbar sun control: real light/dark toggle when `lightTheme` is unlocked; Sith deny-joke kept for locked visitors

## [1.56.0] — 2026-07-14

### Added

- Achievements system stored in `localStorage` (`profile:achievements`), with a topbar panel (list + progress) when at least one is unlocked
- Migrated white-theme unlock into the `lightTheme` achievement

## [1.55.0] — 2026-07-14

### Added

- Echo finale at loop 99: white screen, gift, Steam-style achievement unlocking light theme in `localStorage`, and a restart button
- Echo finale gift joke about the missing footer (shown after the achievement)

## [1.54.3] — 2026-07-14

### Changed

- Infinite-scroll liminal marks speak through the avatar speech bubble from the 3rd loop (topbar brand bubble while scrolled)
- Expanded `infiniteMarks` line pool (8 → 24) across all locales
- Infinite-scroll text decay is stronger and ramps sooner (higher budgets, faster depth curve)
- Infinite-scroll CSS warp / stage drift starts later (from loop 6; mid/deep stages delayed)
- Scroll-top control: in the infinite zone the progress ring hides and the chevron becomes the current echo loop number (animated)

## [1.54.2] — 2026-07-14

### Changed

- Infinite-scroll echoes are seamless: removed `infinite-echo__mark` separators and extra padding between loops
- Liminal mark lines appear as steam-comment messages from the 5th echo onward

## [1.54.1] — 2026-07-14

### Changed

- Active topbar nav highlight slides between items instead of jumping

## [1.54.0] — 2026-07-14

### Added

- Topbar nav highlights the section currently in view while scrolling

## [1.53.1] — 2026-07-14

### Changed

- Explore-stack tech balls spawn at half the normal hero ball size

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
