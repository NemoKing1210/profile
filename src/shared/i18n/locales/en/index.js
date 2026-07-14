import commentsFeed from "./comments-feed.js";

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
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langLabel: "Language",
    langHoverTip: "Want to talk to me in another language?",
    langSwitched:
      "Nice! Now let's see if I don't tangle up the translations…",
    achievementsHoverTip:
      "Trophy cabinet? Take a peek — just don’t brag too loud.",
    themeHoverTip: "Light or dark — pick a side. I’m ready.",
    themeHoverTipLocked:
      "That theme button looks tempting… but the secret isn’t unlocked yet.",
    themeToLightTips: [
      "Ahh, my eyes! Fine, I’ll adapt… probably.",
      "White background on. Vampires disapprove.",
      "Sunlight in the UI? Bold. Sunglasses not included.",
      "Light theme. Now you can see the dust on the design.",
    ],
    themeToDarkTips: [
      "Dark side’s back. Easier to read at night.",
      "Back to normal. Steam likes it this way too.",
      "Lights out. Your retinas say thanks.",
      "Dark again. Feels like the profile exhaled.",
    ],
    themeToggle: "Toggle theme",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    themeDeniedTitle: "No light theme",
    themeDenied:
      "I don’t like it — it burns my eyes at night. Come to the dark side of the Force: Sith UX stays dark too.",
    backToTop: "Back to top",
    footerNote: "Static profile · GitHub Pages",
    footerFoundLead: "Hey… how did you find me?",
    footerFoundPunch:
      "There’s supposed to be infinite scroll here. Fine — you win. I’m out.",
    birthPrefix: "b.",
    bannerAlt: "banner",
    avatarAlt: "avatar",
    spawnAvatar: "Add avatar to hero",
    hobbies: "Hobbies",
    gameGenres: "Favorite game genres",
    projectsSubtitle: "Library — userscripts & desktop",
    infiniteMarks: [
      "Footer? Never heard of it",
      "The hallway repeats",
      "The lights hum louder",
      "Smell of damp wallpaper",
      "Level 0",
      "No exit",
      "You’ve been here before",
      "Don’t look back",
      "The scroll never ends",
      "I can’t find the bottom either",
      "Another section? Really?",
      "The profile looped again",
      "I think we’re stuck",
      "Was this above… or below?",
      "The yellow wallpaper is watching",
      "The silence here is too loud",
      "Don’t trust the sitemap",
      "End of page is a myth",
      "Stepping back changes nothing",
      "Something follows you in the feed",
      "The wallpaper is breathing a little",
      "Save progress? Just kidding.",
      "Still reading the bio?",
      "No way home — only scroll",
      "Got enough RAM for this?",
    ],
    mineToast: "Pickaxe ready · Hold LMB to mine UI · Esc to put away",
    scrollTopEchoTease:
      "Sure you don’t want to look a little deeper? Who knows — maybe a gift is waiting at the very edge of the feed.",
  },
  echoFinale: {
    dialogLabel: "Infinite scroll finale",
    eyebrow: "Level 99",
    praiseTitle: "You actually made it",
    praiseBody:
      "Such a long, stubborn trek through the endless feed deserves a reward. Open the gift — there’s something special inside.",
    giftLabel: "Open gift",
    achievementEyebrow: "Achievement unlocked",
    achievementTitle: "White Theme",
    achievementBody: "The light theme is now available on your profile.",
    giftJokeLead: "Thought there’d be a footer in the gift?",
    giftJokePunch: "It wouldn’t fit in here… and it’s too late to go looking.",
    restart: "Start the journey again",
  },
  achievements: {
    buttonLabel: "Achievements",
    panelTitle: "Achievements",
    listLabel: "Unlocked achievements",
    closeLabel: "Close",
    unlockedAt: "Unlocked: {date}",
    progressCaption: "Progress",
    progressLabel: "{done} / {total}",
    progressPraise: "Every achievement unlocked. Legend.",
    effectToggleLabel: "Achievement effect",
    toastEyebrow: "Achievement unlocked",
    items: {
      lightTheme: {
        title: "White Theme",
        how: "Reach loop 99 of the infinite feed and open the gift.",
        effect: "Lets you switch the profile to the light theme",
      },
      activitySnake: {
        title: "Commit Hunter",
        how: "Fill the activity grid, then eat every square with the snake.",
        effect: "Honorary title. The GitHub contribution graph is nervous.",
      },
      longStay: {
        title: "Still Here",
        how: "Spend more than five minutes on the site.",
        effect: "Honorary title. Time flies when you're scrolling.",
      },
      commentMod: {
        title: "Wall Moderator",
        how: "Like every comment on the wall.",
        effect: "Disliking a comment removes it from the wall",
      },
      interfaceMine: {
        title: "Broke Everything",
        how: "Grab the diamond pickaxe from the Minecraft cover and mine the header, hero, and every section.",
        effect: "Honorary title. The designer is crying; you're having fun.",
      },
      foundFooter: {
        title: "There Is a Bottom",
        how: "Reach the footer despite the infinite feed.",
        effect: "Honorary title. The footer panicked and bailed.",
      },
    },
  },
  spoken: {
    ru: "Russian",
    uk: "Ukrainian",
    en: "English",
    ja: "Japanese",
  },
  hero: {
    role: "Frontend developer",
    status: "Online",
    statusOffline: "Offline",
    statusOnlineTip: "I'm still here — did you want something?",
    statusLastSeen: "Last online: 1 Jan 1970, 00:00:00",
    nameTip: "That's my name, in case it wasn't clear",
    avatarTip: "Come on, click me!",
    locationTip: "I'm in the Matrix and can't come to your office",
    birthTip: "Yes, I'm a Zoomer — so what?",
    playEnough:
      "Still not done playing? Maybe check out the rest of my profile?",
    playAlong: "Looks fun — I'll jump in and play with you!",
    metaLabel: "Location, languages, and birth year",
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
    platformsLabel: "On Linktree",
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
    about:
      "Letterboxd is a social network for film lovers: a watch diary, ratings, lists, and discussion.",
    favoritesLabel: "Favorites",
    openProfile: "Profile",
    subgenresLabel: "Favorite subgenres",
    tips: {
      fellowship:
        "“All we have to decide is what to do with the time that is given to us.” — Gandalf",
      twoTowers:
        "“I can't carry it for you, but I can carry you!” — Sam",
      returnKing: "“My friends, you bow to no one.” — Aragorn",
      avengers: "“Avengers… assemble!” — Captain America",
    },
    subgenres: {
      epicFantasy: "Epic fantasy",
      superhero: "Superhero",
      adventure: "Adventure",
      sciFi: "Sci-fi",
      animation: "Animation",
      apocalypse: "Post-apocalypse",
    },
  },
  backloggd: {
    title: "Backloggd",
    about:
      "Backloggd is Letterboxd for games: a play journal, ratings, backlog, and lists.",
    favoritesLabel: "Favorites",
    openProfile: "Profile",
    genresLabel: "Favorite genres",
    tips: {
      programming: "This game is why I fell in love with programming",
      pickaxe: "Psst — try clicking. I've got a pickaxe waiting for you.",
      atmosphere:
        "Stunning atmosphere and story — post-apocalypse that still feels human.",
      nightParkour:
        "Night rooftops with a flashlight — my favorite kind of downtime.",
      pixelsDig: "Another sandbox. Pixels dig too.",
    },
    genres: {
      storyShooters: "Story-driven shooters",
      sandboxes: "Sandboxes",
      apocalypse: "Post-apocalypse / zombies",
    },
  },
  steam: {
    title: "Steam",
    inviteTitle: "My Steam",
    about:
      "Steam is Valve’s game platform: library, friends, multiplayer, and community.",
    invite:
      "I play a lot, and I enjoy it. On Steam — the library, friends, and the games I actually come back to.",
    cta: "Open Steam profile",
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
      frontend: "Frontend first",
      details: "Detail-obsessed",
      ship: "Idea → UI",
      backend: "Backend when needed",
      ai: "AI in the loop",
      remote: "Remote-friendly",
    },
    statusLabel: "Availability",
    statusWorkBadge: "Closed",
    statusWork: "Not looking for work",
    statusWorkNote: "Job inbox on pause — shipping and calm code matter more.",
    statusWorkDenied: "Well, maybe for a cake I'd say yes...",
    statusHappyBadge: "Open",
    statusHappy: "Always looking for happiness",
    statusHappyNote: "Offers welcome: coffee, memes, delightful DX.",
    statusPunch: "No résumé attached. Good vibes required.",
    activity: {
      label: "Activity",
      eyebrow: "over the last year",
      summary: "{count} contributions in the last year",
      summaryDone: "Sigh… Back to grinding through the nights again…",
      less: "Less",
      more: "More",
      chartAria: "Activity map for the last year: {count} contributions",
      tipTemplate: "{date}: {tip}",
      hoverTip:
        "Contribution map. Don’t ask what’s in those commits — half are “fix fix”.",
      startSpeech:
        "Whoa, the squares woke up! Someone’s shipping “fix fix” again…",
      playHoverTip: "Want to help refresh the activity?",
      playStartSpeech: "Snake’s on the grid. Arrows / WASD / swipe — Esc to quit.",
      playWinSpeech:
        "Activity refreshed… well, technically eaten. GitHub can’t do that.",
      playSummary: "Snake · eat every square",
      playHint: "Arrows / WASD / swipe · Esc",
      days: { mon: "Mon", wed: "Wed", fri: "Fri" },
      tips: [
        "Fixed a typo in the README",
        "Renamed variable to variableFinal2",
        "npm install (again)",
        "Stared at DevTools for five minutes",
        "Commit message: “fix fix”",
        "Added a TODO for later",
        "Switched VS Code tabs",
        "Nudged margin by 1px",
        "Ran Prettier on the whole repo",
        "Googled why it doesn’t work",
        "Removed console.log (the wrong one)",
        "Bumped a dependency “just in case”",
        "Wrote // temp and forgot",
        "Rebased for a prettier history",
        "Opened Stack Overflow on reflex",
        "Centered a div (margin: auto)",
        "Won a z-index layer war",
        "Added !important “temporarily”",
        "Aligned to the grid by eye",
        "Fixed Chrome, broke Safari",
        "Renamed a file for the vibes",
        "Removed a border, then put it back",
        "Shipped a hover nobody will notice",
        "Changed the color to #66c0f4 and back",
        "Waited for npm audit to shut up",
        "Closed 12 MDN tabs",
        "Wrote CSS without :has()",
        "Set display: flex and hoped",
        "Moved a pixel right, then left",
        "Updated the lockfile “by accident”",
      ],
    },
  },
  stack: {
    title: "Stack",
    eyebrow: "Focus & tools",
    techsLabel: "Technologies",
    spawnTech: "Add {name} to hero",
    toolkitLabel: "AI & agents",
    toolkitBlurb:
      "Everyday stack for speeding up development, review, and design with neural networks.",
    aiSpeech:
      "Yes, I use AI — but in moderation: a boost for speed, not a substitute for thinking.",
    flipSpeech:
      "React spins nicely… but I prefer living on Vue.",
    spawnTool: "Add {name} to hero",
    exploreLabel: "Want to learn",
    exploreBlurb:
      "The stack doesn’t end with what’s already in production. Below are directions I’m itching to explore hands-on: compare them with familiar Vue, feel another reactivity model, and stretch beyond the frontend comfort zone.",
    exploreSpeech: "On the horizon — Svelte, Solid, and Go. Hands are itching.",
    exploreItems: [
      {
        id: "svelte",
        badge: "Compile-time, not runtime",
        label: "Svelte & SvelteKit",
        detail:
          "I want to feel a framework where reactivity is born at build time: less browser magic, cleaner markup, that “write it and it just works” feeling. SvelteKit is next to it — so I can ship a full app, not components in a vacuum.",
      },
      {
        id: "solid",
        badge: "Fine-grained reactivity",
        label: "SolidJS",
        detail:
          "Intriguing as an alternative to “virtual DOM for everything”: granular updates, close to signals. Worth understanding how Solid differs from Vue — and what of that precision is worth carrying into day-to-day work.",
      },
      {
        id: "go",
        badge: "Simplicity in production",
        label: "Go",
        detail:
          "A language with a clear syntax and a strong services culture: fast binaries, goroutines, honest concurrent code. I’d like to write backends that deploy as “one file” without a heavy runtime — a contrast to familiar Node and PHP.",
      },
    ],
    growLabel: "Still learning",
    growBlurb:
      "I don’t stop at what’s already working: I try new approaches, read, ship pet projects, and carry what proves useful into production — the stack stays alive, not a frozen list.",
    growSpeech: "Learning out loud: experiments, docs, pet projects.",
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
    favoriteFlip: {
      ariaLabel:
        "Joke card: React on the front, Vue on the back. It flips as you scroll closer.",
      frontBadge: "Favorite library",
      frontLabel: "React",
      frontDetail:
        "My favorite library: components, hooks, and a living ecosystem. It’s where I started — and it still hits different.",
      backBadge: "Favorite framework",
      backLabel: "Vue",
      backDetail:
        "Alright, you caught me: my favorite framework is Vue / Nuxt. Clean DX, a clear template model, and the stack I actually ship in production.",
    },
  },
  projects: {
    title: "Projects",
    openCta: "Open on GitHub",
    notice:
      "Starting small for now — userscripts and pet projects. Bigger things are ahead.",
    status: {
      public: "Public",
    },
    kinds: {
      userscript: "Userscript",
      desktop: "Desktop",
    },
    blurbs: {
      "steam-gamestatus":
        "Userscript for Steam Store & Community: protection, dates, scores, and hardware badges on game cards — without leaving the page. Powered by GameStatus.info with caching and a settings panel.",
      "steam-region-block-bypass":
        "Steam Store userscript: when you hit “unavailable in your region”, it restores a guest product page and optional guest search. Steam-styled settings plus a proxy gateway for IP locks.",
      ProxyChecker:
        "Electron + React desktop app for checking HTTP/SOCKS/MTProto proxies: batches, groups, geo hints, export, and sync via GitHub Gist / Google Drive.",
      "youtube-bot-comments-filter":
        "YouTube userscript: flags spam bots by nickname pattern and hides or blurs comments. Hide/blur toggle sits in the comments header — no separate settings page.",
    },
    highlights: {
      "steam-gamestatus": [
        "Badges on listings and game pages",
        "Steam-like tooltips with scores & specs",
        "Cache, lazy load, and 10 UI languages",
      ],
      "steam-region-block-bypass": [
        "Restore pages via anonymous guest fetch",
        "Guest search suggestions + optional /search",
        "Region Bypass panel + local proxy gateway",
      ],
      ProxyChecker: [
        "HTTP, SOCKS4/5, and MTProto protocols",
        "Groups, favorites, tray, and auto-update",
        "Encrypted sync and local backups",
      ],
      "youtube-bot-comments-filter": [
        "Weighted nickname rule engine",
        "Hide / blur modes with saved preference",
        "Styled for YouTube light and dark",
      ],
    },
  },
  interests: {
    title: "Interests",
    blurb:
      "Besides programming, I love films, video games, anime, TV series, and manga — anything that tells a good story on screen.",
    hobbies: {
      games: "Video games",
      movies: "Movies",
      anime: "Anime",
      series: "TV series",
      manga: "Manga",
    },
    hobbySpeech: {
      anime: "Yes, I watch. No, the plot isn’t “padded” — life just is.",
      manga: "Panels instead of frames. Same love for a good story.",
    },
  },
  links: {
    title: "Links",
    directLabel: "Direct links",
    hints: {
      github: "Code & repositories",
      linktree: "All socials in one place",
      letterboxd: "Films & lists",
      orcid: "Research profile",
    },
    speechTips: {
      orcid: "Academic profile — no Minecraft raid papers. Yet.",
    },
  },
  comments: {
    feed: commentsFeed,
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
    minusRepTitle: "Moderation is disappointed",
    minusRepHint:
      "No bad comments allowed. Only kind words and +rep. Sit with that for {seconds}s and think happy thoughts.",
    submit: "Send",
    sending: "Sending…",
    progressLabel: "Sending comment",
    finaleTitle: "Server error",
    progressStatuses: [
      "Connecting to the server…",
      "Checking spelling…",
      "Waiting on moderation…",
      "Waiting for the backend…",
      "Almost there…",
      "Just a tiny bit more…",
    ],
    spoofWhen: "just now",
    spoilerHint: "Hover to reveal",
    reactLabel: "Comment reaction",
    voteUp: "Like",
    voteDown: "Dislike",
    voteDelete: "Delete comment",
    sortLabel: "Sort",
    sortTop: "Top",
    sortNew: "New",
    sortControversial: "Controversial",
    socialCreditReward: "+783994 social credit",
    socialCreditPenalty: "−783994 social credit",
    farmRaidReplies: [
      "Пошел пить кофе, буду через 3 часа",
      "Отошел покормить кошек, прийду минимум через 12 часов 20 минут",
      "Потопал в магазин. Ждите меня с первым лучом солнца, я приду на пятый день, с востока",
      "Не ждите",
    ],
    spoofBodies: [
      "+rep mid diff huge, carry machine",
      "-rep this ||comfiest duo partner in EU||",
      "+rep clutch god, I drop for you anytime",
      "bro typed faster than my ping, insane",
      "+rep trusted trader, no scam energy",
    ],
    waitTaunts: [
      { at: 30, text: "Still here…?" },
      {
        at: 45,
        text: "I don’t think your comment will pass moderation…",
      },
      { at: 60, text: "Looks like just a tiny bit left…" },
      { at: 75, text: "You’re a patient one — keep waiting, keep waiting…" },
      {
        at: 90,
        text: "Our server is slow and there are lots of visitors, sorry…",
      },
      {
        at: 105,
        text: "We scaled the servers — your request is almost processed…",
      },
      {
        at: 120,
        text: "Hope solar radiation won’t affect your comment…",
      },
      { at: 135, text: "I’m already reading the bytes of your comment…" },
      {
        at: 150,
        text: "Server error. Reason: we don’t have a server :( But hey, you’re still here — have some confetti. You can try sending again; maybe by then I’ll have a server — and you’ll get confetti either way :)",
      },
    ]
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
