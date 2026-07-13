import { aiKitMark, aiToolIcons } from "../data/ai-tool-icons.js";
import { heroicons } from "../data/heroicons.js";
import { faviconForHref } from "../data/link-icons.js";
import { linkMarks } from "../data/link-marks.js";
import profile from "../data/profile.js";
import { projectMarks } from "../data/project-marks.js";
import { techBallById } from "../data/tech-balls.js";
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  localeList,
  locales,
  resolveInitialLocale,
} from "../i18n/index.js";
import {
  ACTIVITY_DAYS,
  ACTIVITY_MAX,
  ACTIVITY_WEEKS,
  aboutActivityMethods,
  aboutActivityState,
} from "./about-activity.js";
import { initHeroPhysics } from "./hero-physics.js";
import { initInfiniteScroll } from "./infinite-scroll.js";
import { initReveal } from "./reveal.js";
import { celebrateConfetti } from "./confetti.js";
import {
  minecraftMineMethods,
  minecraftMineState,
} from "./minecraft-mine.js";

const SOCIAL_CREDIT_COMMENT_ID = "social-credit";

const COMMENT_DEFAULT_SCORES = {
  clutch: 127,
  parser: 84,
  cheater: -23,
  "farm-raid": 12,
  carry: 203,
  "carry-reply-1": 34,
  "carry-reply-2": 18,
  scam: -41,
  "scam-reply-1": 45,
  css: 56,
  bait: 3,
  "bait-reply-1": -8,
  "bait-reply-2": 22,
  stalcraft: 91,
  [SOCIAL_CREDIT_COMMENT_ID]: 88,
};

/** Days ago — locale-agnostic sort key (lower = newer). */
const COMMENT_AGE_DAYS = {
  clutch: 2,
  parser: 5,
  cheater: 7,
  "farm-raid": 14,
  carry: 21,
  "carry-reply-1": 21,
  "carry-reply-2": 22,
  scam: 30,
  "scam-reply-1": 29,
  css: 30,
  bait: 60,
  "bait-reply-1": 59,
  "bait-reply-2": 58,
  stalcraft: 60,
  [SOCIAL_CREDIT_COMMENT_ID]: 90,
};

export function createProfilePage() {
  // Spread must not evaluate activity getters (object rest/spread calls them).
  // Copy descriptors so Alpine keeps real getters/methods.
  return Object.defineProperties(
    {
      ACTIVITY_WEEKS,
      ACTIVITY_DAYS,
      ACTIVITY_MAX,
      ...aboutActivityState(),
      ...minecraftMineState(),
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
      commentRepLocked: false,
      commentRepLockLeft: 0,
      commentRepStrikes: 0,
      commentUserVotes: {},
      commentSort: "top",
      socialCreditToastOpen: false,
      socialCreditToastMessage: "",
      socialCreditToastPenalty: false,
      socialCreditFlashOpen: false,
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
      _socialCreditToastTimer: null,
      _socialCreditFlashTimer: null,
      _stopConfetti: null,
      _infiniteScroll: null,
      stackFlipDeg: 0,
      _stackFlipRaf: 0,
      _onStackFlipScroll: null,

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
      const spoilerHint = this.t.comments?.spoilerHint || "";

      const enrich = (item, when, depth = 0, parentId = null) => ({
        ...item,
        when,
        depth,
        parentId,
        ageDays: this.commentAgeDays(item.id, item.live),
        tone: item.tone || "neutral",
        initials: commentInitials(item.author),
        avatarColor: commentAvatarColor(item.author),
        bodySegments: parseCommentBody(item.body),
        spoilerHint,
        score: this.commentDisplayScore(item.id),
        userVote: this.commentUserVotes[item.id] || null,
      });

      const live = (this.liveComments || []).map((item) =>
        enrich(item, spoofWhen, 0, null)
      );

      const parents = (this.t.comments?.feed || []).map((item) => {
        const parent = enrich(item, item.when, 0, null);
        const replies = (item.replies || []).map((reply) =>
          enrich(reply, reply.when, 1, item.id)
        );
        replies.sort((a, b) => b.ageDays - a.ageDays);
        return { ...parent, replies };
      });

      const sortedParents = this.sortCommentItems(parents, this.commentSort);
      const flat = [];

      for (const parent of live) {
        flat.push(parent);
      }

      for (const parent of sortedParents) {
        flat.push(parent);
        for (const reply of parent.replies || []) {
          flat.push(reply);
        }
      }

      return flat;
    },

    get commentsCountLabel() {
      const count = this.commentFeed.length;
      const template =
        this.t.comments?.countLabel || "{count}";
      return template.replace("{count}", String(count));
    },

    get commentMinusRepHint() {
      const template = this.t.comments?.minusRepHint || "";
      return template.replace("{seconds}", String(this.commentRepLockLeft));
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
      const flip = copy.favoriteFlip || {};
      const reactMark = techBallById.react || { path: "", fill: "#61dafb" };
      const vueMark = techBallById.vue || { path: "", fill: "#42b883" };

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
        favoriteFlip: {
          ariaLabel: flip.ariaLabel || "",
          front: {
            badge: flip.frontBadge || "",
            label: flip.frontLabel || "React",
            detail: flip.frontDetail || "",
            mark: reactMark,
          },
          back: {
            badge: flip.backBadge || "",
            label: flip.backLabel || "Vue",
            detail: flip.backDetail || "",
            mark: vueMark,
          },
        },
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
      const copy = this.t.interests || {};
      const hobbyLabels = copy.hobbies || {};
      const hobbies = (profile.interests?.hobbies || []).map((hobby) => ({
        ...hobby,
        label: hobbyLabels[hobby.id] || hobby.id,
        icon: this.icons[hobby.icon] || "",
      }));
      return {
        title: copy.title || "",
        blurb: copy.blurb || "",
        hobbies,
      };
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
      const copy = this.t.projects || {};
      return profile.projects.map((project) => ({
        ...project,
        blurb: copy.blurbs?.[project.id] || "",
        highlights: copy.highlights?.[project.id] || [],
        kindLabel: copy.kinds?.[project.kind] || project.kind,
        statusLabel: copy.status?.[project.status] || project.status,
        mark: projectMarks[project.mark] || projectMarks.steam,
      }));
    },

    get projectsTitle() {
      return this.t.projects.title;
    },

    get links() {
      return profile.links.map((link) => ({
        ...link,
        hint: this.t.links.hints[link.id] || "",
        mark: linkMarks[link.id] || linkMarks.linktree,
        lightTile: link.id === "github" || link.id === "letterboxd",
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
        mark: linkMarks[id] || linkMarks.linktree,
        lightTile: id === "github" || id === "letterboxd",
      }));
    },

    get letterboxd() {
      const media = profile.media?.letterboxd || {};
      const copy = this.t.letterboxd || {};
      const subgenreLabels = copy.subgenres || {};
      return {
        href: media.href || "",
        name: media.name || "",
        avatar: media.avatar || "",
        about: copy.about || "",
        favorites: (media.favorites || []).map((film) =>
          typeof film === "string"
            ? {
                id: film,
                title: film,
                year: null,
                cover: "",
                href: media.href || "",
              }
            : {
                id: film.id,
                title: film.title,
                year: film.year || null,
                cover: film.banner || film.cover || "",
                href: film.href || media.href || "",
              }
        ),
        subgenres: (media.subgenres || []).map((item) => ({
          ...item,
          label: subgenreLabels[item.id] || item.id,
        })),
      };
    },

    get letterboxdCta() {
      return this.t.letterboxd.openProfile || this.t.letterboxd.title || "Letterboxd";
    },

    get backloggd() {
      const media = profile.media?.backloggd || {};
      const copy = this.t.backloggd || {};
      const genreLabels = copy.genres || {};
      const tipCopy = copy.tips || {};
      return {
        href: media.href || "",
        name: media.name || "",
        avatar: media.avatar || "",
        about: copy.about || "",
        favorites: (media.favorites || []).map((game) =>
          typeof game === "string"
            ? {
                id: game,
                title: game,
                year: null,
                cover: "",
                href: media.href || "",
                tip: "",
              }
            : {
                id: game.id,
                title: game.title,
                year: game.year || null,
                cover: game.cover || "",
                href: game.href || media.href || "",
                tip: game.tip ? tipCopy[game.tip] || "" : "",
              }
        ),
        genres: (media.genres || []).map((item) => ({
          ...item,
          label: genreLabels[item.id] || item.id,
        })),
      };
    },

    get backloggdCta() {
      return this.t.backloggd.openProfile || this.t.backloggd.title || "Backloggd";
    },

    get steam() {
      const media = profile.media?.steam || {};
      const copy = this.t.steam || {};
      return {
        href: media.href || "",
        handle: media.handle || "",
        name: media.name || "",
        avatar: media.avatar || "",
        title: copy.title || "Steam",
        about: copy.about || "",
        invite: copy.invite || "",
        cta: copy.cta || copy.openProfile || "Steam",
        mark: projectMarks.steam,
      };
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

    setLocale(code, { celebrate = false } = {}) {
      if (!locales[code]) return;

      const changed = this.locale !== code;
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

      this._infiniteScroll?.reset?.();

      this.refreshActivityLocale?.();

      if (celebrate && changed) {
        this.spawnFlagSquare(code);
      }
    },

    spawnFlagSquare(code) {
      const option = this.localeList.find((item) => item.code === code);
      this._heroPhysics?.spawnFlagSquare?.({
        locale: code,
        label: option?.nativeName || code,
      });
      this.scrollToHero();
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

    updateStackFlip() {
      if (prefersReducedMotion()) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
        return;
      }

      if (this.stackFlipDeg >= 180) {
        this._unbindStackFlip();
        return;
      }

      const el = this.$refs.stackFlip;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const cardMid = rect.top + rect.height / 2;
      const viewMid = vh * 0.42;
      // Only approach from below counts — scrolling past does not unwind.
      if (cardMid < viewMid) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
        return;
      }

      const dist = cardMid - viewMid;
      const maxDist = vh * 0.62;
      const t = 1 - Math.min(1, Math.max(0, dist / maxDist));
      const eased = t * t * (3 - 2 * t);
      const next = Math.round(eased * 180);

      if (next > this.stackFlipDeg) {
        this.stackFlipDeg = next;
      }

      if (this.stackFlipDeg >= 180) {
        this.stackFlipDeg = 180;
        this._unbindStackFlip();
      }
    },

    _scheduleStackFlip() {
      if (this._stackFlipRaf) return;
      this._stackFlipRaf = window.requestAnimationFrame(() => {
        this._stackFlipRaf = 0;
        this.updateStackFlip();
      });
    },

    _bindStackFlip() {
      this._unbindStackFlip();
      if (prefersReducedMotion()) {
        this.stackFlipDeg = 180;
        return;
      }
      this._onStackFlipScroll = () => this._scheduleStackFlip();
      window.addEventListener("scroll", this._onStackFlipScroll, {
        passive: true,
      });
      window.addEventListener("resize", this._onStackFlipScroll, {
        passive: true,
      });
      this.$nextTick(() => this.updateStackFlip());
    },

    _unbindStackFlip() {
      if (this._onStackFlipScroll) {
        window.removeEventListener("scroll", this._onStackFlipScroll);
        window.removeEventListener("resize", this._onStackFlipScroll);
        this._onStackFlipScroll = null;
      }
      if (this._stackFlipRaf) {
        window.cancelAnimationFrame(this._stackFlipRaf);
        this._stackFlipRaf = 0;
      }
    },

    commentAgeDays(id, live = false) {
      if (live) return 0;
      if (Object.hasOwn(COMMENT_AGE_DAYS, id)) {
        return COMMENT_AGE_DAYS[id];
      }
      return 999;
    },

    sortCommentItems(items, sort) {
      const list = [...items];
      if (sort === "new") {
        list.sort((a, b) => a.ageDays - b.ageDays || b.score - a.score);
      } else if (sort === "controversial") {
        list.sort(
          (a, b) =>
            Math.abs(a.score) - Math.abs(b.score) ||
            b.ageDays - a.ageDays
        );
      } else {
        list.sort((a, b) => b.score - a.score || a.ageDays - b.ageDays);
      }
      return list;
    },

    setCommentSort(sort) {
      if (sort === this.commentSort) return;
      this.commentSort = sort;
    },

    commentBaseScore(id) {
      if (Object.hasOwn(COMMENT_DEFAULT_SCORES, id)) {
        return COMMENT_DEFAULT_SCORES[id];
      }
      return id.startsWith("spoof-") ? 1 : 0;
    },

    commentDisplayScore(id) {
      const base = this.commentBaseScore(id);
      const vote = this.commentUserVotes[id];
      if (vote === "up") return base + 1;
      if (vote === "down") return base - 1;
      return base;
    },

    formatCommentScore(score) {
      const abs = Math.abs(score);
      if (abs >= 10000) {
        const compact = (abs / 1000).toFixed(1).replace(/\.0$/, "");
        return score < 0 ? `-${compact}k` : `${compact}k`;
      }
      return String(score);
    },

    voteComment(id, direction) {
      const current = this.commentUserVotes[id] || null;
      let next = current;

      if (direction === "up") {
        next = current === "up" ? null : "up";
      } else if (direction === "down") {
        next = current === "down" ? null : "down";
      }

      if (next === null) {
        const votes = { ...this.commentUserVotes };
        delete votes[id];
        this.commentUserVotes = votes;
        return;
      }

      this.commentUserVotes = { ...this.commentUserVotes, [id]: next };

      if (id !== SOCIAL_CREDIT_COMMENT_ID) return;

      if (direction === "up" && next === "up") {
        this._triggerSocialCreditReward();
      } else if (direction === "down" && next === "down") {
        this._triggerSocialCreditPenalty();
      }
    },

    _triggerSocialCreditReward() {
      this._showSocialCreditToast(
        this.t.comments?.socialCreditReward || "+783994 social credit",
        false
      );
      this._stopConfetti?.();
      this._stopConfetti = celebrateConfetti(4_500);
    },

    _triggerSocialCreditPenalty() {
      this._showSocialCreditToast(
        this.t.comments?.socialCreditPenalty || "−783994 social credit",
        true
      );
      this._stopConfetti?.();
      this._stopConfetti = null;
      this._flashSocialCreditPenalty();
    },

    _showSocialCreditToast(message, penalty) {
      this.socialCreditToastMessage = message;
      this.socialCreditToastPenalty = penalty;
      this.socialCreditToastOpen = true;

      if (this._socialCreditToastTimer != null) {
        window.clearTimeout(this._socialCreditToastTimer);
      }

      this._socialCreditToastTimer = window.setTimeout(() => {
        this.socialCreditToastOpen = false;
        this.socialCreditToastPenalty = false;
        this._socialCreditToastTimer = null;
      }, 4_500);
    },

    _flashSocialCreditPenalty() {
      this.socialCreditFlashOpen = true;

      if (this._socialCreditFlashTimer != null) {
        window.clearTimeout(this._socialCreditFlashTimer);
      }

      this._socialCreditFlashTimer = window.setTimeout(() => {
        this.socialCreditFlashOpen = false;
        this._socialCreditFlashTimer = null;
      }, 700);
    },

    submitComment() {
      if (this.commentSubmitting || this.commentRepLocked) return;
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

    onCommentMessageInput() {
      if (this.commentRepLocked || this.commentSubmitting) return;

      const message = this.commentDraft.message;
      if (!/^\s*-rep\b/i.test(message)) return;

      this.commentDraft.message = message.replace(/^\s*-rep\b\s*/i, "");
      this._lockMinusRep();
    },

    _lockMinusRep() {
      if (this._commentRepTick != null) {
        window.clearInterval(this._commentRepTick);
        this._commentRepTick = null;
      }

      const duration = 10 * 2 ** this.commentRepStrikes;
      this.commentRepStrikes += 1;
      this.commentRepLocked = true;
      this.commentRepLockLeft = duration;

      this._commentRepTick = window.setInterval(() => {
        this.commentRepLockLeft = Math.max(0, this.commentRepLockLeft - 1);
        if (this.commentRepLockLeft <= 0) {
          this._clearMinusRepLock();
        }
      }, 1000);
    },

    _clearMinusRepLock() {
      if (this._commentRepTick != null) {
        window.clearInterval(this._commentRepTick);
        this._commentRepTick = null;
      }
      this.commentRepLocked = false;
      this.commentRepLockLeft = 0;
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
        this._infiniteScroll = initInfiniteScroll({
          source: this.$root.querySelector("[data-infinite-source]"),
          echoes: this.$refs.infiniteEchoes,
          sentinel: this.$refs.infiniteSentinel,
          getMarks: () => this.t.ui.infiniteMarks || [],
        });
        this._bindStackFlip();
        this.initAboutActivity();
      });
    },

    destroy() {
      window.removeEventListener("resize", this._onNavResize);
      this._onNavResize = null;
      this._unbindStackFlip();
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
      this._clearMinusRepLock();
      if (this._socialCreditToastTimer != null) {
        window.clearTimeout(this._socialCreditToastTimer);
        this._socialCreditToastTimer = null;
      }
      if (this._socialCreditFlashTimer != null) {
        window.clearTimeout(this._socialCreditFlashTimer);
        this._socialCreditFlashTimer = null;
      }
      this.socialCreditToastOpen = false;
      this.socialCreditToastPenalty = false;
      this.socialCreditFlashOpen = false;
      this._stopConfetti?.();
      this._stopConfetti = null;
      this._heroPhysics?.destroy?.();
      this._heroPhysics = null;
      this._infiniteScroll?.destroy?.();
      this._infiniteScroll = null;
      this.destroyAboutActivity();
      this.destroyMinecraftMine();
    },
    },
    {
      ...Object.getOwnPropertyDescriptors(aboutActivityMethods()),
      ...Object.getOwnPropertyDescriptors(minecraftMineMethods()),
    }
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function spoofToneFromBody(body) {
  const text = String(body || "")
    .replace(/\|\|.+?\|\|/g, " ")
    .trim()
    .toLowerCase();
  if (text.startsWith("+rep")) return "plus";
  if (text.startsWith("-rep")) return "minus";
  return "neutral";
}

/** Split `||spoiler||` markers into plain / blurred segments. */
function parseCommentBody(body) {
  const text = String(body || "");
  const segments = [];
  const re = /\|\|(.+?)\|\|/g;
  let lastIndex = 0;
  let match;

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }
    segments.push({ text: match[1], blur: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments.length ? segments : [{ text }];
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
