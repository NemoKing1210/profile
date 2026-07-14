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
  spokenLanguages: ["ru", "uk", "en"],
  /** “Hello, world!” in each spoken language (chip tooltips; not UI-locale copy). */
  spokenHellos: {
    ru: "Привет, мир!",
    uk: "Привіт, світ!",
    en: "Hello, world!",
  },
  avatar: "https://github.com/NemoKing1210.png",
  banner: `${base}assets/images/banner.svg`,
  favicon: `${base}assets/images/favicon.svg`,

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
    { id: "frontend", tone: "accent" },
    { id: "details", tone: "accent" },
    { id: "ship", tone: "accent" },
    { id: "backend", tone: "muted" },
    { id: "ai", tone: "hot" },
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
      kind: "userscript",
      mark: "steam",
      tone: "steam",
      featured: true,
      tags: ["JavaScript", "Userscript", "Steam", "GameStatus"],
      url: "https://github.com/NemoKing1210/steam-gamestatus",
      status: "public",
    },
    {
      id: "steam-region-block-bypass",
      title: "steam-region-block-bypass",
      kind: "userscript",
      mark: "steam",
      tone: "steam",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-region-block-bypass",
      status: "public",
    },
    {
      id: "ProxyChecker",
      title: "ProxyChecker",
      kind: "desktop",
      mark: "electron",
      tone: "desktop",
      tags: ["TypeScript", "Electron", "React", "Desktop"],
      url: "https://github.com/NemoKing1210/ProxyChecker",
      status: "public",
    },
    {
      id: "youtube-bot-comments-filter",
      title: "youtube-bot-comments-filter",
      kind: "userscript",
      mark: "youtube",
      tone: "youtube",
      tags: ["JavaScript", "Userscript", "YouTube"],
      url: "https://github.com/NemoKing1210/youtube-bot-comments-filter",
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

  /**
   * Interests chrome (labels in locales).
   * Film / game art: vertical covers ~2:3 in `public/assets/images/{films,games}/`.
   */
  interests: {
    hobbies: [
      { id: "games", icon: "puzzlePiece", tone: "accent" },
      { id: "movies", icon: "film", tone: "accent" },
      { id: "anime", icon: "sparkles", tone: "hot" },
      { id: "series", icon: "tv", tone: "hot" },
      { id: "manga", icon: "bookOpen", tone: "green" },
    ],
  },

  media: {
    steam: {
      href: "https://steamcommunity.com/id/mrnemoking/",
      handle: "mrnemoking",
      name: "NemoKing",
      avatar:
        "https://avatars.akamai.steamstatic.com/4a8a0898fa1dc804fe5d6e870f838f5f95c1fe02_full.jpg",
    },
    backloggd: {
      href: "https://backloggd.com/u/NemoKing/",
      name: "NemoKing",
      avatar: "https://backloggd-avatars.b-cdn.net/hexhxddmx02ohfsx4bjveq99onqc",
      favorites: [
        {
          id: "dying-light",
          title: "Dying Light",
          year: 2015,
          cover: `${base}assets/images/games/dying-light-cover.jpg`,
          href: "https://backloggd.com/games/dying-light/",
        },
        {
          id: "terraria",
          title: "Terraria",
          year: 2011,
          cover: `${base}assets/images/games/terraria-cover.jpg`,
          href: "https://backloggd.com/games/terraria/",
        },
        {
          id: "minecraft",
          title: "Minecraft",
          year: 2011,
          cover: `${base}assets/images/games/minecraft-cover.jpg`,
          href: "https://backloggd.com/games/minecraft--1/",
        },
        {
          id: "roblox",
          title: "Roblox",
          year: 2006,
          tip: "programming",
          cover: `${base}assets/images/games/roblox-cover.jpg`,
          href: "https://backloggd.com/games/roblox/",
        },
        {
          id: "metro-exodus",
          title: "Metro Exodus",
          year: 2019,
          cover: `${base}assets/images/games/metro-exodus-cover.jpg`,
          href: "https://backloggd.com/games/metro-exodus/",
        },
      ],
      genres: [
        { id: "storyShooters", tone: "hot" },
        { id: "sandboxes", tone: "accent" },
        { id: "apocalypse", tone: "green" },
      ],
    },
    letterboxd: {
      href: "https://letterboxd.com/nemoking/",
      name: "Kirill",
      avatar:
        "https://a.ltrbxd.com/resized/avatar/upload/2/9/7/2/5/2/0/9/shard/avtr-0-220-0-220-crop.jpg?v=a12e6d8c43",
      favorites: [
        {
          id: "lotr-fellowship",
          title: "The Fellowship of the Ring",
          year: 2001,
          banner: `${base}assets/images/films/lotr-fellowship-banner.jpg`,
          href: "https://letterboxd.com/film/the-lord-of-the-rings-the-fellowship-of-the-ring/",
        },
        {
          id: "lotr-two-towers",
          title: "The Two Towers",
          year: 2002,
          banner: `${base}assets/images/films/lotr-two-towers-banner.jpg`,
          href: "https://letterboxd.com/film/the-lord-of-the-rings-the-two-towers/",
        },
        {
          id: "lotr-return",
          title: "The Return of the King",
          year: 2003,
          banner: `${base}assets/images/films/lotr-return-banner.jpg`,
          href: "https://letterboxd.com/film/the-lord-of-the-rings-the-return-of-the-king/",
        },
        {
          id: "avengers-2012",
          title: "The Avengers",
          year: 2012,
          banner: `${base}assets/images/films/avengers-2012-banner.jpg`,
          href: "https://letterboxd.com/film/the-avengers-2012/",
        },
      ],
      subgenres: [
        { id: "epicFantasy", tone: "accent" },
        { id: "superhero", tone: "hot" },
        { id: "adventure", tone: "accent" },
        { id: "sciFi", tone: "green" },
        { id: "animation", tone: "hot" },
        { id: "apocalypse", tone: "green" },
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
