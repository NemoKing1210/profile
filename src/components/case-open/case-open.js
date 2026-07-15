import {
  ACHIEVEMENT_IDS,
  achievementsTotalCount,
  achievementsUnlockedCount,
  isAchievementUnlocked,
} from "../../shared/data/achievements.js";
import { ECHO_FINALE_LOOP } from "../echo-finale/index.js";
import { corruptEchoContent } from "../infinite-echo/backrooms-text.js";
import {
  burstConfettiAt,
  celebrateConfetti,
} from "../../shared/lib/confetti.js";
import {
  BALLOON_EMOJIS,
  buildReel,
  getActiveCaseRewards,
  getRewardById,
  getRewardChancePercent,
  REEL_ITEM_WIDTH,
  REEL_WIN_INDEX,
  resolveRewardRef,
  rollWeightedReward,
} from "./rewards.js";
import {
  BUG_REPORT_RICKROLL_EMBED_URL,
  BUG_REPORT_RICKROLL_URL,
} from "../bug-report/bug-report.js";

const SPIN_MS = 5200;
const REDUCED_SPIN_MS = 280;
const VAC_MS = 2800;
const SHAKE_MS = 10000;
const ACCENT_MS = 1600;
const BALLOON_LIFE_MS = 10000;
const LIGHT_FLASH_MS = 5000;
/** Match topbar `--theme-duration`. */
const THEME_FADE_MS = 320;
const BLOCK_FALL_MS = 1200;
const ALPHABET_CUBE_COUNT = 14;
const FAKE_JACKPOT_REVEAL_MS = 2400;
const FAKE_JACKPOT_REVEAL_REDUCED_MS = 900;
const BLOCK_RESIZE_MIN = 50;
const BLOCK_RESIZE_MAX = 100;
const TEXT_BLIND_MS = 30_000;

/** Prefer UI shells that look funny when scaled (mirrors minecraft preferred set). */
const CASE_SIZE_TARGETS =
  ".media-cover, .interest-chip, .interest-badge, .btn, .capsule, .meta-chip, .lang-option, .nav-link, .game-card, .project-card, .link-card, .hub-platform, .steam-comment, .ai-tool, .stack-card, .stack-flip, .stack-grow, .stack-grow__tag, .about-activity, .media-shelf, .steam-invite, .panel, .hero__identity, .hero__banner, .brand, .interest-intro, .case-open__item, .comment-card, .footer__link";

const CASE_SIZE_EXCLUDE =
  ".case-open, .case-lock, .case-rickroll, .bug-report, .scroll-top, .achievement-toast, .achievements-drawer, .infinite-echoes, .infinite-echo, .infinite-sentinel, .skip-link";

/**
 * @returns {Record<string, unknown>}
 */
export function caseOpenState() {
  return {
    caseOpening: false,
    caseReelLanded: false,
    caseReelItems: [],
    caseReelOffset: 0,
    caseReelTransitionMs: 0,
    caseLastRewardId: "",
    caseLastEmoji: "",
    caseLastRarity: "consumer",
    caseLastChance: 0,
    caseResultLabel: "",
    caseResultNote: "",
    caseResultText: "",
    caseResultKey: 0,
    caseVacOpen: false,
    caseAccentPulse: false,
    caseLockOpen: false,
    caseLockPin: "",
    caseLockDigit0: "",
    caseLockDigit1: "",
    caseLockError: false,
    caseLockFails: 0,
    /** True while a bait gold drop still wears jackpot chrome. */
    caseResultJackpotStyle: false,
    caseRickrollOpen: false,
    caseRickrollEmbedUrl: "",
    caseRickrollWatchUrl: BUG_REPORT_RICKROLL_URL,
    _caseSpinTimer: 0,
    _caseSideTimers: /** @type {number[]} */ ([]),
    _caseBalloonRoot: /** @type {HTMLElement | null} */ (null),
    /** @type {boolean | null} previous themeLight while a flash is active */
    _caseThemeRestore: null,
    _caseLockFocusTimer: 0,
    _caseFakeoutTimer: 0,
    /** @type {HTMLElement[]} */
    _caseResizedBlocks: [],
    /** Hero scroll for alphabet cubes — only once per page load. */
    _caseAlphabetScrolled: false,
  };
}

/**
 * @returns {Record<string, Function>}
 */
export function caseOpenMethods() {
  return {
    openCase(event) {
      return this._startCaseOpen(rollWeightedReward(), event);
    },

    /**
     * @param {string | number} ref
     * @param {Event} [event]
     * @returns {boolean}
     */
    openCaseWithReward(ref, event) {
      const winner = resolveRewardRef(ref);
      if (!winner) return false;
      return this._startCaseOpen(winner, event);
    },

    /**
     * @param {{ id: string, rarity: string, emoji: string, weight?: number }} winner
     * @param {Event} [event]
     * @returns {boolean}
     */
    _startCaseOpen(winner, event) {
      if (this.caseOpening) return false;

      this.caseOpening = true;
      this.caseReelLanded = false;
      this.caseResultText = "";
      this.caseResultLabel = "";
      this.caseResultNote = "";
      this.caseLastRewardId = "";
      this.caseLastEmoji = "";
      this.caseLastRarity = "consumer";
      this.caseLastChance = 0;
      this.caseVacOpen = false;
      this.caseResultJackpotStyle = false;
      this._clearCaseFakeoutTimer();

      const reel = buildReel(winner, 48, REEL_WIN_INDEX);
      this.caseReelItems = reel;
      this.caseReelTransitionMs = 0;
      this.caseReelOffset = 0;

      const reduced = prefersReducedMotion();
      const duration = reduced ? REDUCED_SPIN_MS : SPIN_MS;

      this.$nextTick(() => {
        const viewport = this.$refs.caseReelViewport;
        const viewportW = viewport?.clientWidth || 320;
        const jitter = reduced
          ? 0
          : (Math.random() - 0.5) * REEL_ITEM_WIDTH * 0.35;
        const target =
          -(
            REEL_WIN_INDEX * REEL_ITEM_WIDTH -
            viewportW / 2 +
            REEL_ITEM_WIDTH / 2
          ) + jitter;

        // Force layout so the 0 → target transition always runs.
        void viewport?.offsetWidth;
        this.caseReelTransitionMs = duration;
        this.caseReelOffset = target;

        this._clearCaseSpinTimer();
        this._caseSpinTimer = window.setTimeout(() => {
          this._caseSpinTimer = 0;
          // Snap dead-center after jitter so pointer rarity matches the result.
          const exact =
            -(
              REEL_WIN_INDEX * REEL_ITEM_WIDTH -
              (viewport?.clientWidth || viewportW) / 2 +
              REEL_ITEM_WIDTH / 2
            );
          this.caseReelTransitionMs = reduced ? 0 : 160;
          this.caseReelOffset = exact;
          this.caseReelLanded = true;
          this._finishCaseOpen(winner, event);
        }, duration + 40);
      });

      return true;
    },

    _scrollCaseIntoView() {
      this.$refs.caseOpenRoot?.scrollIntoView?.({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    },

    /**
     * @param {{ id: string, rarity: string, emoji: string }} winner
     * @param {Event} [event]
     */
    _finishCaseOpen(winner, event) {
      this.caseLastRewardId = winner.id;
      this._applyCaseReward(winner, event);
      this.caseOpening = false;
    },

    /**
     * @param {{ id: string, rarity: string, emoji: string }} winner
     * @param {Event} [event]
     */
    _applyCaseReward(winner, event) {
      const labels = this.t?.caseOpen?.rewards || {};
      const label = labels[winner.id] || winner.id;

      switch (winner.id) {
        case "caseJackpot":
          this._rewardJackpot(winner, label);
          return;
        case "fakeJackpot":
          this._rewardFakeJackpot(winner);
          return;
        case "socialCredit":
          this._rewardSocialCredit();
          break;
        case "dizziness":
          this._rewardDizziness();
          break;
        case "blockResize":
          this._rewardBlockResize();
          break;
        case "textBlind":
          this._rewardTextBlind();
          break;
        case "taunt":
          this._rewardTaunt(winner, label);
          return;
        case "siteLock":
          this._rewardSiteLock();
          break;
        case "confetti":
          this._rewardConfetti(event);
          break;
        case "emojiBalloons":
          this._spawnCaseBalloons(22 + Math.floor(Math.random() * 12));
          break;
        case "progFact":
          this._rewardProgFact();
          break;
        case "screenShake":
          this._rewardScreenShake();
          break;
        case "vacJoke":
          this._rewardVacJoke();
          break;
        case "blockSwap":
          this._rewardBlockSwap();
          break;
        case "accentPulse":
          this._rewardAccentPulse();
          break;
        case "emptyCase":
          this.showSpeechI18n?.("caseOpen.emptyLine", { holdMs: 5500 });
          break;
        case "profileTip":
          this._rewardProfileTip();
          break;
        case "localeSwitch":
          this._rewardLocaleSwitch();
          break;
        case "lightFlash":
          this._rewardLightFlash();
          break;
        case "rickroll":
          this._rewardRickroll();
          break;
        case "blockFall":
          this._rewardBlockFall();
          break;
        case "echoMidpath":
          this._rewardEchoMidpath();
          break;
        case "textCorrupt":
          this._rewardTextCorrupt();
          break;
        case "alphabetCubes":
          this._rewardAlphabetCubes();
          break;
        default:
          break;
      }

      this._setCaseResult(winner, label);
    },

    /**
     * @param {{ id: string, rarity: string, emoji: string }} winner
     * @param {string} label
     * @param {{ note?: string }} [opts]
     */
    _setCaseResult(winner, label, { note = "" } = {}) {
      this.caseLastRewardId = winner.id;
      this.caseLastEmoji = winner.emoji;
      this.caseLastRarity = winner.rarity || "consumer";
      this.caseLastChance = getRewardChancePercent(winner);
      this.caseResultLabel = label;
      this.caseResultNote = note;
      this.caseResultText = note || formatResult(this, label);
      this.caseResultKey += 1;
    },

    get caseResultRarityLabel() {
      const key = this.caseLastRarity || "consumer";
      return this.t?.caseOpen?.rarities?.[key] || key;
    },

    get caseResultChanceLabel() {
      const template = this.t?.caseOpen?.chance || "{pct}%";
      return template.replace("{pct}", String(this.caseLastChance));
    },

    /**
     * @param {{ id: string, rarity: string, emoji: string }} winner
     * @param {string} label
     */
    _rewardJackpot(winner, label) {
      const already = isAchievementUnlocked("caseJackpot");
      const newly = this.unlockAchievementRecord?.("caseJackpot");
      this.caseResultJackpotStyle = true;
      this._burstCaseJackpotConfetti(already ? 3500 : 6500);

      if (already || newly === false) {
        this.showSpeechI18n?.("caseOpen.duplicateJackpot", { holdMs: 6500 });
        this._setCaseResult(winner, label, {
          note:
            this.t?.caseOpen?.duplicateJackpot || formatResult(this, label),
        });
      } else {
        this.showSpeechI18n?.("caseOpen.jackpotLine", { holdMs: 7000 });
        this._setCaseResult(winner, label);
      }
    },

    /**
     * Looks like Gold Drop (reel + card + confetti), then flips to salt.
     * @param {{ id: string, rarity: string, emoji: string, weight?: number }} winner
     */
    _rewardFakeJackpot(winner) {
      const jackpot = getRewardById("caseJackpot");
      const jackpotLabel =
        this.t?.caseOpen?.rewards?.caseJackpot || "Gold Drop";
      const fakeLabel =
        this.t?.caseOpen?.rewards?.fakeJackpot || "Fake Jackpot";
      const note =
        this.t?.caseOpen?.fakeJackpotNote ||
        "Psych — decorative gold only. No achievement.";

      this.caseResultJackpotStyle = true;
      this._burstCaseJackpotConfetti(2800);
      this.showSpeechI18n?.("caseOpen.jackpotLine", { holdMs: 2200 });

      this._setCaseResult(
        {
          id: winner.id,
          rarity: jackpot?.rarity || "gold",
          emoji: jackpot?.emoji || "🏆",
        },
        jackpotLabel
      );
      // Spoof the legendary 1% until the reveal.
      this.caseLastChance = getRewardChancePercent(jackpot || winner);

      const delay = prefersReducedMotion()
        ? FAKE_JACKPOT_REVEAL_REDUCED_MS
        : FAKE_JACKPOT_REVEAL_MS;

      this._clearCaseFakeoutTimer();
      this._caseFakeoutTimer = window.setTimeout(() => {
        this._caseFakeoutTimer = 0;
        this._stopConfetti?.();
        this._stopConfetti = null;
        this.caseResultJackpotStyle = false;
        this.caseLastEmoji = "💔";
        this.caseLastRarity = "consumer";
        this.caseLastChance = getRewardChancePercent(winner);
        this.caseResultLabel = fakeLabel;
        this.caseResultNote = note;
        this.caseResultText = note;
        this.caseResultKey += 1;
        this.showSpeechI18n?.("caseOpen.fakeJackpotLine", { holdMs: 6500 });
      }, delay);
    },

    /** @param {number} celebrateMs */
    _burstCaseJackpotConfetti(celebrateMs) {
      this._stopConfetti?.();
      this._stopConfetti = celebrateConfetti(celebrateMs);

      const point = this.$refs.caseOpenRoot?.getBoundingClientRect?.();
      if (point) {
        burstConfettiAt(
          point.left + point.width / 2,
          point.top + point.height / 2,
          { count: 110 }
        );
      }
    },

    _clearCaseFakeoutTimer() {
      if (this._caseFakeoutTimer) {
        window.clearTimeout(this._caseFakeoutTimer);
        this._caseFakeoutTimer = 0;
      }
    },

    /** @param {Event} [event] */
    _rewardSocialCredit() {
      this._triggerSocialCreditReward?.();
      this.showSpeechI18n?.("caseOpen.socialCreditLine", { holdMs: 5500 });
    },

    _rewardDizziness() {
      // Stays on until reload — intentional “permanent” vertigo drop.
      document.documentElement.classList.add("case-dizziness");
      this.showSpeechI18n?.("caseOpen.dizzyLine", { holdMs: 5500 });
    },

    _rewardTextBlind() {
      document.documentElement.classList.add("case-text-blind");
      this.showSpeechI18n?.("caseOpen.textBlindLine", { holdMs: 6000 });
      this._pushCaseTimer(() => {
        document.documentElement.classList.remove("case-text-blind");
      }, TEXT_BLIND_MS);
    },

    /**
     * Mock the player’s trophy shelf: no jackpot → laugh, incomplete set → laugh,
     * full completion → cry.
     * @param {{ id: string, rarity: string, emoji: string }} winner
     * @param {string} label
     */
    _rewardTaunt(winner, label) {
      const hasJackpot = isAchievementUnlocked("caseJackpot");
      const allDone =
        hasJackpot &&
        achievementsUnlockedCount() >= achievementsTotalCount();

      /** @type {"tauntNoJackpot" | "tauntIncomplete" | "tauntComplete"} */
      let noteKey = "tauntNoJackpot";
      let emoji = "😈";
      if (allDone) {
        noteKey = "tauntComplete";
        emoji = "😢";
      } else if (hasJackpot) {
        noteKey = "tauntIncomplete";
      }

      const note = this.t?.caseOpen?.[noteKey] || "";
      this.showSpeechI18n?.(`caseOpen.${noteKey}`, { holdMs: 7000 });
      this._setCaseResult({ ...winner, emoji }, label, {
        note: note || undefined,
      });
    },

    _rewardBlockResize() {
      const pool = collectResizableBlocks();
      if (!pool.length) {
        this.showSpeechI18n?.("caseOpen.blockResizeFallback", { holdMs: 4500 });
        return;
      }

      const want =
        BLOCK_RESIZE_MIN +
        Math.floor(Math.random() * (BLOCK_RESIZE_MAX - BLOCK_RESIZE_MIN + 1));
      const picks = shuffleTake(pool, Math.min(want, pool.length));
      if (!this._caseResizedBlocks) this._caseResizedBlocks = [];

      for (const el of picks) {
        const factor = 0.85 + Math.random() * 0.3; // 85%–115% each hit
        const next = readCaseBlockScale(el) * factor;
        el.style.setProperty("--case-block-scale", next.toFixed(3));
        el.classList.add("case-block-resized");
        if (!this._caseResizedBlocks.includes(el)) {
          this._caseResizedBlocks.push(el);
        }
      }

      this.showSpeechI18n?.("caseOpen.blockResizeLine", { holdMs: 6000 });
    },

    _clearCaseResizedBlocks() {
      const list = this._caseResizedBlocks || [];
      for (const el of list) {
        el.classList.remove("case-block-resized");
        el.style.removeProperty("--case-block-scale");
      }
      this._caseResizedBlocks = [];
    },

    _rewardSiteLock() {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      this.caseLockPin = `${a}${b}`;
      this.caseLockDigit0 = "";
      this.caseLockDigit1 = "";
      this.caseLockError = false;
      this.caseLockFails = 0;
      this.caseLockOpen = true;
      document.documentElement.classList.add("case-lock-active");
      this.showSpeechI18n?.("caseOpen.lockLine", { holdMs: 6500 });

      if (this._caseLockFocusTimer) {
        window.clearTimeout(this._caseLockFocusTimer);
      }
      this._caseLockFocusTimer = window.setTimeout(() => {
        this._caseLockFocusTimer = 0;
        this.$refs.caseLockDigit0?.focus?.();
      }, 80);
    },

    /** How many PIN digits are revealed (1 per 5 failed guesses, max 2). */
    get caseLockHintCount() {
      return Math.min(2, Math.floor((this.caseLockFails || 0) / 5));
    },

    get caseLockHintShown() {
      return this.caseLockHintCount > 0;
    },

    get caseLockHintDisplay() {
      const n = this.caseLockHintCount;
      if (!n) return "";
      const pin = String(this.caseLockPin || "");
      const mask = this.t?.caseOpen?.lockPlaceholder || "·";
      return [0, 1]
        .map((i) => (i < n ? pin[i] ?? mask : mask))
        .join(" ");
    },

    get caseLockHintLabel() {
      const template = this.t?.caseOpen?.lockHint || "Hint: {code}";
      return template.replace("{code}", this.caseLockHintDisplay);
    },

    /**
     * @param {0 | 1} index
     * @param {Event} event
     */
    onCaseLockDigitInput(index, event) {
      if (!this.caseLockOpen) return;
      this.caseLockError = false;
      const el = /** @type {HTMLInputElement | null} */ (event?.target);
      const raw = String(el?.value || "").replace(/\D/g, "");

      // Paste / autofill may dump both digits into the first cell.
      if (index === 0 && raw.length >= 2) {
        this.caseLockDigit0 = raw[0];
        this.caseLockDigit1 = raw[1];
        if (el) el.value = raw[0];
        this.$nextTick(() => {
          this.$refs.caseLockDigit1?.focus?.();
          this.submitCaseLock();
        });
        return;
      }

      const digit = raw.slice(0, 1);
      if (index === 0) {
        this.caseLockDigit0 = digit;
        if (el) el.value = digit;
        if (digit) this.$refs.caseLockDigit1?.focus?.();
      } else {
        this.caseLockDigit1 = digit;
        if (el) el.value = digit;
        if (digit && this.caseLockDigit0) this.submitCaseLock();
      }
    },

    /**
     * @param {0 | 1} index
     * @param {KeyboardEvent} event
     */
    onCaseLockDigitKeydown(index, event) {
      if (!this.caseLockOpen) return;
      if (event.key === "Enter") {
        event.preventDefault();
        this.submitCaseLock();
        return;
      }
      if (event.key !== "Backspace") return;

      const key = index === 0 ? "caseLockDigit0" : "caseLockDigit1";
      if (this[key]) return;

      event.preventDefault();
      if (index === 1) {
        this.caseLockDigit0 = "";
        this.caseLockError = false;
        this.$refs.caseLockDigit0?.focus?.();
      }
    },

    submitCaseLock() {
      if (!this.caseLockOpen) return;
      const d0 = String(this.caseLockDigit0 || "").replace(/\D/g, "").slice(0, 1);
      const d1 = String(this.caseLockDigit1 || "").replace(/\D/g, "").slice(0, 1);
      this.caseLockDigit0 = d0;
      this.caseLockDigit1 = d1;
      if (!d0 || !d1) {
        this.caseLockError = true;
        this.$nextTick(() => {
          (d0 ? this.$refs.caseLockDigit1 : this.$refs.caseLockDigit0)?.focus?.();
        });
        return;
      }
      if (`${d0}${d1}` === this.caseLockPin) {
        this._unlockCaseLock(true);
        return;
      }

      const prevHints = this.caseLockHintCount;
      this.caseLockFails = (this.caseLockFails || 0) + 1;
      const nextHints = this.caseLockHintCount;
      this.caseLockError = true;
      this.caseLockDigit0 = "";
      this.caseLockDigit1 = "";

      if (nextHints > prevHints) {
        this.showSpeechI18n?.("caseOpen.lockHintLine", { holdMs: 4500 });
      }

      this.$nextTick(() => this.$refs.caseLockDigit0?.focus?.());
    },

    /** @param {boolean} [celebrated] */
    _unlockCaseLock(celebrated = false) {
      this.caseLockOpen = false;
      this.caseLockDigit0 = "";
      this.caseLockDigit1 = "";
      this.caseLockError = false;
      this.caseLockFails = 0;
      this.caseLockPin = "";
      document.documentElement.classList.remove("case-lock-active");
      if (celebrated) {
        this.showSpeechI18n?.("caseOpen.lockUnlocked", { holdMs: 4500 });
      }
    },

    _rewardConfetti(event) {
      const rect = event?.currentTarget?.getBoundingClientRect?.();
      const x = rect
        ? rect.left + rect.width / 2
        : window.innerWidth / 2;
      const y = rect
        ? rect.top + rect.height / 2
        : window.innerHeight * 0.45;
      burstConfettiAt(x, y, { count: 90 });
      this._stopConfetti?.();
      this._stopConfetti = celebrateConfetti(4000);
      this.showSpeechI18n?.("caseOpen.confettiLine", { holdMs: 4500 });
    },

    _rewardProgFact() {
      const facts = this.t?.caseOpen?.facts || [];
      if (!facts.length) return;
      const fact = facts[Math.floor(Math.random() * facts.length)];
      this.showSpeech?.(fact, { holdMs: 7000 });
    },

    _rewardScreenShake() {
      const target =
        document.querySelector("main") ||
        document.querySelector(".store-shell");
      if (!target) return;
      target.classList.add("case-open-shake");
      this._pushCaseTimer(() => {
        target.classList.remove("case-open-shake");
      }, SHAKE_MS);
      this.showSpeechI18n?.("caseOpen.shakeLine", { holdMs: SHAKE_MS });
    },

    _rewardVacJoke() {
      this.caseVacOpen = true;
      this.showSpeechI18n?.("caseOpen.vacLine", { holdMs: 5500 });
      this._pushCaseTimer(() => {
        this.caseVacOpen = false;
      }, VAC_MS);
    },

    _rewardBlockSwap() {
      const blocks = collectSwappablePageBlocks();
      if (blocks.length < 2) {
        this.showSpeechI18n?.("caseOpen.blockSwapFallback", { holdMs: 4500 });
        return;
      }

      const parent = blocks[0].parentElement;
      if (!parent) {
        this.showSpeechI18n?.("caseOpen.blockSwapFallback", { holdMs: 4500 });
        return;
      }

      const shuffled = shuffleTake(blocks, blocks.length);
      // Guarantee a visible reshuffle when more than one panel remains.
      if (
        shuffled.length > 1 &&
        shuffled.every((el, i) => el === blocks[i])
      ) {
        const tmp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = tmp;
      }

      for (const el of shuffled) {
        parent.appendChild(el);
      }

      this.showSpeechI18n?.("caseOpen.blockSwapLine", { holdMs: 5500 });
    },

    _rewardAccentPulse() {
      this.caseAccentPulse = true;
      this.showSpeechI18n?.("caseOpen.pulseLine", { holdMs: 4000 });
      this._pushCaseTimer(() => {
        this.caseAccentPulse = false;
      }, ACCENT_MS);
    },

    _rewardProfileTip() {
      const locked = ACHIEVEMENT_IDS.filter((id) => !isAchievementUnlocked(id));
      if (!locked.length) {
        this.showSpeechI18n?.("caseOpen.tipFallback", { holdMs: 5500 });
        return;
      }

      const id = locked[Math.floor(Math.random() * locked.length)];
      const how = this.t?.achievements?.items?.[id]?.how;
      if (!how) {
        this.showSpeechI18n?.("caseOpen.tipFallback", { holdMs: 5500 });
        return;
      }

      const template = this.t?.caseOpen?.tipTemplate || "Tip: {hint}";
      this.showSpeech?.(template.replace("{hint}", how), { holdMs: 6500 });
    },

    _rewardLocaleSwitch() {
      const current = this.locale;
      const codes = (this.localeList || [])
        .map((item) => item.code)
        .filter((code) => code && code !== current);

      if (!codes.length) {
        this.showSpeechI18n?.("caseOpen.localeFallback", { holdMs: 4500 });
        return;
      }

      const next = codes[Math.floor(Math.random() * codes.length)];
      // Celebrate: flag spawn + ui.langSwitched tip (blur commits locale mid-animation).
      this.setLocale?.(next, { celebrate: true });
    },

    _rewardLightFlash() {
      if (this._caseThemeRestore === null) {
        this._caseThemeRestore = Boolean(this.themeLight);
      }

      if (!this.themeLight) {
        this._beginThemeSwitch?.(THEME_FADE_MS);
        this.themeLight = true;
        this._syncThemeColorMeta?.();
      }

      this._pushCaseTimer(() => {
        this._restoreCaseTheme();
      }, LIGHT_FLASH_MS);

      this.showSpeechI18n?.("caseOpen.lightFlashLine", { holdMs: 5000 });
    },

    _restoreCaseTheme() {
      if (this._caseThemeRestore === null) return;
      const previous = this._caseThemeRestore;
      this._caseThemeRestore = null;
      if (this.themeLight === previous) return;
      this._beginThemeSwitch?.(THEME_FADE_MS);
      this.themeLight = previous;
      this._syncThemeColorMeta?.();
    },

    _rewardRickroll() {
      // In-page player — popup blockers kill deferred window.open after the reel.
      this.caseRickrollEmbedUrl = BUG_REPORT_RICKROLL_EMBED_URL;
      this.caseRickrollOpen = true;
      document.documentElement.classList.add("case-rickroll-active");
      this.showSpeechI18n?.("caseOpen.rickrollLine", { holdMs: 6000 });
    },

    closeCaseRickroll({ celebrated = true } = {}) {
      if (!this.caseRickrollOpen && !this.caseRickrollEmbedUrl) return;
      this.caseRickrollOpen = false;
      // Drop iframe src so audio stops immediately.
      this.caseRickrollEmbedUrl = "";
      document.documentElement.classList.remove("case-rickroll-active");
      if (!celebrated) return;
      this.unlockAchievementRecord?.("rickroll");
      this.showSpeechI18n?.("hero.bugReportReturn", { holdMs: 7000 });
    },

    _rewardBlockFall() {
      const block = this.pickRandomPageBlock?.();
      if (!(block instanceof HTMLElement)) {
        this.showSpeechI18n?.("caseOpen.blockFallFallback", { holdMs: 4500 });
        return;
      }

      // Freeze layout space so siblings don’t jump while the clone of gravity runs.
      const rect = block.getBoundingClientRect();
      if (getComputedStyle(block).position === "static") {
        block.style.width = `${rect.width}px`;
        block.style.height = `${rect.height}px`;
      }

      block.classList.add("case-block-falling");
      this.showSpeechI18n?.("caseOpen.blockFallLine", { holdMs: 5500 });

      this._pushCaseTimer(() => {
        this.markShellDestroyed?.(block);
        block.classList.remove("case-block-falling");
      }, BLOCK_FALL_MS);
    },

    _rewardEchoMidpath() {
      const scroll = this._infiniteScroll;
      if (!scroll?.seedFromLoop) {
        this.showSpeechI18n?.("caseOpen.echoMidpathFallback", { holdMs: 4500 });
        return;
      }

      const mid = Math.max(1, Math.floor(ECHO_FINALE_LOOP / 2));
      scroll.seedFromLoop(mid);
      this.showSpeechI18n?.("caseOpen.echoMidpathLine", { holdMs: 6500 });

      const target =
        this.$refs.infiniteEchoes ||
        document.querySelector(".infinite-echoes");
      target?.scrollIntoView?.({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },

    _rewardTextCorrupt() {
      const root = document.body;
      if (!root) {
        this.showSpeechI18n?.("caseOpen.textCorruptFallback", { holdMs: 4500 });
        return;
      }

      // Two passes: heavy site-wide melt, then a quick second wave.
      corruptEchoContent(root, 0.88, { budget: 1_200 });
      this._pushCaseTimer(() => {
        corruptEchoContent(root, 0.62, { budget: 480 });
      }, 420);

      document.documentElement.classList.add("case-text-corrupt");
      this._pushCaseTimer(() => {
        document.documentElement.classList.remove("case-text-corrupt");
      }, 4_500);

      this.showSpeechI18n?.("caseOpen.textCorruptLine", { holdMs: 6000 });
    },

    _rewardAlphabetCubes() {
      const physics = this._heroPhysics;
      if (!physics?.spawnLetterSquares) {
        this.showSpeechI18n?.("caseOpen.alphabetFallback", { holdMs: 4500 });
        return;
      }

      // Drop old letter cubes (and other spawned toys) then rain the alphabet.
      physics.clearSpawnedActors?.();
      physics.spawnLetterSquares(ALPHABET_CUBE_COUNT);
      this.showSpeechI18n?.("caseOpen.alphabetLine", { holdMs: 5000 });

      if (!this._caseAlphabetScrolled) {
        this._caseAlphabetScrolled = true;
        const hero = document.getElementById("hero") || this.$refs.heroPhysics;
        hero?.scrollIntoView?.({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "center",
        });
      }
    },

    /** @param {number} count */
    _spawnCaseBalloons(count) {
      this._ensureBalloonRoot();
      const root = this._caseBalloonRoot;
      if (!root) return;

      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.className = "case-open-balloon";
        el.setAttribute("aria-hidden", "true");
        el.textContent =
          BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
        el.style.left = `${4 + Math.random() * 92}%`;
        el.style.setProperty("--case-balloon-delay", `${Math.random() * 1.4}s`);
        el.style.setProperty(
          "--case-balloon-drift",
          `${(Math.random() - 0.5) * 120}px`
        );
        el.style.setProperty(
          "--case-balloon-scale",
          `${0.85 + Math.random() * 0.55}`
        );
        root.appendChild(el);
        this._pushCaseTimer(() => {
          el.remove();
        }, BALLOON_LIFE_MS + i * 40);
      }

      this.showSpeechI18n?.("caseOpen.balloonLine", { holdMs: BALLOON_LIFE_MS });
    },

    _ensureBalloonRoot() {
      if (this._caseBalloonRoot?.isConnected) return;
      const root = document.createElement("div");
      root.className = "case-open-balloons";
      root.setAttribute("aria-hidden", "true");
      document.body.appendChild(root);
      this._caseBalloonRoot = root;
    },

    /** @param {() => void} fn @param {number} ms */
    _pushCaseTimer(fn, ms) {
      const id = window.setTimeout(fn, ms);
      this._caseSideTimers.push(id);
    },

    _clearCaseSpinTimer() {
      if (this._caseSpinTimer) {
        window.clearTimeout(this._caseSpinTimer);
        this._caseSpinTimer = 0;
      }
    },

    /** Abort an in-flight reel without granting a reward. */
    _abortCaseSpin() {
      this._clearCaseSpinTimer();
      this.caseOpening = false;
      this.caseReelTransitionMs = 0;
    },

    bindCaseDebugApi() {
      const catalog = () =>
        getActiveCaseRewards().map((reward, index) => ({
          n: index + 1,
          id: reward.id,
          rarity: reward.rarity,
          emoji: reward.emoji,
          chance: getRewardChancePercent(reward),
        }));

      const api = {
        ids: () => catalog(),
        chances: () => catalog(),
        last: () => ({
          id: this.caseLastRewardId || null,
          rarity: this.caseLastRarity || null,
          emoji: this.caseLastEmoji || null,
          chance: this.caseLastChance || 0,
          label: this.caseResultLabel || "",
          note: this.caseResultNote || "",
        }),
        open: (ref) => {
          this._scrollCaseIntoView();
          if (this.caseOpening) {
            console.warn("[caseOpen] reel busy — wait or caseOpen.abort()");
            return false;
          }

          if (ref == null || ref === "") {
            const ok = this.openCase();
            console.info(
              ok
                ? "[caseOpen] spinning (random)"
                : "[caseOpen] could not start spin"
            );
            return ok;
          }

          const winner = resolveRewardRef(ref);
          if (!winner) {
            console.warn("[caseOpen] unknown reward:", ref);
            return false;
          }

          const ok = this._startCaseOpen(winner);
          console.info(
            ok
              ? `[caseOpen] spinning → ${winner.id}`
              : "[caseOpen] could not start spin"
          );
          return ok ? winner.id : false;
        },
        spin: (ref) => api.open(ref),
        give: (ref) => {
          const winner = resolveRewardRef(ref);
          if (!winner) {
            console.warn("[caseOpen] unknown reward:", ref);
            return false;
          }
          if (this.caseOpening) this._abortCaseSpin();
          this._scrollCaseIntoView();
          this._finishCaseOpen(winner);
          console.info(`[caseOpen] granted: ${winner.id}`);
          return winner.id;
        },
        pin: () => {
          if (!this.caseLockOpen) {
            console.info("[caseOpen] no active site lock");
            return null;
          }
          console.info(`[caseOpen] lock PIN: ${this.caseLockPin}`);
          return this.caseLockPin;
        },
        unlock: () => {
          if (!this.caseLockOpen) {
            console.info("[caseOpen] no active site lock");
            return false;
          }
          this._unlockCaseLock(true);
          console.info("[caseOpen] lock cleared");
          return true;
        },
        abort: () => {
          if (!this.caseOpening) {
            console.info("[caseOpen] reel idle");
            return false;
          }
          this._abortCaseSpin();
          console.info("[caseOpen] spin aborted");
          return true;
        },
        clear: () => {
          this._abortCaseSpin();
          this._clearCaseFakeoutTimer();
          for (const id of this._caseSideTimers) {
            window.clearTimeout(id);
          }
          this._caseSideTimers = [];
          this.caseResultJackpotStyle = false;
          this._restoreCaseTheme();
          this._stopConfetti?.();
          this._stopConfetti = null;
          document
            .querySelector("main")
            ?.classList.remove("case-open-shake");
          document
            .querySelector(".store-shell")
            ?.classList.remove("case-open-shake");
          this._caseBalloonRoot?.remove();
          this._caseBalloonRoot = null;
          this.caseVacOpen = false;
          this.caseAccentPulse = false;
          document.documentElement.classList.remove(
            "case-text-corrupt",
            "case-text-blind",
            "case-dizziness"
          );
          this._clearCaseResizedBlocks();
          if (this._caseLockFocusTimer) {
            window.clearTimeout(this._caseLockFocusTimer);
            this._caseLockFocusTimer = 0;
          }
          this._unlockCaseLock(false);
          this.closeCaseRickroll({ celebrated: false });
          console.info("[caseOpen] cleared active case effects");
          return true;
        },
        help: () => {
          console.info(
            [
              "caseOpen API",
              "  caseOpen.ids()              — catalog with 1-based numbers",
              "  caseOpen.chances()          — same table (id / rarity / %)",
              "  caseOpen.open()             — random spin + scroll to reel",
              "  caseOpen.open(1|id)         — force winner, then spin",
              "  caseOpen.spin(1|id)         — alias of open()",
              "  caseOpen.give(1|id)         — grant reward (no reel)",
              "  caseOpen.last()             — last landed reward",
              "  caseOpen.pin()              — print site-lock PIN if active",
              "  caseOpen.unlock()           — dismiss site lock",
              "  caseOpen.abort()            — cancel in-flight spin",
              "  caseOpen.clear()            — wipe spin + temporary effects",
              "  caseOpen.help()             — this text",
            ].join("\n")
          );
          return catalog();
        },
      };

      window.caseOpen = api;
      return api;
    },

    destroyCaseOpen() {
      this._clearCaseSpinTimer();
      this._clearCaseFakeoutTimer();
      for (const id of this._caseSideTimers) {
        window.clearTimeout(id);
      }
      this._caseSideTimers = [];
      this.caseResultJackpotStyle = false;
      this._restoreCaseTheme();

      document
        .querySelector("main")
        ?.classList.remove("case-open-shake");
      document
        .querySelector(".store-shell")
        ?.classList.remove("case-open-shake");

      this._caseBalloonRoot?.remove();
      this._caseBalloonRoot = null;
      this.caseVacOpen = false;
      this.caseAccentPulse = false;
      this.caseOpening = false;
      document.documentElement.classList.remove("case-text-corrupt");
      document.documentElement.classList.remove("case-text-blind");
      this._clearCaseResizedBlocks();
      if (this._caseLockFocusTimer) {
        window.clearTimeout(this._caseLockFocusTimer);
        this._caseLockFocusTimer = 0;
      }
      this._unlockCaseLock(false);
      this.closeCaseRickroll({ celebrated: false });
      if (window.caseOpen) {
        delete window.caseOpen;
      }
    },
  };
}

/**
 * @param {{ t?: { caseOpen?: { result?: string } } }} ctx
 * @param {string} label
 */
function formatResult(ctx, label) {
  const template = ctx.t?.caseOpen?.result || "You got: {item}";
  return template.replace("{item}", label);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Profile store sections only — never infinite-scroll clones (they lack the source attr).
 * @returns {HTMLElement[]}
 */
function collectSwappablePageBlocks() {
  const source = document.querySelector("[data-infinite-source]");
  if (!(source instanceof HTMLElement)) return [];
  return [...source.querySelectorAll(":scope > .panel")].filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.classList.contains("mc-mined")) return false;
    if (el.classList.contains("case-block-falling")) return false;
    return el.getClientRects().length > 0;
  });
}

/**
 * @returns {HTMLElement[]}
 */
function collectResizableBlocks() {
  const blocked = new Set([...document.querySelectorAll(CASE_SIZE_EXCLUDE)]);
  return [...document.querySelectorAll(CASE_SIZE_TARGETS)].filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    if (blocked.has(el)) return false;
    if (el.closest?.(CASE_SIZE_EXCLUDE)) return false;
    if (el.classList.contains("mc-mined")) return false;
    if (el.classList.contains("case-block-falling")) return false;
    return el.getClientRects().length > 0;
  });
}

/**
 * Current CSS scale for Size Chaos (defaults to 1).
 * @param {HTMLElement} el
 * @returns {number}
 */
function readCaseBlockScale(el) {
  const raw = el.style.getPropertyValue("--case-block-scale").trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * @template T
 * @param {T[]} list
 * @param {number} count
 * @returns {T[]}
 */
function shuffleTake(list, count) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.slice(0, Math.max(0, count));
}
