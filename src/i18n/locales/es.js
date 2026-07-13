export default {
  code: "es",
  nativeName: "Español",
  meta: {
    description:
      "Kirill — desarrollador frontend. Vue, Nuxt, TypeScript. Perfil, stack y proyectos.",
  },
  ui: {
    pageTitleSuffix: "Perfil",
    skipToContent: "Ir al contenido",
    navLabel: "Navegación principal",
    langLabel: "Idioma",
    backToTop: "Volver arriba",
    footerNote: "Static profile · GitHub Pages",
    birthPrefix: "n.",
    bannerAlt: "banner",
    avatarAlt: "avatar",
    hobbies: "Aficiones",
    gameGenres: "Géneros de juegos favoritos",
    projectsSubtitle: "Biblioteca — repositorios destacados",
  },
  spoken: {
    ru: "Ruso",
    en: "Inglés",
  },
  hero: {
    role: "Desarrollador frontend",
    status: "Online",
    tagline:
      "Diseño interfaces que se ven bien y son cómodas de usar.",
    location: "Remoto",
  },
  hub: {
    eyebrow: "Hub social",
    title: "Linktree",
    blurb:
      "Desarrollador frontend especializado en UX limpia y diseño web moderno, con foco en Vue/Nuxt. Comparto ideas sobre gaming y tecnologías web.",
    cta: "Abrir Linktree",
    platformsLabel: "También en",
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
    filmsWatched: "{count} películas",
    favoritesLabel: "Favoritos",
  },
  about: {
    title: "Sobre mí",
    eyebrow: "Frontend-first · también backend",
    badgesLabel: "Destacados",
    lead:
      "Construyo interfaces donde la <mark class=\"about-hl\">técnica</mark> y el gusto trabajan juntos: rápido, preciso y con ojo para el detalle.",
    paragraphs: [
      "Me gusta unir ingeniería con una mirada visual y creativa. También me desenvuelvo en el <strong>backend</strong> (Node.js, PHP, Laravel, Yii2), pero el <mark class=\"about-hl\">frontend</mark> es lo mío: más disfrute del resultado y foco en la UX.",
      "En IT me mueve <strong>ver el resultado al instante</strong>: una idea se convierte en producto delante de ti. El tooling de IA me ayuda a iterar más rápido sin renunciar a la calidad del código.",
    ],
    badges: {
      craft: "UI craft",
      vue: "Vue · Nuxt",
      ts: "TypeScript",
      backend: "También backend",
      ai: "AI-native",
      agents: "Agentes IA",
      remote: "Remote-ready",
    },
    toolkitLabel: "IA y agentes",
    toolkitBlurb:
      "Stack diario para acelerar desarrollo, revisión y diseño junto a redes neuronales.",
    spawnTool: "Añadir {name} al hero",
  },
  stack: {
    title: "Stack",
    eyebrow: "Enfoque y herramientas",
    techsLabel: "Tecnologías",
    spawnTech: "Añadir {name} al hero",
    growLabel: "En movimiento",
    growBlurb:
      "No me quedo en lo ya logrado: pruebo enfoques nuevos, leo, hago pet projects y llevo lo útil a producción — el stack está vivo, no es una lista congelada.",
    growTagsLabel: "Cómo aprendo",
    growTags: ["Experimentos", "Docs", "Pet projects", "Code review"],
    items: [
      {
        id: "frontend",
        label: "Frontend",
        detail:
          "UI claras y stack de cliente moderno: maquetación, Vue / Nuxt, Vite y Alpine cuando encaja.",
      },
      {
        id: "backend",
        label: "Backend",
        detail:
          "Remoto y autonomía — también APIs y servicios con Node, Laravel y Yii2.",
      },
      {
        id: "languages",
        label: "Lenguajes",
        detail:
          "Día a día TypeScript / JavaScript; también PHP, Lua y C# según el proyecto.",
      },
    ],
  },
  projects: {
    title: "Proyectos",
    status: {
      public: "Public",
    },
    blurbs: {
      "steam-gamestatus":
        "Userscript de Steam Store: insignias de estado crack/Denuvo con la API de GameStatus.info.",
      "youtube-bot-comments-filter":
        "Userscript de YouTube: detecta bots de spam por el patrón del nick y oculta o difumina comentarios.",
      ProxyChecker:
        "Aplicación de escritorio multiplataforma para comprobar disponibilidad y rendimiento de proxies.",
      "steam-region-block-bypass":
        "Userscript de Steam: restaura la ficha del producto cuando aparece el bloqueo regional.",
    },
  },
  interests: {
    title: "Intereses",
    hobbies: ["Videojuegos", "Películas", "Anime", "Series", "Manga"],
    gameGenres: [
      "Shooters con historia",
      "Sandboxes",
      "Postapocalipsis / zombis",
    ],
  },
  links: {
    title: "Enlaces",
    hints: {
      github: "Código y repositorios",
      linktree: "Todas las redes en un solo lugar",
      letterboxd: "Películas y listas",
      orcid: "Perfil científico",
    },
  },
  comments: {
    title: "Comentarios",
    wallLabel: "Muro de comentarios",
    countLabel: "{count} comentarios",
    inviteTitle: "Deja el tuyo",
    inviteBlurb:
      "Me haría mucha ilusión que escribieras algo — de verdad. Hasta una sola palabra ya es fiesta.",
    nameLabel: "Nombre",
    namePlaceholder: "Cómo presentarte",
    messageLabel: "Comentario",
    messagePlaceholder: "+rep nice profile / -rep …",
    submit: "Enviar",
    sending: "Enviando…",
    progressLabel: "Enviando comentario",
    finaleTitle: "Error del servidor",
    progressStatuses: [
      "Conectando al servidor…",
      "Revisando la ortografía…",
      "Esperando la moderación…",
      "Esperando al backend…",
      "Casi listo…",
      "Solo un poquito más…",
    ],
    spoofWhen: "ahora mismo",
    spoofBodies: [
      "+rep mid diff huge, carry machine",
      "-rep baited me into 1v5 and left voice",
      "+rep clutch god, I drop for you anytime",
      "bro typed faster than my ping, insane",
      "+rep trusted trader, no scam energy",
    ],
    waitTaunts: [
      { at: 30, text: "¿Sigues aquí…?" },
      {
        at: 45,
        text: "No creo que tu comentario pase la moderación…",
      },
      { at: 60, text: "Parece que queda muy poquito…" },
      { at: 75, text: "Eres paciente: sigue esperando, sigue esperando…" },
      {
        at: 90,
        text: "Nuestro servidor es lento y hay mucha gente, perdona…",
      },
      {
        at: 105,
        text: "Ampliamos los servidores: tu petición casi está lista…",
      },
      {
        at: 120,
        text: "Espero que la radiación solar no afecte a tu comentario…",
      },
      { at: 135, text: "Ya estoy leyendo los bytes de tu comentario…" },
      {
        at: 150,
        text: "Error en el servidor. Motivo: no tenemos servidor :( Pero qué crack por seguir aquí — toma confeti. Puedes intentarlo otra vez; quizás para entonces ya tenga un servidor, y de todas formas te llevas confeti :)",
      },
    ],
    feed: [
      {
        id: "clutch",
        author: "xX_AWP_God_Xx",
        tone: "plus",
        when: "hace 2 días",
        body: "+rep good teammate clutch king",
      },
      {
        id: "parser",
        author: "ScrapLord2007",
        tone: "plus",
        when: "hace 5 días",
        body: "+rep good expert at parsing bad sites",
      },
      {
        id: "cheater",
        author: "salty_potato",
        tone: "minus",
        when: "hace 1 semana",
        body: "-rep cheater wallhack confirmed !!!",
      },
      {
        id: "trade",
        author: "Skins4Days",
        tone: "plus",
        when: "hace 2 semanas",
        body: "+rep fast trade smooth deal thank u",
      },
      {
        id: "carry",
        author: "midOrFeed",
        tone: "plus",
        when: "hace 3 semanas",
        body: "+rep carried my ranked games absolute legend",
      },
      {
        id: "scam",
        author: "TrustNo1_Steam",
        tone: "minus",
        when: "hace 1 mes",
        body: "-rep tried to scam me with fake middleman",
      },
      {
        id: "css",
        author: "flexbox_enjoyer",
        tone: "plus",
        when: "hace 1 mes",
        body: "+rep fixed my CSS in 5 minutes god tier",
      },
      {
        id: "bait",
        author: "noobSlayer99",
        tone: "neutral",
        when: "hace 2 meses",
        body: "nice profile but still lost 16-4 lmao",
      },
    ],
  },
  nav: {
    about: "Sobre mí",
    stack: "Stack",
    projects: "Proyectos",
    interests: "Intereses",
    links: "Enlaces",
    comments: "Comentarios",
  },
};
