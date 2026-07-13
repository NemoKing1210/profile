export const ACTIVITY_WEEKS = 53;
export const ACTIVITY_DAYS = 7;
export const ACTIVITY_MAX = 4;
const ACTIVITY_START_DELAY_MS = 20_000;
const ACTIVITY_TICK_MIN_MS = 1_000;
const ACTIVITY_TICK_MAX_MS = 5_000;

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
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !this.activityRunning &&
              !this.activityComplete &&
              this._activityStartTimer == null
            ) {
              this._queueActivityAnimation();
            }
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
      );

      this._activityObserver.observe(root);
    },

    _queueActivityAnimation() {
      if (
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
      if (this.activityRunning || this.activityComplete) return;
      this.activityRunning = true;
      this._scheduleActivityTick();
    },

    _scheduleActivityTick() {
      this._stopActivityTimer();
      const span = ACTIVITY_TICK_MAX_MS - ACTIVITY_TICK_MIN_MS;
      const delay =
        ACTIVITY_TICK_MIN_MS + Math.floor(Math.random() * (span + 1));
      this._activityTimer = window.setTimeout(() => {
        this._activityTimer = null;
        this._tickActivity();
      }, delay);
    },

    _tickActivity() {
      const cells = this.activityCells;
      const upgradable = [];
      for (let i = 0; i < cells.length; i += 1) {
        if (cells[i].level < ACTIVITY_MAX) upgradable.push(i);
      }

      if (!upgradable.length) {
        this.activityComplete = true;
        this.activityRunning = false;
        return;
      }

      // Bump a random chunk of cells each interval (1–5s).
      const chunkSize = Math.min(
        upgradable.length,
        12 + Math.floor(Math.random() * 29)
      );
      for (let n = 0; n < chunkSize; n += 1) {
        const remaining = [];
        for (let i = 0; i < cells.length; i += 1) {
          if (cells[i].level < ACTIVITY_MAX) remaining.push(i);
        }
        if (!remaining.length) break;
        const idx = remaining[Math.floor(Math.random() * remaining.length)];
        const cell = cells[idx];
        cells[idx] = { ...cell, level: cell.level + 1 };
      }

      // Reassign so Alpine reliably refreshes the grid.
      this.activityCells = cells.slice();

      if (this.activityCells.every((cell) => cell.level >= ACTIVITY_MAX)) {
        this.activityComplete = true;
        this.activityRunning = false;
        return;
      }

      this._scheduleActivityTick();
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
