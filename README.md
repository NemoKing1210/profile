# Profile Landing

Personal profile site for **GitHub Pages**, built with **Vite** + **Alpine.js**.

Steam Store–inspired dark UI. Source stays modular; production ships a bundled `dist/`.

Owner: [NemoKing1210](https://github.com/NemoKing1210) (Кирилл).  
Live (after Pages setup): https://nemoking1210.github.io/profile/

## Quick start

```bash
npm install
npm run dev      # local: http://localhost:5173/profile/
npm run build    # → dist/
npm run preview  # preview production build
```

## Customize

| What | Where |
|------|--------|
| Name, bio, projects, links | `src/data/profile.js` + `src/i18n/locales/*` |
| Translations (ru/en/es/de/zh) | `src/i18n/locales/` |
| Section HTML blocks | `src/partials/*.html` |
| Page shell / order of blocks | `index.html` (`{{> name }}`) |
| Alpine component | `src/alpine/profile-page.js` |
| Styles (split by section) | `src/styles/*.css` |
| Static images | `public/assets/images/` |
| Vite / Pages / Handlebars | `vite.config.js` |

## Structure

```
├── index.html                 # shell + {{> partial }}
├── vite.config.js             # Vite + vite-plugin-handlebars
├── package.json
├── public/assets/images/
├── src/
│   ├── main.js
│   ├── data/profile.js
│   ├── alpine/
│   ├── partials/              # topbar, hero, about, …
│   └── styles/
├── dist/
└── .github/workflows/deploy.yml
```

## Deploy (GitHub Pages)

1. Push to `main` (workflow builds and publishes `dist`).
2. Repo **Settings → Pages → Source:** **GitHub Actions** (not “Deploy from a branch”).
3. Open https://nemoking1210.github.io/profile/

If the repo name changes, update `base` in `vite.config.js` to match (`/new-name/`).

## License

Add a license if you publish the source. Content and personal assets remain yours.
