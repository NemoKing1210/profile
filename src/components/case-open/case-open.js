import { isAchievementUnlocked } from "../../shared/data/achievements.js";
import { techBalls } from "../../shared/data/tech-balls.js";
import {
  burstConfettiAt,
  celebrateConfetti,
} from "../../shared/lib/confetti.js";
import {
  BALLOON_EMOJIS,
  buildReel,
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

/**
 * @returns {Record<string, unknown>}
 */
export function caseOpenState() {
  return {
    caseOpening: false,
    caseReelItems: [],
    caseReelOffset: 0,
    caseReelTransitionMs: 0,
    caseLastRewardId: "",
    caseLastEmoji: "",
    caseLastRarity: "consumer",
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
      this.caseResultText = "";
      this.caseResultLabel = "";
      this.caseResultNote = "";
      this.caseLastRewardId = "";
      this.caseLastEmoji = "";
      this.caseLastRarity = "consumer";
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
        case "heroSpawn":
          this._rewardHeroSpawn();
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
      this.caseResultLabel = label;
      this.caseResultNote = note;
      this.caseResultText = note || formatResult(this, label);
      this.caseResultKey += 1;
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

    _rewardHeroSpawn() {
      const physics = this._heroPhysics;
      const ball =
        techBalls[Math.floor(Math.random() * techBalls.length)];
      if (physics?.spawnTechBall && ball) {
        physics.spawnTechBall(ball, { unique: false });
        this.showSpeechI18n?.("caseOpen.spawnLine", { holdMs: 4500 });
        return;
      }
      this._spawnCaseBalloons(6);
      this.showSpeechI18n?.("caseOpen.spawnFallback", { holdMs: 4500 });
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
