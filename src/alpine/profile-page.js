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
    _commentTimer: null,

    get t() {
      return locales[this.locale] || locales[DEFAULT_LOCALE];
    },

    get commentProgressStatus() {
      const statuses = this.t.comments?.progressStatuses || [];
      if (!statuses.length) return "";
      const idx = Math.min(
        statuses.length - 1,
        Math.floor(this.commentProgress / (100 / statuses.length))
      );
      return statuses[idx];
    },

    get commentFeed() {
      return (this.t.comments?.feed || []).map((item) => ({
        ...item,
        tone: item.tone || "neutral",
        initials: commentInitials(item.author),
        avatarColor: commentAvatarColor(item.author),
      }));
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
        kitMark: aiKitMark,
        badges: (profile.aboutBadges || []).map((badge) => ({
          id: badge.id,
          tone: badge.tone || "muted",
          label: this.t.about.badges?.[badge.id] || badge.id,
        })),
        tools: this.aiTools,
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
      return profile.nav.map((item) => ({
        ...item,
        label: this.t.nav[item.id] || item.id,
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
      const spoken = (profile.spokenLanguages || []).map(
        (code) => this.t.spoken[code] || code
      );
      return [
        this.t.hero.location,
        ...spoken,
        this.birthYear
          ? `${this.t.ui.birthPrefix} ${this.birthYear}`
          : null,
      ].filter(Boolean);
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
    },

    spawnAiTool(tool) {
      this._heroPhysics?.spawnAiSquare?.(tool);
      this.scrollToHero();
    },

    spawnTechBall(tech) {
      this._heroPhysics?.spawnTechBall?.(tech);
      this.scrollToHero();
    },

    spawnTechLabel(tech) {
      return (this.t.stack.spawnTech || this.t.about.spawnTool || "{name}").replace(
        "{name}",
        tech.label
      );
    },

    spawnToolLabel(tool) {
      return (this.t.about.spawnTool || "{name}").replace(
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
      this.commentSubmitting = true;
      this.commentProgress = 0;
      this._startCommentProgress();
    },

    _startCommentProgress() {
      this._stopCommentProgress();

      const tick = () => {
        const remaining = 99.7 - this.commentProgress;
        // Each step takes a shrinking share of what's left — never finishes.
        const step = Math.max(remaining * 0.065, 0.004);
        this.commentProgress = Math.min(this.commentProgress + step, 99.7);

        // Delay grows sharply near the end (joke infinite load).
        const closeness = this.commentProgress / 100;
        const delay = 140 + Math.pow(closeness, 3) * 4200 + closeness * 900;
        this._commentTimer = window.setTimeout(tick, delay);
      };

      this._commentTimer = window.setTimeout(tick, 180);
    },

    _stopCommentProgress() {
      if (this._commentTimer != null) {
        window.clearTimeout(this._commentTimer);
        this._commentTimer = null;
      }
    },

    init() {
      this.setLocale(resolveInitialLocale());
      this.$nextTick(() => {
        initReveal(this.$root);
        this._heroPhysics = initHeroPhysics(this.$refs.heroPhysics);
      });
    },

    destroy() {
      this._stopCommentProgress();
      this._heroPhysics?.destroy?.();
      this._heroPhysics = null;
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
