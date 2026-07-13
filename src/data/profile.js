/**
 * Locale-agnostic profile data.
 * Copy / UI strings live in src/i18n/locales/*.js
 */
const base = import.meta.env.BASE_URL;

const profile = {
  name: "Кирилл",
  handle: "@NemoKing1210",
  birthYear: 1999,
  /** Spoken languages shown in hero chips (locale codes). */
  spokenLanguages: ["ru", "en"],
  avatar: "https://github.com/NemoKing1210.png",
  banner: `${base}assets/images/banner.svg`,

  /** Featured social hub (Linktree). */
  hub: {
    id: "linktree",
    href: "https://linktr.ee/nemoking",
    handle: "@nemoking",
    platforms: [
      "telegram",
      "email",
      "discord",
      "whatsapp",
      "facebook",
      "github",
      "steam",
      "backloggd",
      "letterboxd",
      "notion",
    ],
  },

  /** Stack pillars: copy in locales, techs spawn hero balls by id (no overlap). */
  stackItems: [
    {
      id: "frontend",
      tone: "accent",
      mark: "vue",
      techs: ["html", "css", "vue", "nuxt", "vite", "alpine"],
    },
    {
      id: "backend",
      tone: "hot",
      mark: "node",
      techs: ["node", "laravel", "yii"],
    },
    {
      id: "languages",
      tone: "green",
      mark: "ts",
      techs: ["js", "ts", "php", "lua", "csharp"],
    },
  ],

  /** Highlight badges in About (labels live in locales). */
  aboutBadges: [
    { id: "craft", tone: "accent" },
    { id: "vue", tone: "accent" },
    { id: "ts", tone: "accent" },
    { id: "backend", tone: "accent" },
    { id: "ai", tone: "hot" },
    { id: "agents", tone: "hot" },
    { id: "remote", tone: "green" },
  ],

  /** AI / agent tooling highlighted in About. */
  aiTools: [
    { id: "cursor", label: "Cursor" },
    { id: "claude", label: "Claude" },
    { id: "codex", label: "Codex" },
    { id: "claudecode", label: "Claude Code" },
  ],

  projects: [
    {
      id: "steam-gamestatus",
      title: "steam-gamestatus",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-gamestatus",
      status: "public",
    },
    {
      id: "youtube-bot-comments-filter",
      title: "youtube-bot-comments-filter",
      tags: ["JavaScript", "Userscript", "YouTube"],
      url: "https://github.com/NemoKing1210/youtube-bot-comments-filter",
      status: "public",
    },
    {
      id: "ProxyChecker",
      title: "ProxyChecker",
      tags: ["TypeScript", "Desktop"],
      url: "https://github.com/NemoKing1210/ProxyChecker",
      status: "public",
    },
    {
      id: "steam-region-block-bypass",
      title: "steam-region-block-bypass",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-region-block-bypass",
      status: "public",
    },
  ],

  links: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/NemoKing1210",
    },
    {
      id: "linktree",
      label: "Linktree",
      href: "https://linktr.ee/nemoking",
    },
    {
      id: "letterboxd",
      label: "Letterboxd",
      href: "https://letterboxd.com/nemoking/",
    },
    {
      id: "orcid",
      label: "ORCID",
      href: "https://orcid.org/0009-0004-4232-676X",
    },
  ],

  media: {
    letterboxd: {
      href: "https://letterboxd.com/nemoking/",
      filmsWatched: 576,
      favorites: [
        "The Lord of the Rings: The Fellowship of the Ring (2001)",
        "The Lord of the Rings: The Two Towers (2002)",
        "The Lord of the Rings: The Return of the King (2003)",
        "The Avengers (2012)",
      ],
    },
  },

  nav: [
    { id: "about", href: "#about" },
    { id: "stack", href: "#stack" },
    { id: "projects", href: "#projects" },
    { id: "interests", href: "#interests" },
    { id: "links", href: "#links" },
    { id: "comments", href: "#comments" },
  ],
};

export default profile;
