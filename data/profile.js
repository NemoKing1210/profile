/**
 * Profile content — edit this file to update the landing page.
 * Consumed by Alpine.js via js/main.js (Alpine.data).
 */
window.PROFILE = {
  name: "Кирилл",
  handle: "@NemoKing1210",
  role: "Frontend-разработчик",
  status: "Online",
  tagline:
    "Проектирую интерфейсы, которые не только красиво выглядят, но и удобны для пользователей.",
  location: "Удалённо",
  birthYear: 1999,
  language: "Русский",
  avatar: "https://github.com/NemoKing1210.png",
  banner: "assets/images/banner.svg",

  about: {
    title: "О себе",
    paragraphs: [
      "Люблю совмещать технологии с визуальным и творческим подходом. Открыт к новым знаниям и постоянно развиваюсь как специалист.",
      "В IT вдохновляет возможность видеть результат своей работы сразу — это делает процесс разработки увлекательным и наглядным.",
    ],
  },

  focus: {
    title: "Фокус",
    items: [
      {
        label: "Интерфейсы",
        detail:
          "Создание удобных и функциональных UI с вниманием к архитектуре frontend-приложений.",
      },
      {
        label: "Фреймворки",
        detail:
          "Работа с современным стеком: Vue.js, Nuxt.js, TypeScript и чистая вёрстка.",
      },
      {
        label: "Формат",
        detail:
          "Предпочитаю удалёнку: гибкость, автономность и комфортная рабочая атмосфера.",
      },
    ],
  },

  stack: {
    title: "Стек",
    groups: [
      {
        label: "Frontend",
        items: ["Vue.js", "Nuxt.js", "JavaScript/TypeScript", "HTML", "CSS"],
      },
      {
        label: "Backend",
        items: ["Yii2", "Node.js", "Laravel"],
      },
      {
        label: "Языки",
        items: ["JavaScript/TypeScript", "PHP", "Lua", "C#"],
      },
    ],
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

  projects: [
    {
      title: "steam-gamestatus",
      blurb:
        "Userscript для Steam Store: бейджи crack/Denuvo-статуса через GameStatus.info API.",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-gamestatus",
      status: "Public",
    },
    {
      title: "youtube-bot-comments-filter",
      blurb:
        "Userscript для YouTube: ловит спам-ботов по паттерну ника, скрывает или блюрит комментарии.",
      tags: ["JavaScript", "Userscript", "YouTube"],
      url: "https://github.com/NemoKing1210/youtube-bot-comments-filter",
      status: "Public",
    },
    {
      title: "ProxyChecker",
      blurb:
        "Кроссплатформенное десктоп-приложение для проверки доступности и скорости прокси.",
      tags: ["TypeScript", "Desktop"],
      url: "https://github.com/NemoKing1210/ProxyChecker",
      status: "Public",
    },
    {
      title: "steam-region-block-bypass",
      blurb:
        "Userscript для Steam: возвращает карточку товара при региональной блокировке «unavailable in your region».",
      tags: ["JavaScript", "Userscript", "Steam"],
      url: "https://github.com/NemoKing1210/steam-region-block-bypass",
      status: "Public",
    },
  ],

  links: [
    {
      label: "GitHub",
      href: "https://github.com/NemoKing1210",
      hint: "Репозитории и код",
    },
    {
      label: "ORCID",
      href: "https://orcid.org/0009-0004-4232-676X",
      hint: "Научный профиль",
    },
  ],

  nav: [
    { label: "О себе", href: "#about" },
    { label: "Фокус", href: "#focus" },
    { label: "Стек", href: "#stack" },
    { label: "Проекты", href: "#projects" },
    { label: "Интересы", href: "#interests" },
    { label: "Ссылки", href: "#links" },
  ],
};
