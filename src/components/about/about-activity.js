export const ACTIVITY_WEEKS = 53;
export const ACTIVITY_DAYS = 7;
export const ACTIVITY_MAX = 4;
const ACTIVITY_START_DELAY_MS = 20_000;
/** First gap between fills — then each tick multiplies by DECAY down to FLOOR. */
const ACTIVITY_TICK_START_MS = 2_400;
const ACTIVITY_TICK_FLOOR_MS = 90;
const ACTIVITY_TICK_DECAY = 0.86;
const ACTIVITY_BOUNCE_MS = 520;

const ACTIVITY_BOUNCE_KEYFRAMES = [
  {
    transform: "translateY(0) scale(1)",
    filter: "brightness(1)",
    boxShadow: "0 0 0 0 rgba(164, 208, 7, 0)",
  },
  {
    transform: "translateY(-4px) scale(1.45)",
    filter: "brightness(1.35)",
    boxShadow:
      "0 0 0 1px rgba(198, 232, 64, 0.95), 0 0 10px 2px rgba(164, 208, 7, 0.75), 0 0 18px 4px rgba(102, 192, 244, 0.35)",
    offset: 0.3,
  },
  {
    transform: "translateY(1px) scale(0.88)",
    filter: "brightness(1.1)",
    boxShadow:
      "0 0 0 1px rgba(164, 208, 7, 0.55), 0 0 6px 1px rgba(164, 208, 7, 0.4)",
    offset: 0.52,
  },
  {
    transform: "translateY(-2px) scale(1.18)",
    filter: "brightness(1.22)",
    boxShadow:
      "0 0 0 1px rgba(198, 232, 64, 0.8), 0 0 12px 3px rgba(164, 208, 7, 0.55)",
    offset: 0.72,
  },
  {
    transform: "translateY(0) scale(1)",
    filter: "brightness(1)",
    boxShadow: "0 0 0 0 rgba(164, 208, 7, 0)",
  },
];

export function aboutActivityState() {
  return {
    activityCells: [],
    activityMonths: [],
    activityRunning: false,
    activityComplete: false,
    activityTipOpen: false,
    activityTipDate: "",
    activityTipText: "",
    activityTipStyle: "",
    activityTipBelow: false,
    _activityTipCellId: null,
    _activityTimer: null,
    _activityStartTimer: null,
    _activityObserver: null,
    _activityInView: false,
    _activityStartSpeechDone: false,
    _activityPace: 0,
  };
}

export function aboutActivityMethods() {
  return {
    get activityContributionCount() {
      return (this.activityCells || []).reduce(
        (sum, cell) => sum + (cell.level > 0 ? cell.level * 4 + 1 : 0),
        0
      );
    },

    get activitySummary() {
      const copy = this.t.about?.activity || {};
      const template = this.activityComplete
        ? copy.summaryDone || copy.summary || "{count}"
        : copy.summary || "{count}";
      return template.replace(
        "{count}",
        String(this.activityContributionCount)
      );
    },

    get activityChartAria() {
      const copy = this.t.about?.activity || {};
      return (copy.chartAria || "").replace(
        "{count}",
        String(this.activityContributionCount)
      );
    },

    activityCellTip(cell) {
      const parts = this.activityCellTipParts(cell);
      return parts.full;
    },

    activityCellTipParts(cell) {
      const copy = this.t.about?.activity || {};
      const tips = copy.tips || [];
      const tip =
        tips[cell.tipIndex % Math.max(tips.length, 1)] || "";
      const date = formatActivityDate(cell.date, this.locale);
      const template = copy.tipTemplate || "{date}: {tip}";
      return {
        date,
        tip,
        full: template.replace("{date}", date).replace("{tip}", tip),
      };
    },

    showActivityTip(event, cell) {
      if (!cell || !event?.currentTarget) return;

      const anchor = event.currentTarget;
      const parts = this.activityCellTipParts(cell);
      this.activityTipDate = parts.date;
      this.activityTipText = parts.tip;
      this._activityTipCellId = cell.id;
      this.activityTipOpen = true;
      this.$nextTick(() => this._placeActivityTip(anchor));
    },

    hideActivityTip() {
      this.activityTipOpen = false;
      this._activityTipCellId = null;
      this.activityTipStyle = "";
      this.activityTipBelow = false;
    },

    _placeActivityTip(anchor) {
      if (!this.activityTipOpen || !anchor) return;

      const tip =
        this.$refs.activityTip ||
        document.querySelector(".about-activity__tip");
      const rect = anchor.getBoundingClientRect();
      const tipWidth = tip?.offsetWidth || 220;
      const tipHeight = tip?.offsetHeight || 64;
      const gap = 10;
      const pad = 10;

      let left = rect.left + rect.width / 2;
      left = Math.min(
        window.innerWidth - tipWidth / 2 - pad,
        Math.max(tipWidth / 2 + pad, left)
      );

      const spaceAbove = rect.top - pad;
      const below = spaceAbove < tipHeight + gap;
      const top = below ? rect.bottom + gap : rect.top - gap;

      this.activityTipBelow = below;
      this.activityTipStyle = below
        ? `left:${left}px;top:${top}px;transform:translate(-50%, 0)`
        : `left:${left}px;top:${top}px;transform:translate(-50%, -100%)`;
    },

    refreshActivityLocale() {
      if (!this.activityCells.length) return;
      this.activityMonths = buildActivityMonths(this.activityCells, this.locale);
    },

    initAboutActivity() {
      this._resetActivityGrid();
      this._bindActivityObserver();
      this._onActivityScroll = () => this.hideActivityTip();
      window.addEventListener("scroll", this._onActivityScroll, {
        passive: true,
      });
    },

    destroyAboutActivity() {
      this.hideActivityTip();
      this._stopActivityAnimation();
      this._activityInView = false;
      if (this._onActivityScroll) {
        window.removeEventListener("scroll", this._onActivityScroll);
        this._onActivityScroll = null;
      }
      if (this._activityObserver) {
        this._activityObserver.disconnect();
        this._activityObserver = null;
      }
    },

    _resetActivityGrid() {
      this.activityComplete = false;
      this.activityRunning = false;
      this._activityStartSpeechDone = false;
      this._activityPace = 0;
      this.activityCells = buildActivityCells();
      this.activityMonths = buildActivityMonths(this.activityCells, this.locale);
    },

    _bindActivityObserver() {
      if (this._activityObserver) {
        this._activityObserver.disconnect();
        this._activityObserver = null;
      }

      const root = this.$refs.aboutActivity;
      if (!root) return;

      if (prefersReducedMotion()) {
        this._fillActivityToMax();
        return;
      }

      this._activityObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          const inView = entry.intersectionRatio >= 0.35;
          if (inView === this._activityInView) return;
          if (inView) this._onActivityEnterView();
          else this._onActivityLeaveView();
        },
        { threshold: [0, 0.35], rootMargin: "0px 0px -8% 0px" }
      );

      this._activityObserver.observe(root);
    },

    _onActivityEnterView() {
      this._activityInView = true;
      if (this.activityComplete) return;

      if (this.activityRunning) {
        if (this._activityTimer == null) this._scheduleActivityTick();
        return;
      }

      this._queueActivityAnimation();
    },

    _onActivityLeaveView() {
      this._activityInView = false;
      this._stopActivityStartTimer();
      this._stopActivityTimer();
      this._hideActivityAvatarSpeech();
    },

    _hideActivityAvatarSpeech() {
      const path = this._avatarSpeechI18nPath;
      if (
        path === "about.activity.startSpeech" ||
        path === "about.activity.hoverTip"
      ) {
        this.hideSpeech?.();
      }
    },

    _speakActivityStartedIfVisible() {
      if (
        !this._activityInView ||
        this._activityStartSpeechDone ||
        this.activityComplete
      ) {
        return;
      }
      this._activityStartSpeechDone = true;
      this.showSpeechI18n("about.activity.startSpeech");
    },

    _queueActivityAnimation() {
      if (
        !this._activityInView ||
        this.activityRunning ||
        this.activityComplete ||
        this._activityStartTimer != null
      ) {
        return;
      }

      this._activityStartTimer = window.setTimeout(() => {
        this._activityStartTimer = null;
        this._startActivityAnimation();
      }, ACTIVITY_START_DELAY_MS);
    },

    _startActivityAnimation() {
      if (
        !this._activityInView ||
        this.activityRunning ||
        this.activityComplete
      ) {
        return;
      }
      this.activityRunning = true;
      this._scheduleActivityTick();
    },

    _scheduleActivityTick() {
      if (!this._activityInView || this.activityComplete) return;
      this._stopActivityTimer();
      const pace = this._activityPace || 0;
      const delay = Math.max(
        ACTIVITY_TICK_FLOOR_MS,
        Math.round(ACTIVITY_TICK_START_MS * ACTIVITY_TICK_DECAY ** pace)
      );
      this._activityTimer = window.setTimeout(() => {
        this._activityTimer = null;
        this._tickActivity();
      }, delay);
    },

    _tickActivity() {
      if (!this._activityInView) return;

      const prev = this.activityCells;
      const next = prev.map((cell) => ({ ...cell }));
      const upgradable = [];
      for (let i = 0; i < next.length; i += 1) {
        if (next[i].level < ACTIVITY_MAX) upgradable.push(i);
      }

      if (!upgradable.length) {
        this.activityComplete = true;
        this.activityRunning = false;
        return;
      }

      const pace = this._activityPace || 0;
      // Base batch grows with pace so late fills feel like a rush.
      const chunkSize = Math.min(
        upgradable.length,
        10 + Math.floor(Math.random() * 16) + Math.floor(pace * 3.2)
      );
      const bumpedIds = new Set();
      for (let n = 0; n < chunkSize; n += 1) {
        const remaining = [];
        for (let i = 0; i < next.length; i += 1) {
          if (next[i].level < ACTIVITY_MAX) remaining.push(i);
        }
        if (!remaining.length) break;
        const idx = remaining[Math.floor(Math.random() * remaining.length)];
        next[idx] = { ...next[idx], level: next[idx].level + 1 };
        bumpedIds.add(next[idx].id);
      }

      this.activityCells = next;
      this._activityPace = pace + 1;

      if (bumpedIds.size > 0) {
        this._speakActivityStartedIfVisible();
        this.$nextTick(() => this._bounceActivityCells([...bumpedIds]));
      }

      if (this.activityCells.every((cell) => cell.level >= ACTIVITY_MAX)) {
        this.activityComplete = true;
        this.activityRunning = false;
        return;
      }

      this._scheduleActivityTick();
    },

    _bounceActivityCells(cellIds) {
      if (prefersReducedMotion() || !cellIds?.length) return;

      const root =
        this.$refs.aboutActivity ||
        document.querySelector(".about-activity");
      if (!root) return;

      for (const id of cellIds) {
        const el = root.querySelector(`[data-cell-id="${CSS.escape(String(id))}"]`);
        if (!el) continue;

        el.getAnimations?.().forEach((animation) => animation.cancel());
        el.classList.remove("about-activity__cell--bounce");

        if (typeof el.animate === "function") {
          el.classList.add("about-activity__cell--bounce");
          const animation = el.animate(ACTIVITY_BOUNCE_KEYFRAMES, {
            duration: ACTIVITY_BOUNCE_MS,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            fill: "both",
          });
          animation.onfinish = () => {
            el.classList.remove("about-activity__cell--bounce");
          };
          animation.oncancel = () => {
            el.classList.remove("about-activity__cell--bounce");
          };
          continue;
        }

        // Fallback if WAAPI is unavailable.
        void el.offsetWidth;
        el.classList.add("about-activity__cell--bounce");
        window.setTimeout(() => {
          el.classList.remove("about-activity__cell--bounce");
        }, ACTIVITY_BOUNCE_MS);
      }
    },

    _fillActivityToMax() {
      this.activityCells = this.activityCells.map((cell) => ({
        ...cell,
        level: ACTIVITY_MAX,
      }));
      this.activityComplete = true;
      this.activityRunning = false;
    },

    _stopActivityAnimation() {
      this._stopActivityTimer();
      this._stopActivityStartTimer();
      this.activityRunning = false;
    },

    _stopActivityTimer() {
      if (this._activityTimer != null) {
        window.clearTimeout(this._activityTimer);
        this._activityTimer = null;
      }
    },

    _stopActivityStartTimer() {
      if (this._activityStartTimer != null) {
        window.clearTimeout(this._activityStartTimer);
        this._activityStartTimer = null;
      }
    },
  };
}

function buildActivityCells() {
  const totalDays = ACTIVITY_WEEKS * ACTIVITY_DAYS;
  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - (totalDays - 1));

  const cells = [];
  for (let index = 0; index < totalDays; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    cells.push({
      id: index,
      week: Math.floor(index / ACTIVITY_DAYS),
      day: index % ACTIVITY_DAYS,
      date: date.toISOString(),
      level: Math.floor(Math.random() * 3),
      tipIndex: Math.floor(Math.random() * 1000),
    });
  }
  return cells;
}

function buildActivityMonths(cells, locale) {
  const labels = monthLabelsForLocale(locale);
  const months = [];
  let lastMonth = -1;

  cells.forEach((cell) => {
    if (cell.day !== 0) return;
    const month = new Date(cell.date).getMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    months.push({
      key: `${cell.week}-${month}`,
      label: labels[month] || "",
      week: cell.week,
    });
  });

  return months;
}

function monthLabelsForLocale(locale) {
  const formatter = new Intl.DateTimeFormat(locale || "en", {
    month: "short",
  });
  return Array.from({ length: 12 }, (_, month) =>
    formatter.format(new Date(2024, month, 1))
  );
}

function formatActivityDate(date, locale) {
  return new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
