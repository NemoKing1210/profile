# Profile Landing

Static personal profile page for **GitHub Pages** — no backend, no build step.

Steam Store–inspired dark UI powered by **[Alpine.js](https://alpinejs.dev/)** (CDN): about, stack, projects, interests, and links.

Owner: [NemoKing1210](https://github.com/NemoKing1210) (Кирилл).

## Quick start

1. Edit content in [`data/profile.js`](data/profile.js).
2. Replace placeholders in [`assets/images/`](assets/images/) (`avatar.svg`, `banner.svg`, `favicon.svg`).
3. Open [`index.html`](index.html) locally, or serve the folder:

```bash
# Python
python -m http.server 8080

# Node (if installed)
npx serve .
```

4. Push to a GitHub repo and enable **Pages** (Settings → Pages → Deploy from branch → `/` root).

For a user site (`username.github.io`), push this repo’s default branch and Pages will serve `index.html` at the root.

## Customize

| What | Where |
|------|--------|
| Name, bio, projects, links | `data/profile.js` |
| Visual system | `css/styles.css`, `DESIGN.md` |
| Markup + Alpine bindings | `index.html` |
| Alpine component / reveal | `js/main.js` |

Content is injected from `PROFILE` at runtime. Keep secrets out of this repo.

## Structure

```
├── index.html
├── css/styles.css
├── js/main.js
├── data/profile.js
├── assets/images/
├── README.md
├── DESIGN.md
├── AGENTS.md
├── CLAUDE.md
└── CONTRIBUTING.md
```

## Deploy (GitHub Pages)

1. Create a public repository (e.g. `username.github.io` or any repo with Pages enabled).
2. Push this project.
3. **Settings → Pages → Source:** Deploy from a branch → `main` → `/ (root)`.
4. Wait for the Pages build; open the published URL.

Optional: custom domain via repo Settings → Pages → Custom domain.

## License

Add a license if you publish the source. Content and personal assets remain yours.
