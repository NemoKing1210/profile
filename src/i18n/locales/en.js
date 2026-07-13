export default {
  code: "en",
  nativeName: "English",
  meta: {
    description:
      "Kirill — frontend developer. Vue, Nuxt, TypeScript. Profile, stack, and projects.",
  },
  ui: {
    pageTitleSuffix: "Profile",
    skipToContent: "Skip to content",
    navLabel: "Primary navigation",
    langLabel: "Language",
    backToTop: "Back to top",
    footerNote: "Static profile · GitHub Pages",
    birthPrefix: "b.",
    bannerAlt: "banner",
    avatarAlt: "avatar",
    hobbies: "Hobbies",
    gameGenres: "Favorite game genres",
    projectsSubtitle: "Library — featured repositories",
  },
  spoken: {
    ru: "Russian",
    en: "English",
  },
  hero: {
    role: "Frontend developer",
    status: "Online",
    tagline:
      "I design interfaces that look great and feel effortless to use.",
    location: "Remote",
  },
  hub: {
    eyebrow: "Social hub",
    title: "Linktree",
    blurb:
      "Frontend developer specializing in clean UX and modern web design, with a focus on Vue/Nuxt. Sharing insights on gaming and web technologies.",
    cta: "Open Linktree",
    platformsLabel: "Also on",
    platforms: {
      telegram: "Telegram",
      email: "Email",
      discord: "Discord",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      github: "GitHub",
      steam: "Steam",
      backloggd: "Backloggd",
      letterboxd: "Letterboxd",
      notion: "Notion",
    },
  },
  letterboxd: {
    title: "Letterboxd",
    filmsWatched: "{count} films watched",
    favoritesLabel: "Favorites",
  },
  about: {
    title: "About",
    eyebrow: "Frontend-first · backend too",
    badgesLabel: "Highlights",
    lead:
      "I build interfaces where <mark class=\"about-hl\">craft</mark> and taste work together — fast, precise, and detail-obsessed.",
    paragraphs: [
      "I enjoy blending engineering with a visual, creative eye. I’m comfortable on the <strong>backend</strong> too (Node.js, PHP, Laravel, Yii2), but <mark class=\"about-hl\">frontend</mark> is where I thrive — more joy from the result and a sharper focus on UX.",
      "What drives me in IT is <strong>seeing results right away</strong> — an idea becomes a working product in front of you. Modern AI tooling helps me move faster without trading away code quality.",
    ],
    badges: {
      craft: "UI craft",
      vue: "Vue · Nuxt",
      ts: "TypeScript",
      backend: "Backend too",
      ai: "AI-native",
      agents: "AI agents",
      remote: "Remote-ready",
    },
    toolkitLabel: "AI & agents",
    toolkitBlurb:
      "Everyday stack for speeding up development, review, and design with neural networks.",
    spawnTool: "Add {name} to hero",
  },
  stack: {
    title: "Stack",
    eyebrow: "Focus & tools",
    techsLabel: "Technologies",
    spawnTech: "Add {name} to hero",
    growLabel: "Still learning",
    growBlurb:
      "I don’t stop at what’s already working: I try new approaches, read, ship pet projects, and carry what proves useful into production — the stack stays alive, not a frozen list.",
    growTagsLabel: "How I learn",
    growTags: ["Experiments", "Docs", "Pet projects", "Code review"],
    items: [
      {
        id: "frontend",
        label: "Frontend",
        detail:
          "Clear UI and a modern client stack: markup, Vue / Nuxt, Vite, and Alpine where it fits.",
      },
      {
        id: "backend",
        label: "Backend",
        detail:
          "Remote-first and autonomous — I can also ship APIs and services with Node, Laravel, and Yii2.",
      },
      {
        id: "languages",
        label: "Languages",
        detail:
          "Day-to-day TypeScript / JavaScript; also PHP, Lua, and C# when the project needs them.",
      },
    ],
  },
  projects: {
    title: "Projects",
    status: {
      public: "Public",
    },
    blurbs: {
      "steam-gamestatus":
        "Steam Store userscript: crack/Denuvo status badges powered by the GameStatus.info API.",
      "youtube-bot-comments-filter":
        "YouTube userscript: detects spam bots by nickname pattern and hides or blurs comments.",
      ProxyChecker:
        "Cross-platform desktop app for checking proxy availability and performance.",
      "steam-region-block-bypass":
        "Steam userscript: restores the product page when Steam shows a regional unavailability message.",
    },
  },
  interests: {
    title: "Interests",
    hobbies: ["Video games", "Movies", "Anime", "TV series", "Manga"],
    gameGenres: [
      "Story-driven shooters",
      "Sandboxes",
      "Post-apocalypse / zombies",
    ],
  },
  links: {
    title: "Links",
    hints: {
      github: "Code & repositories",
      linktree: "All socials in one place",
      letterboxd: "Films & lists",
      orcid: "Research profile",
    },
  },
  comments: {
    title: "Comments",
    wallLabel: "Comment wall",
    countLabel: "{count} comments",
    inviteTitle: "Leave yours",
    inviteBlurb:
      "I’d be really happy if you wrote something — honestly. Even one word would make my day.",
    nameLabel: "Name",
    namePlaceholder: "How should we introduce you",
    messageLabel: "Comment",
    messagePlaceholder: "+rep nice profile / -rep …",
    submit: "Send",
    sending: "Sending…",
    progressLabel: "Sending comment",
    progressHint: "Just a bit more… almost… almost…",
    progressStatuses: [
      "Connecting to the server…",
      "Checking spelling…",
      "Waiting on moderation…",
      "Waiting for the backend…",
      "Almost there…",
      "Just a tiny bit more…",
    ],
    feed: [
      {
        id: "clutch",
        author: "xX_AWP_God_Xx",
        tone: "plus",
        when: "2 days ago",
        body: "+rep good teammate clutch king",
      },
      {
        id: "parser",
        author: "ScrapLord2007",
        tone: "plus",
        when: "5 days ago",
        body: "+rep good expert at parsing bad sites",
      },
      {
        id: "cheater",
        author: "salty_potato",
        tone: "minus",
        when: "1 week ago",
        body: "-rep cheater wallhack confirmed !!!",
      },
      {
        id: "trade",
        author: "Skins4Days",
        tone: "plus",
        when: "2 weeks ago",
        body: "+rep fast trade smooth deal thank u",
      },
      {
        id: "carry",
        author: "midOrFeed",
        tone: "plus",
        when: "3 weeks ago",
        body: "+rep carried my ranked games absolute legend",
      },
      {
        id: "scam",
        author: "TrustNo1_Steam",
        tone: "minus",
        when: "1 month ago",
        body: "-rep tried to scam me with fake middleman",
      },
      {
        id: "css",
        author: "flexbox_enjoyer",
        tone: "plus",
        when: "1 month ago",
        body: "+rep fixed my CSS in 5 minutes god tier",
      },
      {
        id: "bait",
        author: "noobSlayer99",
        tone: "neutral",
        when: "2 months ago",
        body: "nice profile but still lost 16-4 lmao",
      },
    ],
  },
  nav: {
    about: "About",
    stack: "Stack",
    projects: "Projects",
    interests: "Interests",
    links: "Links",
    comments: "Comments",
  },
};
