import { isAchievementUnlocked } from "../../shared/data/achievements.js";
import { ECHO_FINALE_LOOP } from "../echo-finale/index.js";
import { corruptEchoContent } from "../infinite-echo/backrooms-text.js";
import {
  burstConfettiAt,
  celebrateConfetti,
} from "../../shared/lib/confetti.js";
import {
  BALLOON_EMOJIS,
  buildReel,
  getRewardChancePercent,
  REEL_ITEM_WIDTH,
  REEL_WIN_INDEX,
  rollWeightedReward,
} from "./rewards.js";

const SPIN_MS = 5200;
const REDUCED_SPIN_MS = 280;
const TITLE_GLITCH_MS = 4000;
const VAC_MS = 2800;
const SHAKE_MS = 700;
const ACCENT_MS = 1600;
const BALLOON_LIFE_MS = 4200;
const LIGHT_FLASH_MS = 5000;
/** Match topbar `--theme-duration`. */
const THEME_FADE_MS = 320;
const BLOCK_FALL_MS = 1200;
const ALPHABET_CUBE_COUNT = 14;

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
    _caseSpinTimer: 0,
    _caseSideTimers: /** @type {number[]} */ ([]),
    _caseTitleBackup: "",
    _caseBalloonRoot: /** @type {HTMLElement | null} */ (null),
    /** @type {boolean | null} previous themeLight while a flash is active */
    _caseThemeRestore: null,
  };
}

/**
 * @returns {Record<string, Function>}
 */
export function caseOpenMethods() {
  return {
    openCase(event) {
      if (this.caseOpening) return;

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

      const winner = rollWeightedReward();
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
          this.caseReelLanded = true;
          this._finishCaseOpen(winner, event);
        }, duration + 40);
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
        case "socialCredit":
          this._rewardSocialCredit();
          break;
        case "dizziness":
          this._rewardDizziness();
          break;
        case "confetti":
          this._rewardConfetti(event);
          break;
        case "emojiBalloons":
          this._spawnCaseBalloons(8 + Math.floor(Math.random() * 5));
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
        case "titleGlitch":
          this._rewardTitleGlitch();
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
      this._stopConfetti?.();
      this._stopConfetti = celebrateConfetti(already ? 3500 : 6500);

      const point = this.$refs.caseOpenRoot?.getBoundingClientRect?.();
      if (point) {
        burstConfettiAt(
          point.left + point.width / 2,
          point.top + point.height / 2,
          { count: 110 }
        );
      }

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
      this.showSpeechI18n?.("caseOpen.shakeLine", { holdMs: 4000 });
    },

    _rewardVacJoke() {
      this.caseVacOpen = true;
      this.showSpeechI18n?.("caseOpen.vacLine", { holdMs: 5500 });
      this._pushCaseTimer(() => {
        this.caseVacOpen = false;
      }, VAC_MS);
    },

    _rewardTitleGlitch() {
      if (!this._caseTitleBackup) {
        this._caseTitleBackup = document.title;
      }
      const gag =
        this.t?.caseOpen?.titleGag || "VAC SECURED · profile.exe";
      document.title = gag;
      this.showSpeechI18n?.("caseOpen.titleLine", { holdMs: 4500 });
      this._pushCaseTimer(() => {
        if (this._caseTitleBackup) {
          document.title = this._caseTitleBackup;
          this._caseTitleBackup = "";
        }
      }, TITLE_GLITCH_MS);
    },

    _rewardAccentPulse() {
      this.caseAccentPulse = true;
      this.showSpeechI18n?.("caseOpen.pulseLine", { holdMs: 4000 });
      this._pushCaseTimer(() => {
        this.caseAccentPulse = false;
      }, ACCENT_MS);
    },

    _rewardProfileTip() {
      const tips = this.t?.caseOpen?.tips || [];
      if (!tips.length) {
        this.showSpeechI18n?.("caseOpen.tipFallback", { holdMs: 5500 });
        return;
      }
      const tip = tips[Math.floor(Math.random() * tips.length)];
      this.showSpeech?.(tip, { holdMs: 6500 });
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
      this.onBugReportClick?.();
      this.showSpeechI18n?.("caseOpen.rickrollLine", { holdMs: 6000 });
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

      const hero = document.getElementById("hero") || this.$refs.heroPhysics;
      hero?.scrollIntoView?.({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
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
        el.style.left = `${8 + Math.random() * 84}%`;
        el.style.setProperty("--case-balloon-delay", `${Math.random() * 0.45}s`);
        el.style.setProperty(
          "--case-balloon-drift",
          `${(Math.random() - 0.5) * 80}px`
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

      this.showSpeechI18n?.("caseOpen.balloonLine", { holdMs: 4000 });
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

    destroyCaseOpen() {
      this._clearCaseSpinTimer();
      for (const id of this._caseSideTimers) {
        window.clearTimeout(id);
      }
      this._caseSideTimers = [];
      this._restoreCaseTheme();

      if (this._caseTitleBackup) {
        document.title = this._caseTitleBackup;
        this._caseTitleBackup = "";
      }

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
