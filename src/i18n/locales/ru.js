export default {
  code: "ru",
  nativeName: "Русский",
  meta: {
    description:
      "Кирилл — frontend-разработчик. Vue, Nuxt, TypeScript. Профиль, стек, проекты.",
  },
  ui: {
    pageTitleSuffix: "Профиль",
    skipToContent: "К содержимому",
    navLabel: "Основная навигация",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    langLabel: "Язык",
    themeToggle: "Переключить тему",
    themeDeniedTitle: "Белой темы не будет",
    themeDenied:
      "Я её не люблю — она выжигает мне глаза по ночам. Присоединяйся к тёмной стороне Силы: у ситхов UX тоже тёмный.",
    backToTop: "Наверх",
    footerNote: "Static profile · GitHub Pages",
    birthPrefix: "г.р.",
    bannerAlt: "баннер",
    avatarAlt: "аватар",
    spawnAvatar: "Добавить аватар в hero",
    hobbies: "Хобби",
    gameGenres: "Любимые жанры игр",
    projectsSubtitle: "Библиотека — избранные репозитории",
  },
  spoken: {
    ru: "Русский",
    uk: "Украинский",
    en: "Английский",
    ja: "Японский",
  },
  hero: {
    role: "Frontend-разработчик",
    status: "Online",
    statusOffline: "Offline",
    statusLastSeen: "Был в сети: 1 янв 1970, 00:00:00",
    nameTip: "Это моё имя, если вы не поняли",
    locationTip: "Я в Матрице и не смогу приехать к вам в офис",
    birthTip: "Я зумер",
    metaLabel: "Локация, языки и год рождения",
    tagline:
      "Проектирую интерфейсы, которые не только красиво выглядят, но и удобны для пользователей.",
    location: "Удалённо",
  },
  hub: {
    eyebrow: "Соцхаб",
    title: "Linktree",
    blurb:
      "Frontend-разработчик: чистый UX и современный веб-дизайн, фокус на Vue/Nuxt. Делюсь мыслями про игры и веб-технологии.",
    cta: "Открыть Linktree",
    platformsLabel: "Там же",
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
    filmsWatched: "{count} фильмов",
    favoritesLabel: "Избранное",
  },
  about: {
    title: "О себе",
    eyebrow: "Frontend-first · backend тоже",
    badgesLabel: "Сильные стороны",
    lead:
      "Собираю интерфейсы, где <mark class=\"about-hl\">техника</mark> и вкус работают вместе — быстро, аккуратно и с вниманием к деталям.",
    paragraphs: [
      "Люблю совмещать разработку с визуальным и творческим взглядом. Уверенно работаю и с <strong>backend</strong> (Node.js, PHP, Laravel, Yii2), но <mark class=\"about-hl\">frontend</mark> ближе: именно там больше кайфа от результата и внимания к UX.",
      "В IT вдохновляет возможность <strong>видеть результат сразу</strong> — идея превращается в рабочий продукт на глазах. Современный AI-инструментарий помогает ускорять итерации, не жертвуя качеством кода.",
    ],
    badges: {
      craft: "UI-мастерство",
      vue: "Vue · Nuxt",
      ts: "TypeScript",
      backend: "Backend тоже",
      ai: "AI-native",
      agents: "AI-агенты",
      remote: "Remote-ready",
    },
    statusLabel: "Доступность",
    statusWorkBadge: "Закрыто",
    statusWork: "Не в поисках работы",
    statusWorkNote: "HR, можно не писать — уже mid-commit и доволен.",
    statusHappyBadge: "Открыто",
    statusHappy: "Всегда в поисках счастья",
    statusHappyNote: "Офферы принимаются: кофе, мемы, хороший DX.",
    statusPunch: "Резюме не прикладываю. Хорошее настроение — обязательно.",
  },
  stack: {
    title: "Стек",
    eyebrow: "Фокус и инструменты",
    techsLabel: "Технологии",
    spawnTech: "Добавить {name} в hero",
    toolkitLabel: "AI и агенты",
    toolkitBlurb:
      "Повседневный стек для ускорения разработки, ревью и проектирования вместе с нейросетями.",
    spawnTool: "Добавить {name} в hero",
    growLabel: "В движении",
    growBlurb:
      "Не останавливаюсь на достигнутом: пробую новые подходы, читаю, собираю pet-проекты и переношу удачное в прод — стек живой, а не зафиксированный список.",
    growTagsLabel: "Как учусь",
    growTags: ["Эксперименты", "Документация", "Pet-проекты", "Code review"],
    items: [
      {
        id: "frontend",
        label: "Frontend",
        detail:
          "Понятные UI и современный клиентский стек: вёрстка, Vue / Nuxt, Vite и Alpine там, где уместно.",
      },
      {
        id: "backend",
        label: "Backend",
        detail:
          "Удалёнка и автономность: при необходимости поднимаю API и сервисы на Node, Laravel и Yii2.",
      },
      {
        id: "languages",
        label: "Языки",
        detail:
          "Основной язык — TypeScript / JavaScript; также PHP, Lua и C# под задачи проекта.",
      },
    ],
  },
  projects: {
    title: "Проекты",
    status: {
      public: "Public",
    },
    blurbs: {
      "steam-gamestatus":
        "Userscript для Steam Store: бейджи crack/Denuvo-статуса через GameStatus.info API.",
      "youtube-bot-comments-filter":
        "Userscript для YouTube: ловит спам-ботов по паттерну ника, скрывает или блюрит комментарии.",
      ProxyChecker:
        "Кроссплатформенное десктоп-приложение для проверки доступности и скорости прокси.",
      "steam-region-block-bypass":
        "Userscript для Steam: возвращает карточку товара при региональной блокировке «unavailable in your region».",
    },
  },
  interests: {
    title: "Интересы",
    hobbies: ["Видеоигры", "Фильмы", "Аниме", "Сериалы", "Манга"],
    gameGenres: [
      "Сюжетные шутеры",
      "Песочницы",
      "Постапокалипсис / зомби",
    ],
  },
  links: {
    title: "Ссылки",
    hints: {
      github: "Репозитории и код",
      linktree: "Все соцсети в одном месте",
      letterboxd: "Фильмы и списки",
      orcid: "Научный профиль",
    },
  },
  comments: {
    title: "Комментарии",
    wallLabel: "Стена комментариев",
    countLabel: "{count} сообщений",
    inviteTitle: "Оставьте свой",
    inviteBlurb:
      "Я буду очень рад, если вы что-нибудь напишете — правда. Даже одно слово уже праздник.",
    nameLabel: "Имя",
    namePlaceholder: "Как вас представить",
    messageLabel: "Комментарий",
    messagePlaceholder: "+rep nice profile / -rep …",
    submit: "Отправить",
    sending: "Отправка…",
    progressLabel: "Отправка комментария",
    finaleTitle: "Ошибка сервера",
    progressStatuses: [
      "Подключаемся к серверу…",
      "Проверяем орфографию…",
      "Согласовываем с модерацией…",
      "Ждём ответ от бэкенда…",
      "Почти готово…",
      "Ещё совсем немного…",
    ],
    spoofWhen: "только что",
    spoofBodies: [
      "+rep mid diff huge, carry machine",
      "-rep baited me into 1v5 and left voice",
      "+rep clutch god, I drop for you anytime",
      "bro typed faster than my ping, insane",
      "+rep trusted trader, no scam energy",
    ],
    waitTaunts: [
      { at: 30, text: "Ты всё ещё здесь?.." },
      {
        at: 45,
        text: "Я не думаю, что твой комментарий пройдёт модерацию…",
      },
      { at: 60, text: "Похоже, осталось совсем чуть-чуть…" },
      { at: 75, text: "А ты терпеливый парень, ну жди, жди…" },
      {
        at: 90,
        text: "У нас медленный сервер, а посетителей много, извини…",
      },
      {
        at: 105,
        text: "Мы увеличили мощность серверов, твой запрос почти обработан…",
      },
      {
        at: 120,
        text: "Надеюсь, на твой комментарий не повлияет солнечная радиация…",
      },
      { at: 135, text: "Я уже читаю байты твоего комментария…" },
      {
        at: 150,
        text: "Произошла ошибка на сервере. Причина: у нас нет сервера :( Но ты молодец, что всё ещё тут — держи конфетти. Можешь попробовать ещё раз отправить: может, к этому моменту у меня появится сервер, но зато ты получишь конфетти :)",
      },
    ],
    feed: [
      {
        id: "clutch",
        author: "xX_AWP_God_Xx",
        tone: "plus",
        when: "2 дня назад",
        body: "+rep good teammate clutch king",
      },
      {
        id: "parser",
        author: "ScrapLord2007",
        tone: "plus",
        when: "5 дней назад",
        body: "+rep good expert at parsing bad sites",
      },
      {
        id: "cheater",
        author: "salty_potato",
        tone: "minus",
        when: "1 неделю назад",
        body: "-rep cheater wallhack confirmed !!!",
      },
      {
        id: "trade",
        author: "Skins4Days",
        tone: "plus",
        when: "2 недели назад",
        body: "+rep fast trade smooth deal thank u",
      },
      {
        id: "carry",
        author: "midOrFeed",
        tone: "plus",
        when: "3 недели назад",
        body: "+rep carried my ranked games absolute legend",
      },
      {
        id: "scam",
        author: "TrustNo1_Steam",
        tone: "minus",
        when: "1 месяц назад",
        body: "-rep tried to scam me with fake middleman",
      },
      {
        id: "css",
        author: "flexbox_enjoyer",
        tone: "plus",
        when: "1 месяц назад",
        body: "+rep fixed my CSS in 5 minutes god tier",
      },
      {
        id: "bait",
        author: "noobSlayer99",
        tone: "neutral",
        when: "2 месяца назад",
        body: "nice profile but still lost 16-4 lmao",
      },
    ],
  },
  nav: {
    about: "О себе",
    stack: "Стек",
    projects: "Проекты",
    interests: "Интересы",
    links: "Ссылки",
    comments: "Комментарии",
  },
};
