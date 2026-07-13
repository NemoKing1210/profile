export default {
  code: "ja",
  nativeName: "日本語",
  meta: {
    description:
      "Kirill — フロントエンド開発者。Vue、Nuxt、TypeScript。プロフィール、スタック、プロジェクト。",
  },
  ui: {
    pageTitleSuffix: "プロフィール",
    skipToContent: "コンテンツへスキップ",
    navLabel: "メインナビゲーション",
    menuOpen: "メニューを開く",
    menuClose: "メニューを閉じる",
    langLabel: "言語",
    themeToggle: "テーマを切り替え",
    themeDeniedTitle: "ライトテーマはありません",
    themeDenied:
      "好きじゃない — 夜に目が痛い。フォースの闇の側へ来い：シスの UX もダークのままだ。",
    backToTop: "トップへ戻る",
    footerNote: "Static profile · GitHub Pages",
    birthPrefix: "生",
    bannerAlt: "バナー",
    avatarAlt: "アバター",
    spawnAvatar: "ヒーローにアバターを追加",
    hobbies: "趣味",
    gameGenres: "好きなゲームジャンル",
    projectsSubtitle: "ライブラリ — 注目のリポジトリ",
  },
  spoken: {
    ru: "ロシア語",
    uk: "ウクライナ語",
    en: "英語",
    ja: "日本語",
  },
  hero: {
    role: "フロントエンド開発者",
    status: "Online",
    statusOffline: "Offline",
    statusLastSeen: "最終オンライン：1970年1月1日 00:00:00",
    metaLabel: "所在地、言語、生年",
    tagline:
      "見た目もよく、使い心地も軽いインターフェースを設計します。",
    location: "リモート",
  },
  hub: {
    eyebrow: "ソーシャルハブ",
    title: "Linktree",
    blurb:
      "クリーンな UX とモダンな Web デザインを専門とするフロントエンド開発者。Vue/Nuxt が中心。ゲームと Web 技術について発信しています。",
    cta: "Linktree を開く",
    platformsLabel: "その他",
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
    filmsWatched: "{count} 本の映画を鑑賞",
    favoritesLabel: "お気に入り",
  },
  about: {
    title: "自己紹介",
    eyebrow: "Frontend-first · backend も",
    badgesLabel: "ハイライト",
    lead:
      "<mark class=\"about-hl\">技術</mark>とセンスが噛み合うインターフェースを作る — 速く、正確で、細部にこだわります。",
    paragraphs: [
      "エンジニアリングとビジュアル・クリエイティブな視点を融合するのが好きです。<strong>バックエンド</strong>（Node.js、PHP、Laravel、Yii2）も得意ですが、<mark class=\"about-hl\">フロントエンド</mark>が本領 — 成果への喜びも UX への集中も、ここが一番。",
      "IT で私を動かすのは<strong>すぐに結果が見える</strong>こと — アイデアが目の前で動くプロダクトになる。モダンな AI ツールで、コード品質を落とさずに速く回せます。",
    ],
    badges: {
      craft: "UI クラフト",
      vue: "Vue · Nuxt",
      ts: "TypeScript",
      backend: "Backend も",
      ai: "AI-native",
      agents: "AI エージェント",
      remote: "Remote-ready",
    },
    statusLabel: "ステータス",
    statusWorkBadge: "クローズ",
    statusWork: "仕事は探していません",
    statusWorkNote: "リクルーターの方へ — すでにコミット中で満足しています。",
    statusHappyBadge: "オープン",
    statusHappy: "幸せはいつでも募集中",
    statusHappyNote: "歓迎：コーヒー、ミーム、心地よい DX。",
    statusPunch: "履歴書は添付しません。良い雰囲気は必須。",
  },
  stack: {
    title: "スタック",
    eyebrow: "フォーカスとツール",
    techsLabel: "テクノロジー",
    spawnTech: "ヒーローに {name} を追加",
    toolkitLabel: "AI とエージェント",
    toolkitBlurb:
      "開発・レビュー・設計をニューラルネットと一緒に加速する、日常のスタック。",
    spawnTool: "ヒーローに {name} を追加",
    growLabel: "学び続けています",
    growBlurb:
      "うまくいっているところで止まらない：新しいアプローチを試し、読み、ペットプロジェクトを出し、効いたものを本番へ — スタックは凍ったリストではなく、生き続けます。",
    growTagsLabel: "学び方",
    growTags: ["実験", "ドキュメント", "ペットプロジェクト", "コードレビュー"],
    items: [
      {
        id: "frontend",
        label: "Frontend",
        detail:
          "わかりやすい UI とモダンなクライアントスタック：マークアップ、Vue / Nuxt、Vite、必要なら Alpine。",
      },
      {
        id: "backend",
        label: "Backend",
        detail:
          "リモートファーストで自律的 — 必要なら Node、Laravel、Yii2 で API とサービスも届けます。",
      },
      {
        id: "languages",
        label: "言語",
        detail:
          "日常は TypeScript / JavaScript。プロジェクト次第で PHP、Lua、C# も。",
      },
    ],
  },
  projects: {
    title: "プロジェクト",
    status: {
      public: "Public",
    },
    blurbs: {
      "steam-gamestatus":
        "Steam Store 用 userscript：GameStatus.info API で crack/Denuvo ステータスバッジを表示。",
      "youtube-bot-comments-filter":
        "YouTube 用 userscript：ニックネームのパターンでスパムボットを検出し、コメントを非表示またはぼかし。",
      ProxyChecker:
        "プロキシの可用性とパフォーマンスをチェックするクロスプラットフォームのデスクトップアプリ。",
      "steam-region-block-bypass":
        "Steam 用 userscript：地域制限メッセージ表示時に商品ページを復元。",
    },
  },
  interests: {
    title: "興味",
    hobbies: ["ビデオゲーム", "映画", "アニメ", "TV シリーズ", "マンガ"],
    gameGenres: [
      "ストーリー重視のシューター",
      "サンドボックス",
      "ポストアポカリプス / ゾンビ",
    ],
  },
  links: {
    title: "リンク",
    hints: {
      github: "コードとリポジトリ",
      linktree: "ソーシャルを一箇所に",
      letterboxd: "映画とリスト",
      orcid: "研究プロフィール",
    },
  },
  comments: {
    title: "コメント",
    wallLabel: "コメントウォール",
    countLabel: "{count} 件のコメント",
    inviteTitle: "あなたのも残して",
    inviteBlurb:
      "何か書いてもらえると本当に嬉しいです。一言でも十分うれしい。",
    nameLabel: "名前",
    namePlaceholder: "どう紹介しましょうか",
    messageLabel: "コメント",
    messagePlaceholder: "+rep nice profile / -rep …",
    submit: "送信",
    sending: "送信中…",
    progressLabel: "コメントを送信中",
    finaleTitle: "サーバーエラー",
    progressStatuses: [
      "サーバーに接続中…",
      "スペルを確認中…",
      "モデレーション待ち…",
      "バックエンドの応答待ち…",
      "もう少し…",
      "あとちょっと…",
    ],
    spoofWhen: "たった今",
    spoofBodies: [
      "+rep mid diff huge, carry machine",
      "-rep baited me into 1v5 and left voice",
      "+rep clutch god, I drop for you anytime",
      "bro typed faster than my ping, insane",
      "+rep trusted trader, no scam energy",
    ],
    waitTaunts: [
      { at: 30, text: "まだいるの…？" },
      {
        at: 45,
        text: "あなたのコメント、モデレーション通らないかも…",
      },
      { at: 60, text: "あとちょっとだけみたい…" },
      { at: 75, text: "忍耐強いね — 待って、待って…" },
      {
        at: 90,
        text: "サーバーが遅くて訪問者も多い、ごめん…",
      },
      {
        at: 105,
        text: "サーバーをスケールした — リクエストはほぼ処理済み…",
      },
      {
        at: 120,
        text: "太陽放射がコメントに影響しないといいけど…",
      },
      { at: 135, text: "もうコメントのバイトを読んでる…" },
      {
        at: 150,
        text: "サーバーエラー。理由：サーバーがない :( でもまだここにいるあなたはすごい — 紙吹雪をどうぞ。もう一度送ってみて。その頃にはサーバーがあるかも — どっちにしても紙吹雪はもらえるよ :)",
      },
    ],
    feed: [
      {
        id: "clutch",
        author: "xX_AWP_God_Xx",
        tone: "plus",
        when: "2 日前",
        body: "+rep good teammate clutch king",
      },
      {
        id: "parser",
        author: "ScrapLord2007",
        tone: "plus",
        when: "5 日前",
        body: "+rep good expert at parsing bad sites",
      },
      {
        id: "cheater",
        author: "salty_potato",
        tone: "minus",
        when: "1 週間前",
        body: "-rep cheater wallhack confirmed !!!",
      },
      {
        id: "trade",
        author: "Skins4Days",
        tone: "plus",
        when: "2 週間前",
        body: "+rep fast trade smooth deal thank u",
      },
      {
        id: "carry",
        author: "midOrFeed",
        tone: "plus",
        when: "3 週間前",
        body: "+rep carried my ranked games absolute legend",
      },
      {
        id: "scam",
        author: "TrustNo1_Steam",
        tone: "minus",
        when: "1 ヶ月前",
        body: "-rep tried to scam me with fake middleman",
      },
      {
        id: "css",
        author: "flexbox_enjoyer",
        tone: "plus",
        when: "1 ヶ月前",
        body: "+rep fixed my CSS in 5 minutes god tier",
      },
      {
        id: "bait",
        author: "noobSlayer99",
        tone: "neutral",
        when: "2 ヶ月前",
        body: "nice profile but still lost 16-4 lmao",
      },
    ],
  },
  nav: {
    about: "自己紹介",
    stack: "スタック",
    projects: "プロジェクト",
    interests: "興味",
    links: "リンク",
    comments: "コメント",
  },
};
