import { celebrateConfetti } from "../../shared/lib/confetti.js";

const SOCIAL_CREDIT_COMMENT_ID = "social-credit";
const FARM_RAID_COMMENT_ID = "farm-raid";
const FARM_RAID_AUTHOR = "kalerkin_dust";
const FARM_RAID_REPLY_DELAY_MS = 3_000;
const FARM_RAID_REPLY_FALLBACKS = [
  "РџРѕС€РµР» РїРёС‚СЊ РєРѕС„Рµ, Р±СѓРґСѓ С‡РµСЂРµР· 3 С‡Р°СЃР°",
  "РћС‚РѕС€РµР» РїРѕРєРѕСЂРјРёС‚СЊ РєРѕС€РµРє, РїСЂРёР№РґСѓ РјРёРЅРёРјСѓРј С‡РµСЂРµР· 12 С‡Р°СЃРѕРІ 20 РјРёРЅСѓС‚",
  "РџРѕС‚РѕРїР°Р» РІ РјР°РіР°Р·РёРЅ. Р–РґРёС‚Рµ РјРµРЅСЏ СЃ РїРµСЂРІС‹Рј Р»СѓС‡РѕРј СЃРѕР»РЅС†Р°, СЏ РїСЂРёРґСѓ РЅР° РїСЏС‚С‹Р№ РґРµРЅСЊ, СЃ РІРѕСЃС‚РѕРєР°",
  "РќРµ Р¶РґРёС‚Рµ",
];

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

/** Days ago вЂ” locale-agnostic sort key (lower = newer). */
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

export function commentsState() {
  return {
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
    liveCommentReplies: [],
    _spoofInjected: false,
    _farmRaidRepliesStarted: false,
    _farmRaidReplyTimers: [],
    _commentTimer: null,
    _commentWaitTimer: null,
    _commentStartedAt: 0,
    _commentRepTick: null,
    _socialCreditToastTimer: null,
    _socialCreditFlashTimer: null,
  };
}

export function commentsMethods() {
  return {
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

      const liveRepliesByParent = {};
      for (const reply of this.liveCommentReplies || []) {
        const pid = reply.parentId;
        if (!liveRepliesByParent[pid]) liveRepliesByParent[pid] = [];
        liveRepliesByParent[pid].push(reply);
      }

      const parents = (this.t.comments?.feed || []).map((item) => {
        const parent = enrich(item, item.when, 0, null);
        const staticReplies = (item.replies || []).map((reply) =>
          enrich(reply, reply.when, 1, item.id)
        );
        staticReplies.sort((a, b) => b.ageDays - a.ageDays);
        const dynamicReplies = (liveRepliesByParent[item.id] || []).map(
          (reply) => enrich(reply, spoofWhen, 1, item.id)
        );
        return {
          ...parent,
          replies: [...staticReplies, ...dynamicReplies],
        };
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
      const template = this.t.comments?.countLabel || "{count}";
      return template.replace("{count}", String(count));
    },

    get commentMinusRepHint() {
      const template = this.t.comments?.minusRepHint || "";
      return template.replace("{seconds}", String(this.commentRepLockLeft));
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
            Math.abs(a.score) - Math.abs(b.score) || b.ageDays - a.ageDays
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

      if (id === FARM_RAID_COMMENT_ID) {
        this._triggerFarmRaidReplies();
        return;
      }

      if (id !== SOCIAL_CREDIT_COMMENT_ID) return;

      if (direction === "up" && next === "up") {
        this._triggerSocialCreditReward();
      } else if (direction === "down" && next === "down") {
        this._triggerSocialCreditPenalty();
      }
    },

    _triggerFarmRaidReplies() {
      if (this._farmRaidRepliesStarted) return;
      this._farmRaidRepliesStarted = true;

      const bodies =
        this.t.comments?.farmRaidReplies?.length > 0
          ? this.t.comments.farmRaidReplies
          : FARM_RAID_REPLY_FALLBACKS;

      bodies.forEach((body, index) => {
        const delay = index * FARM_RAID_REPLY_DELAY_MS;
        const timer = window.setTimeout(() => {
          this._appendFarmRaidReply(body, index);
        }, delay);
        this._farmRaidReplyTimers.push(timer);
      });
    },

    _appendFarmRaidReply(body, index) {
      this.liveCommentReplies = [
        ...this.liveCommentReplies,
        {
          id: `farm-raid-reply-${index}`,
          parentId: FARM_RAID_COMMENT_ID,
          author: FARM_RAID_AUTHOR,
          body,
          tone: "neutral",
          live: true,
        },
      ];

      this.$nextTick(() => {
        document
          .getElementById("comments")
          ?.querySelector(
            `.steam-comment--live[data-comment-id="farm-raid-reply-${index}"]`
          )
          ?.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "nearest",
          });
      });
    },

    _clearFarmRaidReplyTimers() {
      for (const timer of this._farmRaidReplyTimers || []) {
        window.clearTimeout(timer);
      }
      this._farmRaidReplyTimers = [];
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
        this.t.comments?.socialCreditPenalty || "в€’783994 social credit",
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
        const step = Math.max(remaining * 0.065, 0.004);
        this.commentProgress = Math.min(this.commentProgress + step, 99.7);

        if (this.commentProgress >= 75 && !this._spoofInjected) {
          this._injectSpoofComment();
        }

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
        bodies[Math.floor(Math.random() * bodies.length)] || "+rep nice try";
      const body = typeof pick === "string" ? pick : pick.body;
      const tone =
        (typeof pick === "object" && pick.tone) || spoofToneFromBody(body);

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

    destroyComments() {
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
      this._clearFarmRaidReplyTimers();
    },
  };
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
