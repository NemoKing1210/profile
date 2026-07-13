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
    langLabel: "Язык",
    backToTop: "Наверх",
    footerNote: "Static profile · GitHub Pages",
    birthPrefix: "г.р.",
    bannerAlt: "баннер",
    avatarAlt: "аватар",
    hobbies: "Хобби",
    gameGenres: "Любимые жанры игр",
    projectsSubtitle: "Библиотека — избранные репозитории",
  },
  spoken: {
    ru: "Русский",
    en: "Английский",
  },
  hero: {
    role: "Frontend-разработчик",
    status: "Online",
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
    toolkitLabel: "AI и агенты",
    toolkitBlurb:
      "Повседневный стек для ускорения разработки, ревью и проектирования вместе с нейросетями.",
    spawnTool: "Добавить {name} в hero",
  },
  stack: {
    title: "Стек",
    eyebrow: "Фокус и инструменты",
    techsLabel: "Технологии",
    spawnTech: "Добавить {name} в hero",
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
  nav: {
    about: "О себе",
    stack: "Стек",
    projects: "Проекты",
    interests: "Интересы",
    links: "Ссылки",
  },
};
