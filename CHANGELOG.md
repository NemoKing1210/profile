# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are mirrored in [`package.json`](package.json) (`version` field).
Update **both** when cutting a release.

## [Unreleased]

## [1.80.0] — 2026-07-19

### Added

- [ProxyChecker](https://github.com/NemoKing1210/ProxyChecker) on the Projects shelf (desktop / Tools)
- Group-by toggle: Type (userscripts / programs / websites) or Shelf (Steam, Backloggd, …), with always-visible type filters

## [1.79.0] — 2026-07-19

### Added

- Projects library: semantic group shelves, search, group/kind filters, tag-to-search, and empty state (copy in all locales)

## [1.78.0] — 2026-07-19

### Added

- Project capsule for [backloggd-data-transfer](https://github.com/NemoKing1210/backloggd-data-transfer) (userscript) with Backloggd mark and copy in all locales

## [1.77.0] — 2026-07-16

### Added

- Project capsule for [github-gitfut](https://github.com/NemoKing1210/github-gitfut) (userscript) with GitHub mark and copy in all locales

## [1.76.0] — 2026-07-16

### Added

- Project capsule for [backloggd-plus](https://github.com/NemoKing1210/backloggd-plus) (userscript) with Backloggd mark and copy in all locales

## [1.75.2] — 2026-07-15

### Changed

- Steam audience (`?from=steam`) hides GitHub and ORCID in the Links panel

## [1.75.1] — 2026-07-15

### Removed

- Notion from Linktree hub platform chips

## [1.75.0] — 2026-07-15

### Added

- Audience query param `?from=` — presets hide sections, swap hero CTAs, tailor hero + About copy, and (for `steam`) drop game-cover balls instead of tech icons

## [1.74.1] — 2026-07-15

### Changed

- Music player toggle stays off-screen during primary bootstrap, then slides in when ready

## [1.74.0] — 2026-07-15

### Added

- Dynamic accent spotlight on music player toggle and sheet (pointer-follow + idle drift while playing)

## [1.73.1] — 2026-07-15

### Fixed

- Avatar speech CTA no longer blanks out mid hide — content stays through the leave fade

## [1.73.0] — 2026-07-15

### Added

- Console debug API for avatar speech (`window.speech`): templates, custom text/i18n, CTA actions, force-hide

## [1.72.1] — 2026-07-15

### Added

- Avatar speech CTA: optional `icon` (heroicons) and `tone` (`green` / `accent` / `hot` / `danger` / `muted`)

## [1.72.0] — 2026-07-15

### Added

- Avatar speech actions (CTA button in the bubble)
- After ~1 minute on site without radio, avatar offers “listen?” with a play button

## [1.71.1] — 2026-07-15

### Changed

- Music genres trimmed to Ambient, Chillout, Lo-fi, Classical; default is Lo-fi

## [1.71.0] — 2026-07-15

### Added

- Music player genre chips (Ambient, Chillout, Lo-fi, Jazz, Classical, Electronic, Synthwave, House, Rock, Metal); choice persists in localStorage

## [1.70.3] — 2026-07-15

### Changed

- Mobile: bug-report chip moves to the top-left of the viewport (clears music / nav dock)

## [1.70.2] — 2026-07-15

### Changed

- Mobile: bug-report chip sits higher above the nav dock and music player pill

## [1.70.1] — 2026-07-15

### Added

- Music player loading spinner / buffer bar while tuning or buffering a stream

### Changed

- Music player wave decor is a soft drifting SVG (less distracting)
- Player dock hides entirely when streams are unreachable (blocked network, all stations fail)

## [1.70.0] — 2026-07-15

### Changed

- Music player: bottom-center Steam dock — peek pill expands into a sliding sheet with EQ/wave/glow motion

## [1.69.1] — 2026-07-15

### Fixed

- Music player: Radio Browser fetch no longer hangs (timeouts, no CORS-preflight Accept); curated laut.fm fallbacks when streams fail

## [1.69.0] — 2026-07-15

### Added

- Ambient music player (Radio Browser API): play/pause, next station, volume; Steam-chrome FAB above the bug-report chip

## [1.68.12] — 2026-07-15

### Added

- Google Tag Manager (`GTM-MFXM7B25`) in the page shell

## [1.68.11] — 2026-07-15

### Changed

- Case `textBlind` lasts 15 seconds; a second Blindness drop while already blind cures it early

## [1.68.10] — 2026-07-15

### Changed

- Case “Open case” press: slam squash/pop, click ripple, sparks, and a short confetti burst

## [1.68.9] — 2026-07-15

### Added

- Case “Open case” button: gold breathe, sheen sweep, and stronger hover glow (respects reduced motion)

## [1.68.8] — 2026-07-15

### Added

- Avatar hover tip on the bug-report button (`hero.bugReportTip`)

## [1.68.7] — 2026-07-15

### Changed

- Case `profileTip` hints only locked achievements (`how`); leaves the loot pool once every achievement is unlocked

## [1.68.6] — 2026-07-15

### Changed

- Case `blockResize` (Size Chaos) can keep scaling already-resized blocks; each hit multiplies scale with no cap

## [1.68.5] — 2026-07-15

### Changed

- Case `lightFlash` (White Flash) leaves the loot pool after the light theme achievement is unlocked

## [1.68.4] — 2026-07-15

### Added

- Case `blockSwap` reward: shuffles profile sections in the main store shell (infinite-scroll clones untouched)

### Removed

- Case `titleGlitch` reward (tab title seizure)

## [1.68.3] — 2026-07-15

### Changed

- Case `alphabetCubes` scrolls to the hero only the first time per page load

## [1.68.2] — 2026-07-15

### Changed

- Case `emojiBalloons`: more balloons (~22–33) and a longer ~10s float

## [1.68.1] — 2026-07-15

### Changed

- Case `screenShake` reward lasts 10 seconds

### Fixed

- Light theme: case opener card no longer picks up a muddy gold wash; reel stays a dark CS well instead of blending with page background

## [1.68.0] — 2026-07-15

### Changed

- Links section: staggered reveals, brand-tint hover glow, sheen, and clearer press/hover motion on hub pills and link cards
- Theme and language menus: open/close transitions and micro-interactions
- Shared press feedback (`scale`) on links and buttons; `cursor: pointer` on buttons
- Avatar speech bubble uses a deeper accent fill for readable white text in all themes

## [1.67.2] — 2026-07-15

### Fixed

- Case `rickroll` plays in an on-page overlay (no popup / no blank-tab reservation); achievement unlocks when the dialog is closed

## [1.67.1] — 2026-07-15

### Fixed

- Case `rickroll` drop opens YouTube again (gesture-reserved tab; popup blockers were killing the post-spin `window.open`)

## [1.67.0] — 2026-07-15

### Added

- `window.caseOpen` console debug API (force reel drops, grant rewards, lock helpers) — mirror of `window.achievement`

## [1.66.2] — 2026-07-15

### Changed

- Avatar speech: faster typewriter, stronger bubble enter/leave, and a crossfade when the line is replaced while open

## [1.66.1] — 2026-07-15

### Changed

- Avatar speech also anchors to the hub card avatar (`hub-card__avatar`)

## [1.66.0] — 2026-07-15

### Changed

- Avatar speech anchors to the most visible profile avatar (hero, Letterboxd, Backloggd, Steam); falls back to the topbar brand when none are on screen

## [1.65.4] — 2026-07-15

### Changed

- Case reward `blockResize` scales blocks mildly (85%–115%)

## [1.65.3] — 2026-07-15

### Changed

- Case reward `textBlind` clears after 30 seconds

## [1.65.2] — 2026-07-15

### Changed

- Case opener blurb: clearer, less jargon-heavy copy in all locales

## [1.65.1] — 2026-07-15

### Changed

- Case jackpot copy: “Covert Drop” → localized “Gold Drop” / “Золотой дроп” (and equivalents)

## [1.65.0] — 2026-07-15

### Added

- Case reward `taunt`: mocks a missing gold drop / incomplete achievements, or gets sad if everything is unlocked

## [1.64.0] — 2026-07-15

### Added

- Case rewards `blockResize` (50–100 blocks change size) and `textBlind` (site text/UI blur)

## [1.63.4] — 2026-07-15

### Fixed

- Case opener: jackpot uses gold rarity color; Covert maps to red; reel snaps to the winner; Alpine no longer applies a stray `false` class

## [1.63.3] — 2026-07-15

### Changed

- Site lock reveals one PIN digit as a hint every 5 wrong guesses

## [1.63.2] — 2026-07-15

### Changed

- Site lock uses two single-digit inputs instead of one field and a keypad

## [1.63.1] — 2026-07-15

### Changed

- Site lock no longer displays the two-digit password on the overlay

## [1.63.0] — 2026-07-15

### Added

- Case reward `fakeJackpot`: looks like Covert Drop on the reel, celebrates with confetti, then reveals the bait

## [1.62.0] — 2026-07-15

### Added

- Case reward `siteLock`: full-screen overlay with a two-digit password (shown on the lock)

## [1.61.0] — 2026-07-15

### Added

- CS-style case opener under My Steam (weighted reel, joke drops, 1% Covert Drop achievement)
- New achievement `caseJackpot` (Covert Drop)

## [1.60.0] — 2026-07-15

### Changed

- Projects shelf: library rail, featured badge, richer capsule chrome, staggered reveal, and hover motion (shine, lift, status pulse)

## [1.59.4] — 2026-07-15

### Added

- Avatar speech tips on Letterboxd / Backloggd profile CTAs and Steam invite CTA (i18n)

## [1.59.3] — 2026-07-15

### Changed

- Avatar speech queue temporarily disabled (`SPEECH_QUEUE_ENABLED = false`); new lines replace the current tip immediately

## [1.59.2] — 2026-07-15

### Fixed

- Project `capsule__art` (and capsule hover / tags) adopt light-theme tokens instead of hard-coded Steam-dark fills

## [1.59.1] — 2026-07-15

### Changed

- Hero display name follows locale: Кирилл / Кирило / Kirill (ru / uk / en); other UI languages use Kirill

## [1.59.0] — 2026-07-15

### Changed

- Initial UI locale follows the browser (`navigator.languages`); fallback is English (was Russian)
- Saved locale preference in `localStorage` still wins over auto-detect

## [1.58.1] — 2026-07-15

### Changed

- Crawlable SEO (title, description, OG/Twitter, JSON-LD, noscript, heading fallbacks, OG image) is English
- Locale switch updates the browser tab title only — share/crawl meta stays English

## [1.58.0] — 2026-07-15

### Added

- SEO head: canonical, Open Graph, Twitter Card, Person JSON-LD, `robots.txt`, `sitemap.xml`, OG share image
- Static heading / skip-link fallbacks and `<noscript>` summary for crawlers
- Joke avatar tip on hero role hover («не только Frontend…» / i18n)
- Joke avatar tip on muted About badge «Backend по делу» (server lights off / i18n); other badges glow on hover like bulbs, Backend stays dark
- `achievement.addAll()` console helper grants every achievement (no toast spam)
- Shared Steam-style scrollbars (dark track / beveled thumb, light-theme tokens)
- Avatar speech queue: timed lines wait their turn (no interrupt / no duplicate identities)
- Avatar tip after 90s on the site if no achievements yet («А ты знал, что на сайте есть достижения?» / i18n)
- Achievement «Full Spawn» / «Полный спавн»: spawn every language flag, avatar, stack tech, and AI tool — effect auto-drops missing ones on later visits (no duplicates of already present bodies)
- More avatar speech beats while playing with hero physics objects (tips at 5 / 10 / 15 / 25 interactions)
- Avatar speech on language switcher hover and after changing locale
- Avatar speech on achievements / theme button hover; random quips when toggling light/dark theme
- Avatar speech on Activity block hover and when the grid starts rising
- Bounce + green/cyan glow flash on Activity cells when their level updates (WAAPI + visible overflow)
- Activity grid fill accelerates over time (shorter gaps + larger batches)
- Activity snake mini-game after the grid is maxed (hover prompt, WASD/arrows/swipe, win speech)
- Activity “all maxed” summary copy reframed as another overnight grind
- Overnight-grind activity summary only after beating the snake mini-game
- Achievement «Commit Hunter» for clearing the activity snake mini-game
- Achievement «Still Here» / «Засиделся» after five minutes of visible time on the site
- Achievements drawer swaps progress for praise when the full set is unlocked
- Topbar Online badge flips to Offline after 30s (not on hover); separate speech tip while still online
- Achievement «Wall Moderator» / «Модератор стены»: upvote every comment, then downvote deletes (toggleable effect)
- Achievement «Broke Everything» / «Всё сломал»: mine every major UI shell with the Minecraft pickaxe (infinite echo feed ignored / hidden while mining)
- Achievement «There Is a Bottom» / «Дно всё-таки есть»: catch the footer despite infinite scroll — it panics, jokes, then vanishes
- Comment wall enter / leave motion (staggered appear, red wipe on mod-delete)
- Comment reactions use like / dislike (thumbs + separate counts) instead of score voting
- Shared Steam-style achievement unlock toast + `window.achievement` console debug API
- Achievement toast animated gold glow / sheen on unlock (icon stays blue)
- Achievements topbar button gold pulse / trophy bounce on unlock
- Achievement unlock date shown in the achievements drawer (localized)
- Hero avatar hover tip («Ну давай кликни на меня!» / i18n) with stronger accent glow
- Per-achievement effect panel (slide-down tip + switch; hover on desktop, tap on mobile); disabling White Theme locks the theme toggle again

### Changed

- Hero physics body caps doubled (balls 56, AI 32, flags 24, avatars 16)
- ProxyChecker temporarily hidden from the projects shelf
- Mobile topbar docks to the bottom (thumb reach); menu / tips open upward; scroll-top and toasts sit above the bar
- Mobile topbar menu: Steam-style sheet, fade/slide open, staggered nav links

### Removed

- Avatar speech tips on project cards

### Fixed

- Favicon path respects GitHub Pages base `/profile/`
- `x-cloak` no longer hides the whole `<body>` (overlays only)
- Achievement toast is a focusable button
- Hero primary CTAs no longer use `rel="noopener"` without `target="_blank"`
- Avatar hover speech waits for the typewriter to finish, then holds ~1s before dismissing on mouseleave
- Achievements drawer list scrolls when the catalog is taller than the viewport
- Scroll reveal for panels fires earlier (lower threshold, positive bottom rootMargin)
- Avatar hover tips no longer flash while scrolling (cursor passes over tipped elements)
- Hero scroll blocked by Matter.js: remove `wheel` preventDefault; allow touch pan unless a body is grabbed
- Hero physics simulation pauses when `hero__physics` is off-screen
- About activity grid ticks only while the chart is in view
- Avatar speech bubble follows light theme tokens (no hard-coded Steam-dark fill)
- About activity chart / tip adopt light theme tokens
- Stack flip / explore / grow blocks adopt light theme tokens
- Interests intro, media shelves, and Steam invite adopt light theme tokens
- Comments wall / form adopt light theme tokens (plus / minus tones keep readable contrast)
- Hero light theme: softer banner wash, name/avatar shadows, chips and physics tiles
- Light-theme hero banner asset (`banner-light.svg`) instead of brightening the dark SVG
- Theme switch performance: shorter token morph, suppress per-node fades, opacity banner crossfade

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
