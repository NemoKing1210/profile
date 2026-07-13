# Contributing

Thanks for helping improve this profile site.

## Ground rules

- Keep the site **static** (Vite build → `dist/`) and GitHub Pages–friendly.
- Discuss large visual or structural shifts against [`DESIGN.md`](DESIGN.md).
- Prefer content changes in `src/data/profile.js` over hardcoding strings in HTML.

## Workflow

1. Fork / branch from `main`.
2. `npm install` && `npm run dev`.
3. Make a focused change; run `npm run build` before opening a PR.
4. Open a PR with a short summary of *why*.

## Releases / versioning

This repo uses **SemVer** (`package.json` → `version`) and **Keep a Changelog** ([`CHANGELOG.md`](CHANGELOG.md)).

When a PR ships a release-worthy change:

1. Bump `version` in `package.json`.
2. Add a dated section in `CHANGELOG.md` (`Added` / `Changed` / `Fixed` / `Removed`).
3. Clear or shrink `[Unreleased]` accordingly.

Do not bump the version without a changelog entry.

## Pull requests

- One concern per PR when possible.
- Note any new assets and their license/source.
- Do not commit secrets, `.env` files, or private contact details the owner did not ask to publish.

## Code style

- Match existing HTML/CSS/JS patterns.
- Keep CSS variables as the color/type source of truth.
- No drive-by reformatting of untouched files.
