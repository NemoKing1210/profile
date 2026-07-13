import { aiKitMark, aiToolIcons } from "../data/ai-tool-icons.js";
import { heroicons } from "../data/heroicons.js";
import { faviconForHref } from "../data/link-icons.js";
import profile from "../data/profile.js";
import { techBallById } from "../data/tech-balls.js";
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  localeList,
  locales,
  resolveInitialLocale,
} from "../i18n/index.js";
import { initHeroPhysics } from "./hero-physics.js";
import { initReveal } from "./reveal.js";
import { celebrateConfetti } from "./confetti.js";

export function createProfilePage() {
  return {
    locale: DEFAULT_LOCALE,
    localeList,
    name: profile.name,
    handle: profile.handle,
    birthYear: profile.birthYear,
    avatar: profile.avatar,
    banner: profile.banner,
    icons: heroicons,
    commentDraft: { name: "", message: "" },
    commentSubmitting: false,
    commentProgress: 0,
    commentWaitTaunt: "",
    commentFinale: false,
    liveComments: [],
    navOpen: false,
    themeJokeOpen: false,
    themeJokeFlash: false,
    themeSith: false,
    physicsPlayCount: 0,
    avatarSpeechOpen: false,
    avatarSpeechText: "",
    avatarSpeechTyping: false,
    _avatarSpeechKey: null,
    _speechPlayEnoughDone: false,
    _speechPlayAlongDone: false,
    _avatarSpeechTimer: null,
    _avatarSpeechHideTimer: null,
    _themeJokeTimer: null,
    _themeFlashTimer: null,
    _themeSithTimer: null,
    _spoofInjected: false,
    _commentTimer: null,
    _commentWaitTimer: null,
    _commentStartedAt: 0,
    _stopConfetti: null,

    get t() {
      return locales[this.locale] || locales[DEFAULT_LOCALE];
    },

    get commentProgressStatus() {
      if (this.commentWaitTaunt) return this.commentWaitTaunt;

      const statuses = this.t.comments?.progressStatuses || [];
      if (!statuses.length) return "";
      const idx = Math.min(
        statuses.length - 1,
        Math.floor(this.commentProgress / (100 / statuses.length))
      );
      return statuses[idx];
    },

    get commentFeed() {
      const spoofWhen = this.t.comments?.spoofWhen || "";
      const live = (this.liveComments || []).map((item) => ({
        ...item,
        when: spoofWhen,
        tone: item.tone || "neutral",
        initials: commentInitials(item.author),
        avatarColor: commentAvatarColor(item.author),
      }));
      const base = (this.t.comments?.feed || []).map((item) => ({
        ...item,
        tone: item.tone || "neutral",
        initials: commentInitials(item.author),
        avatarColor: commentAvatarColor(item.author),
      }));
      return [...live, ...base];
    },

    get commentsCountLabel() {
      const count = this.commentFeed.length;
      const template =
        this.t.comments?.countLabel || "{count}";
      return template.replace("{count}", String(count));
    },

    get pageTitle() {
      return `${this.name} · ${this.t.ui.pageTitleSuffix}`;
    },

    get status() {
      return this.t.hero.status;
    },

    get role() {
      return this.t.hero.role;
    },

    get tagline() {
      return this.t.hero.tagline;
    },

    get about() {
      return {
        ...this.t.about,
        badges: (profile.aboutBadges || []).map((badge) => ({
          id: badge.id,
          tone: badge.tone || "muted",
          label: this.t.about.badges?.[badge.id] || badge.id,
        })),
      };
    },

    get stack() {
      const copy = this.t.stack;
      const byId = Object.fromEntries(
        (copy.items || []).map((item) => [item.id, item])
      );

      return {
        title: copy.title,
        eyebrow: copy.eyebrow,
        techsLabel: copy.techsLabel,
        spawnTech: copy.spawnTech,
        toolkitLabel: copy.toolkitLabel,
        toolkitBlurb: copy.toolkitBlurb,
        spawnTool: copy.spawnTool,
        kitMark: aiKitMark,
        tools: this.aiTools,
        growLabel: copy.growLabel,
        growBlurb: copy.growBlurb,
        growTagsLabel: copy.growTagsLabel,
        growTags: copy.growTags || [],
        items: (profile.stackItems || []).map((item) => {
          const local = byId[item.id] || {};
          const techs = (item.techs || [])
            .map((id) => techBallById[id])
            .filter(Boolean);
          const mark = techBallById[item.mark] || techs[0];
          return {
            id: item.id,
            tone: item.tone || "accent",
            label: local.label || item.id,
            detail: local.detail || "",
            mark: mark || { path: "", fill: "#66c0f4" },
            techs,
          };
        }),
      };
    },

    get interests() {
      return this.t.interests;
    },

    get nav() {
      const commentsCount = this.commentFeed.length;
      return profile.nav.map((item) => ({
        ...item,
        label: this.t.nav[item.id] || item.id,
        badge: item.id === "comments" ? commentsCount : null,
      }));
    },

    get projects() {
      return profile.projects.map((project) => ({
        ...project,
        blurb: this.t.projects.blurbs[project.id] || "",
        statusLabel:
          this.t.projects.status[project.status] || project.status,
      }));
    },

    get projectsTitle() {
      return this.t.projects.title;
    },

    get links() {
      return profile.links.map((link) => ({
        ...link,
        hint: this.t.links.hints[link.id] || "",
      }));
    },

    get linksTitle() {
      return this.t.links.title;
    },

    get hub() {
      return profile.hub;
    },

    get hubPlatforms() {
      return (profile.hub?.platforms || []).map((id) => ({
        id,
        label: this.t.hub.platforms[id] || id,
      }));
    },

    get letterboxd() {
      return profile.media?.letterboxd || { favorites: [], filmsWatched: 0 };
    },

    get letterboxdStat() {
      const count = this.letterboxd.filmsWatched || 0;
      return (this.t.letterboxd.filmsWatched || "{count}").replace(
        "{count}",
        String(count)
      );
    },

    get primaryLinks() {
      return this.links.slice(0, 2).map((link) => ({
        ...link,
        icon: faviconForHref(link.href),
      }));
    },

    get aiTools() {
      return (profile.aiTools || []).map((tool) => {
        const icon = aiToolIcons[tool.id] || aiToolIcons.cursor;
        return {
          id: tool.id,
          label: tool.label,
          icon: icon.src,
          mono: icon.mono,
          fill: icon.fill || "#1a2332",
        };
      });
    },

    get metaChips() {
      const chips = [
        {
          id: "location",
          kind: "location",
          icon: "mapPin",
          label: this.t.hero.location,
          tip: this.t.hero.locationTip,
        },
        ...(profile.spokenLanguages || []).map((code) => ({
          id: `lang-${code}`,
          kind: "lang",
          icon: "language",
          label: this.t.spoken[code] || code,
          tip: profile.spokenHellos?.[code] || null,
        })),
      ];

      if (this.birthYear) {
        chips.push({
          id: "birth",
          kind: "birth",
          icon: "cake",
          label: `${this.t.ui.birthPrefix} ${this.birthYear}`,
          tip: this.t.hero.birthTip,
        });
      }

      return chips;
    },

    projectGlyph(title) {
      return (title || "?").trim().charAt(0).toUpperCase();
    },

    setLocale(code) {
      if (!locales[code]) return;
      this.locale = code;

      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }

      document.documentElement.lang = code;
      document.title = this.pageTitle;

      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", this.t.meta.description);

      if (this.avatarSpeechOpen && this._avatarSpeechKey) {
        this.startAvatarSpeech(this._avatarSpeechKey);
      }
    },

    spawnAiTool(tool) {
      this._heroPhysics?.spawnAiSquare?.(tool);
      this.scrollToHero();
    },

    spawnTechBall(tech) {
      this._heroPhysics?.spawnTechBall?.(tech);
      this.scrollToHero();
    },

    spawnAvatarSquare() {
      this._heroPhysics?.spawnAvatarSquare?.({
        src: this.avatar,
        label: this.name,
      });
    },

    onPhysicsInteract() {
      if (this._speechPlayAlongDone) return;
      this.physicsPlayCount += 1;

      if (this.physicsPlayCount === 20 && !this._speechPlayEnoughDone) {
        this._speechPlayEnoughDone = true;
        this.startAvatarSpeech("playEnough");
        return;
      }

      if (this.physicsPlayCount >= 30) {
        this._speechPlayAlongDone = true;
        this.startAvatarSpeech("playAlong");
        this.spawnAvatarSquare();
      }
    },

    startAvatarSpeech(key) {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechKey = key;
      this.avatarSpeechOpen = true;
      this.avatarSpeechText = "";
      this.avatarSpeechTyping = true;

      const full = this.t.hero[key] || "";
      if (!full || prefersReducedMotion()) {
        this.avatarSpeechText = full;
        this.avatarSpeechTyping = false;
        this._scheduleAvatarSpeechHide();
        return;
      }

      let i = 0;
      this._avatarSpeechTimer = window.setInterval(() => {
        i += 1;
        this.avatarSpeechText = full.slice(0, i);
        if (i >= full.length) {
          this._stopAvatarSpeechTimer();
          this.avatarSpeechTyping = false;
          this._scheduleAvatarSpeechHide();
        }
      }, 32);
    },

    hideAvatarSpeech() {
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this.avatarSpeechOpen = false;
      this.avatarSpeechTyping = false;
      this.avatarSpeechText = "";
      this._avatarSpeechKey = null;
    },

    _scheduleAvatarSpeechHide() {
      this._stopAvatarSpeechHideTimer();
      this._avatarSpeechHideTimer = window.setTimeout(() => {
        this._avatarSpeechHideTimer = null;
        this.hideAvatarSpeech();
      }, 5000);
    },

    _stopAvatarSpeechTimer() {
      if (this._avatarSpeechTimer != null) {
        window.clearInterval(this._avatarSpeechTimer);
        this._avatarSpeechTimer = null;
      }
    },

    _stopAvatarSpeechHideTimer() {
      if (this._avatarSpeechHideTimer != null) {
        window.clearTimeout(this._avatarSpeechHideTimer);
        this._avatarSpeechHideTimer = null;
      }
    },

    toggleNav() {
      this.navOpen = !this.navOpen;
    },

    closeNav() {
      this.navOpen = false;
    },

    pokeThemeJoke() {
      this.themeJokeFlash = true;
      if (this._themeFlashTimer != null) {
        window.clearTimeout(this._themeFlashTimer);
      }
      this._themeFlashTimer = window.setTimeout(() => {
        this.themeJokeFlash = false;
        this._themeFlashTimer = null;
      }, 220);

      this.themeJokeOpen = true;
      if (this._themeJokeTimer != null) {
        window.clearTimeout(this._themeJokeTimer);
      }
      this._themeJokeTimer = window.setTimeout(() => {
        this.themeJokeOpen = false;
        this._themeJokeTimer = null;
      }, 5200);

      this.themeSith = true;
      if (this._themeSithTimer != null) {
        window.clearTimeout(this._themeSithTimer);
      }
      this._themeSithTimer = window.setTimeout(() => {
        this.themeSith = false;
        this._themeSithTimer = null;
      }, 5000);
    },

    spawnTechLabel(tech) {
      return (this.t.stack.spawnTech || "{name}").replace(
        "{name}",
        tech.label
      );
    },

    spawnToolLabel(tool) {
      return (this.t.stack.spawnTool || "{name}").replace(
        "{name}",
        tool.label
      );
    },

    scrollToHero() {
      document.getElementById("top")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },

    submitComment() {
      if (this.commentSubmitting) return;
      this.commentFinale = false;
      this.commentWaitTaunt = "";
      this.commentSubmitting = true;
      this.commentProgress = 0;
      this._spoofInjected = false;
      this._commentStartedAt = Date.now();
      this._stopConfetti?.();
      this._stopConfetti = null;
      this._startCommentProgress();
    },

    _startCommentProgress() {
      this._stopCommentProgress();

      const tick = () => {
        if (this.commentFinale) return;

        const remaining = 99.7 - this.commentProgress;
        // Each step takes a shrinking share of what's left — never finishes.
        const step = Math.max(remaining * 0.065, 0.004);
        this.commentProgress = Math.min(this.commentProgress + step, 99.7);

        if (this.commentProgress >= 75 && !this._spoofInjected) {
          this._injectSpoofComment();
        }

        // Delay grows sharply near the end (joke infinite load).
        const closeness = this.commentProgress / 100;
        const delay = 140 + Math.pow(closeness, 3) * 4200 + closeness * 900;
        this._commentTimer = window.setTimeout(tick, delay);
      };

      this._commentTimer = window.setTimeout(tick, 180);
      this._commentWaitTimer = window.setInterval(() => {
        this._syncCommentWaitTaunt();
      }, 250);
    },

    _injectSpoofComment() {
      if (this._spoofInjected) return;
      this._spoofInjected = true;

      const bodies = this.t.comments?.spoofBodies || [];
      const pick =
        bodies[Math.floor(Math.random() * bodies.length)] ||
        "+rep nice try";
      const body = typeof pick === "string" ? pick : pick.body;
      const tone =
        (typeof pick === "object" && pick.tone) ||
        spoofToneFromBody(body);

      this.liveComments = [
        {
          id: `spoof-${Date.now()}`,
          author: mangleNickname(this.commentDraft.name),
          body,
          tone,
          live: true,
        },
        ...this.liveComments,
      ];

      this.$nextTick(() => {
        document
          .getElementById("comments")
          ?.querySelector(".steam-comment--live")
          ?.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "nearest",
          });
      });
    },

    _syncCommentWaitTaunt() {
      if (!this.commentSubmitting || this.commentFinale) return;

      const elapsedSec = (Date.now() - this._commentStartedAt) / 1000;
      const taunts = this.t.comments?.waitTaunts || [];
      let active = null;

      for (const taunt of taunts) {
        if (elapsedSec >= taunt.at) active = taunt;
      }

      if (active) this.commentWaitTaunt = active.text;

      const finaleAt = taunts[taunts.length - 1]?.at ?? 150;
      if (elapsedSec >= finaleAt) {
        this._finishCommentJoke();
      }
    },

    _finishCommentJoke() {
      if (this.commentFinale) return;

      const taunts = this.t.comments?.waitTaunts || [];
      const finale = taunts[taunts.length - 1];
      this.commentWaitTaunt = finale?.text || "";
      this.commentFinale = true;
      this.commentProgress = 99.7;
      this.commentSubmitting = false;
      this._stopCommentProgress();
      this._stopConfetti?.();
      this._stopConfetti = celebrateConfetti(10_000);
    },

    _stopCommentProgress() {
      if (this._commentTimer != null) {
        window.clearTimeout(this._commentTimer);
        this._commentTimer = null;
      }
      if (this._commentWaitTimer != null) {
        window.clearInterval(this._commentWaitTimer);
        this._commentWaitTimer = null;
      }
    },

    init() {
      this.setLocale(resolveInitialLocale());
      this._onNavResize = () => {
        if (window.matchMedia("(min-width: 860px)").matches) {
          this.closeNav();
        }
      };
      window.addEventListener("resize", this._onNavResize);
      this.$nextTick(() => {
        initReveal(this.$root);
        this._heroPhysics = initHeroPhysics(this.$refs.heroPhysics, {
          onInteract: () => this.onPhysicsInteract(),
        });
      });
    },

    destroy() {
      window.removeEventListener("resize", this._onNavResize);
      this._onNavResize = null;
      this.closeNav();
      if (this._themeJokeTimer != null) {
        window.clearTimeout(this._themeJokeTimer);
        this._themeJokeTimer = null;
      }
      if (this._themeFlashTimer != null) {
        window.clearTimeout(this._themeFlashTimer);
        this._themeFlashTimer = null;
      }
      if (this._themeSithTimer != null) {
        window.clearTimeout(this._themeSithTimer);
        this._themeSithTimer = null;
      }
      this._stopAvatarSpeechTimer();
      this._stopAvatarSpeechHideTimer();
      this.themeJokeOpen = false;
      this.themeSith = false;
      this._stopCommentProgress();
      this._stopConfetti?.();
      this._stopConfetti = null;
      this._heroPhysics?.destroy?.();
      this._heroPhysics = null;
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function spoofToneFromBody(body) {
  const text = String(body || "").trim().toLowerCase();
  if (text.startsWith("+rep")) return "plus";
  if (text.startsWith("-rep")) return "minus";
  return "neutral";
}

function mangleNickname(name) {
  const base = String(name || "").trim() || "anon";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const leet = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
    s: "5",
    t: "7",
    b: "8",
    g: "9",
  };

  let result = [...base]
    .map((ch) => {
      if (Math.random() >= 0.5) return ch;

      const lower = ch.toLowerCase();
      if (leet[lower] && Math.random() < 0.55) {
        return leet[lower];
      }
      if (/[a-z]/i.test(ch)) {
        const next = letters[Math.floor(Math.random() * letters.length)];
        return ch === ch.toUpperCase() ? next.toUpperCase() : next;
      }
      if (/\d/.test(ch)) return String(Math.floor(Math.random() * 10));
      if (ch === "_" || ch === "-" || ch === ".") {
        return ["_", "-", ".", "x"][Math.floor(Math.random() * 4)];
      }
      return ch;
    })
    .join("");

  if (result === base) {
    const idx = Math.floor(Math.random() * result.length);
    const swap = letters[Math.floor(Math.random() * letters.length)];
    result =
      result.slice(0, idx) +
      (result[idx] === result[idx].toUpperCase()
        ? swap.toUpperCase()
        : swap) +
      result.slice(idx + 1);
  }

  return result.slice(0, 80);
}

function commentInitials(author) {
  const parts = String(author || "?")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  "#3d5a80",
  "#1b6b4a",
  "#6b3d5a",
  "#5a4a1b",
  "#1b4a6b",
  "#4a3d6b",
  "#6b4a1b",
  "#2d6b3d",
];

function commentAvatarColor(author) {
  const s = String(author || "");
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
