import { aiKitMark, aiToolIcons } from "../data/ai-tool-icons.js";
import { faviconForHref } from "../data/link-icons.js";
import profile from "../data/profile.js";
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

    get t() {
      return locales[this.locale] || locales[DEFAULT_LOCALE];
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

    get focus() {
      return this.t.focus;
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

    get stack() {
      return {
        title: this.t.stack.title,
        groups: profile.stackGroups.map((group) => ({
          id: group.id,
          label: this.t.stack.groups[group.id] || group.id,
          items: group.items,
        })),
      };
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
      document.getElementById("top")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },

    spawnToolLabel(tool) {
      return (this.t.about.spawnTool || "{name}").replace(
        "{name}",
        tool.label
      );
    },

    init() {
      this.setLocale(resolveInitialLocale());
      this.$nextTick(() => {
        initReveal(this.$root);
        this._heroPhysics = initHeroPhysics(this.$refs.heroPhysics);
      });
    },

    destroy() {
      this._heroPhysics?.destroy?.();
      this._heroPhysics = null;
    },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
