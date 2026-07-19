/**
 * Locale-agnostic profile data.
 * Copy / UI strings live in src/shared/i18n/locales/
 */
import { profileMedia } from "./profile-media.js";

const base = import.meta.env.BASE_URL;

const profile = {
  name: "Кирилл",
  handle: "@NemoKing1210",
  /** Absolute site URL on GitHub Pages (SEO / OG / canonical). */
  siteUrl: "https://nemoking1210.github.io/profile/",
  ogImage: "https://nemoking1210.github.io/profile/assets/images/og.png",
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
  bannerLight: `${base}assets/images/banner-light.svg`,
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

  /** Technologies on the horizon — want to learn & try (copy in locales). */
  stackExplore: [
    { id: "svelte", tone: "hot", mark: "svelte" },
    { id: "solid", tone: "accent", mark: "solid" },
    { id: "go", tone: "green", mark: "go" },
  ],

  /** Highlight badges in About (labels live in locales). */
  aboutBadges: [
    { id: "frontend", tone: "accent" },
    { id: "details", tone: "accent" },
    { id: "ship", tone: "accent" },
    { id: "backend", tone: "muted", speechI18n: "about.badgeTips.backend" },
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

  /**
   * Semantic project shelves (order = UI section order).
   * Copy: locales `projects.groups.<id>`.
   */
  projectGroups: [
    { id: "steam", mark: "steam", tone: "steam" },
    { id: "backloggd", mark: "backloggd", tone: "backloggd" },
    { id: "github", mark: "github", tone: "github" },
    { id: "youtube", mark: "youtube", tone: "youtube" },
    { id: "bluesky", mark: "bluesky", tone: "bluesky" },
    { id: "tools", mark: "electron", tone: "desktop" },
  ],

  /**
   * Project type shelves when group-by = kind (order = UI section order).
   * Copy: locales `projects.kindGroups.<id>`.
   * `icon` → heroicons key for section chrome.
   */
  projectKinds: [
    { id: "userscript", tone: "userscript", icon: "codeBracket" },
    { id: "desktop", tone: "desktop", icon: "computerDesktop" },
    { id: "website", tone: "website", icon: "globeAlt" },
  ],

  projects: [
    {
      id: "steam-gamestatus",
      title: "steam-gamestatus",
      group: "steam",
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
      group: "steam",
      kind: "userscript",
      mark: "steam",
      tone: "steam",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-region-block-bypass",
      status: "public",
    },
    {
      id: "backloggd-plus",
      title: "backloggd-plus",
      group: "backloggd",
      kind: "userscript",
      mark: "backloggd",
      tone: "backloggd",
      tags: ["JavaScript", "Userscript", "Backloggd", "Steam"],
      url: "https://github.com/NemoKing1210/backloggd-plus",
      status: "public",
    },
    {
      id: "backloggd-data-transfer",
      title: "backloggd-data-transfer",
      group: "backloggd",
      kind: "userscript",
      mark: "backloggd",
      tone: "backloggd",
      tags: ["JavaScript", "Userscript", "Backloggd", "Import"],
      url: "https://github.com/NemoKing1210/backloggd-data-transfer",
      status: "public",
    },
    {
      id: "github-gitfut",
      title: "github-gitfut",
      group: "github",
      kind: "userscript",
      mark: "github",
      tone: "github",
      tags: ["JavaScript", "Userscript", "GitHub", "GitFut"],
      url: "https://github.com/NemoKing1210/github-gitfut",
      status: "public",
    },
    {
      id: "youtube-bot-comments-filter",
      title: "youtube-bot-comments-filter",
      group: "youtube",
      kind: "userscript",
      mark: "youtube",
      tone: "youtube",
      tags: ["JavaScript", "Userscript", "YouTube"],
      url: "https://github.com/NemoKing1210/youtube-bot-comments-filter",
      status: "public",
    },
    {
      id: "bluesky-translator",
      title: "bluesky-translator",
      group: "bluesky",
      kind: "userscript",
      mark: "bluesky",
      tone: "bluesky",
      tags: ["JavaScript", "Userscript", "Bluesky", "i18n"],
      url: "https://github.com/NemoKing1210/bluesky-translator",
      status: "public",
    },
    {
      id: "ProxyChecker",
      title: "ProxyChecker",
      group: "tools",
      kind: "desktop",
      mark: "electron",
      tone: "desktop",
      tags: ["TypeScript", "Electron", "React", "Desktop"],
      url: "https://github.com/NemoKing1210/ProxyChecker",
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

  media: profileMedia,

  /**
   * Radio Browser music player.
   * `genres[].tags` are Radio Browser tags; `fallback: true` keeps laut.fm streams.
   */
  musicPlayer: {
    defaultGenre: "lofi",
    limit: 18,
    genres: [
      { id: "ambient", tags: ["ambient"], fallback: true },
      { id: "chillout", tags: ["chillout"], fallback: true },
      { id: "lofi", tags: ["lofi"], fallback: true },
      { id: "classical", tags: ["classical"] },
    ],
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
