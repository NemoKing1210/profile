import commentsFeed from "./comments-feed.js";

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
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    langLabel: "Idioma",
    langHoverTip: "¿Quieres hablar conmigo en otro idioma?",
    langSwitched:
      "¡Genial! Ahora a ver si no lío las traducciones…",
    achievementsHoverTip:
      "¿Colección de trofeos? Echa un vistazo — pero sin fanfarronear demasiado.",
    achievementsDiscoverTip:
      "¿Sabías que el sitio tiene logros ocultos? Explora — el primer trofeo abre la colección.",
    themeHoverTip: "Claro u oscuro — elige un bando. Estoy listo.",
    themeHoverTipLocked:
      "Ese botón de tema invita… pero el secreto aún no está desbloqueado.",
    themeToLightTips: [
      "¡Ay, mis ojos! Bueno, me adapto… creo.",
      "Fondo blanco activado. Los vampiros protestan.",
      "¿Sol en la UI? Valiente. Gafas de sol no incluidas.",
      "Tema claro. Ahora se ve el polvo del diseño.",
    ],
    themeToDarkTips: [
      "El lado oscuro vuelve. Mejor para leer de noche.",
      "De vuelta a lo normal. Steam también lo prefiere así.",
      "Luces apagadas. Tus retinas dan las gracias.",
      "Otra vez oscuro. El perfil parece haber exhalado.",
    ],
    themeToggle: "Cambiar tema",
    themeToLight: "Cambiar a tema claro",
    themeToDark: "Cambiar a tema oscuro",
    themeDeniedTitle: "No habrá tema claro",
    themeDenied:
      "No me gusta: me quema los ojos por la noche. Únete al lado oscuro de la Fuerza: el UX sith también es oscuro.",
    backToTop: "Volver arriba",
    footerNote: "Static profile · GitHub Pages",
    footerFoundLead: "Eh… ¿cómo me encontraste?",
    footerFoundPunch:
      "Aquí se supone que hay scroll infinito. Vale, me pillaste — me largo.",
    birthPrefix: "n.",
    bannerAlt: "banner",
    avatarAlt: "avatar",
    spawnAvatar: "Añadir avatar al hero",
    hobbies: "Aficiones",
    gameGenres: "Géneros de juegos favoritos",
    projectsSubtitle: "Biblioteca — userscripts y escritorio",
    infiniteMarks: [
      "¿Footer? Nunca oí hablar",
      "El pasillo se repite",
      "Las luces zumban más fuerte",
      "Olor a papel tapiz húmedo",
      "Nivel 0",
      "No hay salida",
      "Ya estuviste aquí",
      "No mires atrás",
      "El scroll no termina",
      "Yo tampoco encuentro el final",
      "¿Otra sección? ¿En serio?",
      "El perfil se ha ciclado",
      "Creo que estamos atrapados",
      "¿Esto estaba arriba… o abajo?",
      "El wallpaper amarillo te observa",
      "El silencio aquí es demasiado alto",
      "No confíes en el mapa del sitio",
      "El final de página es un mito",
      "Dar un paso atrás no cambia nada",
      "Algo te sigue en el feed",
      "El wallpaper respira un poco",
      "¿Guardar progreso? Es broma.",
      "¿Sigues leyendo la bio?",
      "No hay camino a casa — solo scroll",
      "¿Te alcanza la RAM para esto?",
    ],
    mineToast: "Pico listo · Mantén clic izq. para minar UI · Esc para guardar",
    scrollTopEchoTease:
      "¿De verdad no quieres mirar un poco más abajo? Quién sabe — tal vez al borde del feed aún espera un regalo.",
  },
  echoFinale: {
    dialogLabel: "Final del scroll infinito",
    eyebrow: "Nivel 99",
    praiseTitle: "De verdad lo lograste",
    praiseBody:
      "Un camino tan largo y perseverante por el feed infinito merece recompensa. Abre el regalo: hay algo especial dentro.",
    giftLabel: "Abrir regalo",
    achievementEyebrow: "Logro desbloqueado",
    achievementTitle: "Tema blanco",
    achievementBody: "El tema claro ya está disponible en tu perfil.",
    giftJokeLead: "¿Pensabas que el regalo traía un footer?",
    giftJokePunch: "No cabría aquí… y ya es tarde para ir a buscarlo.",
    restart: "Empezar el camino de nuevo",
  },
  achievements: {
    buttonLabel: "Logros",
    panelTitle: "Logros",
    listLabel: "Logros desbloqueados",
    closeLabel: "Cerrar",
    unlockedAt: "Desbloqueado: {date}",
    progressCaption: "Progreso",
    progressLabel: "{done} / {total}",
    progressPraise: "Todos los logros desbloqueados. Leyenda.",
    effectToggleLabel: "Efecto del logro",
    toastEyebrow: "Logro desbloqueado",
    items: {
      lightTheme: {
        title: "Tema blanco",
        how: "Llega al ciclo 99 del feed infinito y abre el regalo.",
        effect: "Permite cambiar el perfil al tema claro",
      },
      activitySnake: {
        title: "Cazador de commits",
        how: "Llena la cuadrícula de actividad y cómete todas las celdas con la serpiente.",
        effect: "Título honorífico. El gráfico de GitHub está nervioso.",
      },
      longStay: {
        title: "Sigues aquí",
        how: "Pasa más de cinco minutos en el sitio.",
        effect: "Título honorífico. El tiempo vuela mientras navegas.",
      },
      commentMod: {
        title: "Moderador del muro",
        how: "Dale like a cada comentario del muro.",
        effect: "Un dislike elimina el comentario del muro",
      },
      interfaceMine: {
        title: "Todo roto",
        how: "Coge el pico de diamante de la portada de Minecraft y mina el header, el hero y todas las secciones.",
        effect: "Título honorífico. El diseñador llora; tú te diviertes.",
      },
      foundFooter: {
        title: "Hay un final",
        how: "Llega al pie de página a pesar del feed infinito.",
        effect: "Título honorífico. El footer entró en pánico y huyó.",
      },
      spawnCollector: {
        title: "Spawn completo",
        how: "Haz spawn de cada bandera de idioma, el avatar, cada tech del stack y cada herramienta de IA en el hero.",
        effect: "Al entrar en la página, todos esos objetos caen de golpe en el hero",
      },
    },
  },
  spoken: {
    ru: "Ruso",
    uk: "Ucraniano",
    en: "Inglés",
    ja: "Japonés",
  },
  hero: {
    name: "Kirill",
    role: "Desarrollador frontend",
    status: "Online",
    statusOffline: "Offline",
    statusOnlineTip: "Sigo aquí — ¿querías algo?",
    statusLastSeen: "Última vez: 1 ene 1970, 00:00:00",
    nameTip: "Ese es mi nombre, por si no quedaba claro",
    roleTip:
      "No solo Frontend. También Fullstack… cuando nadie mira. Y DevOps cuando ya está todo en llamas.",
    avatarTip: "¡Venga, haz clic en mí!",
    locationTip: "Estoy en Matrix y no podré ir a vuestra oficina",
    birthTip: "Sí, soy zoomer — ¿y qué?",
    playTips: [
      "Suave — eso es mi stack, no una bolera.",
      "La gravedad aprueba. El perfil también espera.",
      "Sigue lanzando. Yo miro… en silencio. Por ahora.",
      "Si cada tiro contara como un commit…",
      "Cuidado: las bolas también tienen sentimientos. Creo.",
    ],
    playEnough:
      "¿Todavía no te cansas de jugar? ¿Miramos el resto del perfil?",
    playAlong: "Parece divertido — ¡juego contigo!",
    metaLabel: "Ubicación, idiomas y año de nacimiento",
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
    platformsLabel: "En Linktree",
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
      "Letterboxd es una red social para cinéfilos: diario de visionados, valoraciones, listas y debate.",
    favoritesLabel: "Favoritos",
    openProfile: "Perfil",
    ctaTip:
      "Mira el diario — ahí hay más estrellas que en mis repos de GitHub.",
    subgenresLabel: "Subgéneros favoritos",
    tips: {
      fellowship:
        "«Todo lo que debemos decidir es qué hacer con el tiempo que se nos ha dado.» — Gandalf",
      twoTowers:
        "«¡No puedo llevarlo por ti, pero puedo llevarte a ti!» — Sam",
      returnKing: "«Amigos míos, no os inclináis ante nadie.» — Aragorn",
      avengers: "«¡Vengadores… unidos!» — Capitán América",
    },
    subgenres: {
      epicFantasy: "Fantasía épica",
      superhero: "Superhéroes",
      adventure: "Aventura",
      sciFi: "Ciencia ficción",
      animation: "Animación",
      apocalypse: "Postapocalipsis",
    },
  },
  backloggd: {
    title: "Backloggd",
    about:
      "Backloggd es Letterboxd para juegos: diario de partidas, valoraciones, backlog y listas.",
    favoritesLabel: "Favoritos",
    openProfile: "Perfil",
    ctaTip:
      "El backlog es infinito — como el scroll de abajo. Entra; a lo mejor encontramos partida.",
    genresLabel: "Géneros favoritos",
    tips: {
      programming: "Gracias a este juego me enamoré de la programación",
      pickaxe: "Psst — prueba a hacer clic. Tengo un pico esperándote.",
      atmosphere:
        "Atmósfera e historia impresionantes — un apocalipsis que sigue sintiéndose humano.",
      nightParkour:
        "De noche en los tejados con linterna — mi forma favorita de desconectar.",
      pixelsDig: "Otro sandbox. Los píxeles también se cavan.",
    },
    genres: {
      storyShooters: "Shooters con historia",
      sandboxes: "Sandboxes",
      apocalypse: "Postapocalipsis / zombis",
    },
  },
  steam: {
    title: "Steam",
    inviteTitle: "Mi Steam",
    about:
      "Steam es la plataforma de Valve para juegos: biblioteca, amigos, multijugador y comunidad.",
    invite:
      "Juego mucho y con ganas. En Steam — la biblioteca, amigos y lo que de verdad vuelvo a abrir.",
    cta: "Abrir perfil de Steam",
    ctaTip:
      "Añádeme. Prometo no tirar la partida en CS… casi. Y sí, la biblioteca ya no cabe en una captura.",
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
      frontend: "Frontend first",
      details: "Ojo al detalle",
      ship: "De idea a UI",
      backend: "Backend cuando hace falta",
      ai: "AI en el flujo",
      remote: "Remote",
    },
    badgeTips: {
      backend:
        "Gris porque apagaron la luz del servidor. El Backend vive a oscuras — como debe ser.",
    },
    statusLabel: "Disponibilidad",
    statusWorkBadge: "Cerrado",
    statusWork: "No busco trabajo",
    statusWorkNote: "Bandeja de ofertas en pausa — ahora importan más el ship y el código tranquilo.",
    statusWorkDenied: "Bueno, por un pastel quizá diga que sí...",
    statusHappyBadge: "Abierto",
    statusHappy: "Siempre busco la felicidad",
    statusHappyNote: "Se aceptan ofertas: café, memes y buen DX.",
    statusPunch: "Sin CV adjunto. Buen humor obligatorio.",
    activity: {
      label: "Actividad",
      eyebrow: "del último año",
      summary: "{count} «contribuciones» en el último año",
      summaryDone: "Uf… Otra vez a currar noches enteras…",
      less: "Menos",
      more: "Más",
      chartAria: "Mapa de actividad del último año: {count} contribuciones",
      tipTemplate: "{date}: {tip}",
      hoverTip:
        "Mapa de contribuciones. No preguntes qué hay dentro: la mitad son “fix fix”.",
      startSpeech:
        "¡Ups, las celdas despertaron! Alguien vuelve a hacer commit de “fix fix”…",
      playHoverTip: "¿Me ayudas a actualizar la actividad?",
      playStartSpeech:
        "Serpiente en la cuadrícula. Flechas / WASD / swipe — Esc para salir.",
      playWinSpeech:
        "Actividad actualizada… bueno, técnicamente comida. GitHub no sabe hacer eso.",
      playSummary: "Serpiente · cómete todas las celdas",
      playHint: "Flechas / WASD / swipe · Esc",
      days: { mon: "Lun", wed: "Mié", fri: "Vie" },
      tips: [
        "Arreglé un typo en el README",
        "Renombré la variable a variableFinal2",
        "npm install (otra vez)",
        "Miré DevTools cinco minutos",
        "Commit «fix fix»",
        "Añadí un TODO para después",
        "Cambié pestañas en VS Code",
        "Moví el margin 1px",
        "Pasé Prettier a todo el repo",
        "Busqué por qué no funciona",
        "Quité console.log (el que no era)",
        "Actualicé una dependencia «por si acaso»",
        "Escribí // temp y lo olvidé",
        "Hice rebase por una historia bonita",
        "Abrí Stack Overflow por reflejo",
        "Centré un div (margin: auto)",
        "Gané una guerra de z-index",
        "Añadí !important «temporalmente»",
        "Alineé a ojo con la grid",
        "Arreglé Chrome, rompí Safari",
        "Renombré un archivo por vibes",
        "Quité el border y lo volví a poner",
        "Hice un hover que nadie notará",
        "Cambié el color a #66c0f4 y de vuelta",
        "Esperé a que npm audit se callara",
        "Cerré 12 pestañas de MDN",
        "Escribí CSS sin :has()",
        "Puse flex y crucé los dedos",
        "Moví un píxel a la derecha, luego a la izquierda",
        "Actualicé el lockfile «sin querer»",
      ],
    },
  },
  stack: {
    title: "Stack",
    eyebrow: "Enfoque y herramientas",
    techsLabel: "Tecnologías",
    spawnTech: "Añadir {name} al hero",
    toolkitLabel: "IA y agentes",
    toolkitBlurb:
      "Stack diario para acelerar desarrollo, revisión y diseño junto a redes neuronales.",
    aiSpeech:
      "Sí, uso IA — pero con mesura: un impulso de velocidad, no un sustituto del pensamiento.",
    flipSpeech:
      "React gira bonito… pero prefiero vivir en Vue.",
    spawnTool: "Añadir {name} al hero",
    exploreLabel: "Quiero aprender",
    exploreBlurb:
      "El stack no termina en lo que ya está en producción. Abajo: direcciones que me pican las manos probar: compararlas con el Vue familiar, sentir otro modelo de reactividad y mirar más allá del frontend.",
    exploreSpeech: "En el horizonte: Svelte, Solid y Go. Las manos pican.",
    exploreItems: [
      {
        id: "svelte",
        badge: "Compilación, no runtime",
        label: "Svelte & SvelteKit",
        detail:
          "Quiero probar un framework donde la reactividad nace en el build: menos magia en el navegador, markup más limpio, esa sensación de «lo escribes y simplemente funciona». SvelteKit junto a él — para montar una app de verdad, no solo componentes en el vacío.",
      },
      {
        id: "solid",
        badge: "Reactividad precisa",
        label: "SolidJS",
        detail:
          "Intriga como alternativa al «virtual DOM para todo»: actualizaciones granulares, cercanas a signals. Merece entender en qué se diferencia de Vue — y qué de esa precisión conviene llevar al día a día.",
      },
      {
        id: "go",
        badge: "Simplicidad en producción",
        label: "Go",
        detail:
          "Un lenguaje con sintaxis clara y una fuerte cultura de servicios: binarios rápidos, goroutines, concurrencia honesta. Quiero escribir backends que se despliegan «en un archivo» sin un runtime pesado — contraste con Node y PHP.",
      },
    ],
    growLabel: "En movimiento",
    growBlurb:
      "No me quedo en lo ya logrado: pruebo enfoques nuevos, leo, hago pet projects y llevo lo útil a producción — el stack está vivo, no es una lista congelada.",
    growSpeech: "Aprendo en voz alta: experimentos, docs, pet projects.",
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
    favoriteFlip: {
      ariaLabel:
        "Tarjeta broma: React al frente, Vue al dorso. Gira al acercarte con el scroll.",
      frontBadge: "Biblioteca favorita",
      frontLabel: "React",
      frontDetail:
        "Mi biblioteca favorita: componentes, hooks y un ecosistema vivo. Empecé con ella — y sigue calentando el corazón.",
      backBadge: "Framework favorito",
      backLabel: "Vue",
      backDetail:
        "Vale, me pillaste: mi framework favorito es Vue / Nuxt. DX limpio, plantilla clara y el ecosistema con el que realmente llevo cosas a producción.",
    },
  },
  projects: {
    title: "Proyectos",
    openCta: "Abrir en GitHub",
    featured: "Destacado",
    notice:
      "Por ahora empiezo con poco — userscripts y pet projects. Lo más grande viene después.",
    status: {
      public: "Public",
    },
    kinds: {
      userscript: "Userscript",
      desktop: "Desktop",
    },
    blurbs: {
      "steam-gamestatus":
        "Userscript para Steam Store y Community: insignias de protección, fechas, puntuaciones y hardware en las fichas — sin salir de la página. Datos de GameStatus.info, con caché y panel de ajustes.",
      "steam-region-block-bypass":
        "Userscript de Steam Store: cuando aparece “unavailable in your region”, restaura la ficha de invitado y, opcionalmente, la búsqueda guest. Panel al estilo Steam y gateway proxy para bloqueos por IP.",
      ProxyChecker:
        "App de escritorio Electron + React para comprobar proxies HTTP/SOCKS/MTProto: lotes, grupos, geo, exportación y sync vía GitHub Gist / Google Drive.",
      "youtube-bot-comments-filter":
        "Userscript de YouTube: detecta bots de spam por el patrón del nick y oculta o difumina comentarios. Interruptor hide/blur en la cabecera de comentarios, sin página de ajustes aparte.",
    },
    highlights: {
      "steam-gamestatus": [
        "Insignias en listados y en la página del juego",
        "Tooltips al estilo Steam con scores y specs",
        "Caché, carga diferida y 10 idiomas de UI",
      ],
      "steam-region-block-bypass": [
        "Restaurar fichas con fetch anónimo",
        "Sugerencias guest y /search opcional",
        "Panel Region Bypass + proxy gateway local",
      ],
      ProxyChecker: [
        "Protocolos HTTP, SOCKS4/5 y MTProto",
        "Grupos, favoritos, bandeja y auto-update",
        "Sync cifrado y copias locales",
      ],
      "youtube-bot-comments-filter": [
        "Motor de reglas ponderadas en el nick",
        "Modos hide / blur con preferencia guardada",
        "Estilo adaptado a YouTube light/dark",
      ],
    },
  },
  interests: {
    title: "Intereses",
    blurb:
      "Además de programar, me gustan las películas, los videojuegos, el anime, las series y el manga: todo lo que cuenta bien una historia en pantalla.",
    hobbies: {
      games: "Videojuegos",
      movies: "Películas",
      anime: "Anime",
      series: "Series",
      manga: "Manga",
    },
    hobbySpeech: {
      anime: "Sí, veo anime. No, la trama no está «alargada»: la vida es así.",
      manga: "Viñetas en vez de fotogramas. Misma pasión por una buena historia.",
    },
  },
  links: {
    title: "Enlaces",
    directLabel: "Enlaces directos",
    hints: {
      github: "Código y repositorios",
      linktree: "Todas las redes en un solo lugar",
      letterboxd: "Películas y listas",
      orcid: "Perfil científico",
    },
    speechTips: {
      orcid: "Perfil académico — todavía sin papers sobre raids de Minecraft.",
    },
  },
  comments: {
    feed: commentsFeed,
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
    minusRepTitle: "La moderación frunce el ceño",
    minusRepHint:
      "No se permiten comentarios malos. Solo palabras amables y +rep. Quédate {seconds}s pensando en cosas bonitas.",
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
    spoilerHint: "Pasa el cursor para leer",
    reactLabel: "Reacción al comentario",
    voteUp: "Me gusta",
    voteDown: "No me gusta",
    voteDelete: "Eliminar comentario",
    sortLabel: "Ordenar",
    sortTop: "Top",
    sortNew: "Nuevos",
    sortControversial: "Polémicos",
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
    ]
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
