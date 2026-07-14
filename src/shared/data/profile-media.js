/**
 * Media catalog data for interests shelves (Steam / Backloggd / Letterboxd).
 * Copy lives in locales; covers under public/assets/images/{films,games}/.
 */
const base = import.meta.env.BASE_URL;

export const profileMedia = {
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
        tip: "pickaxe",
        tipMode: "speech",
        cover: `${base}assets/images/games/minecraft-cover.jpg`,
        href: "https://backloggd.com/games/minecraft--1/",
      },
      {
        id: "roblox",
        title: "Roblox",
        year: 2006,
        tip: "programming",
        tipMode: "speech",
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
};
