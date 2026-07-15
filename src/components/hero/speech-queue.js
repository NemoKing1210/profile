/**
 * FIFO speech jobs with identity-based dedupe.
 * Sticky tips (holdMs == null) keep only the latest entry in the queue.
 *
 * Implemented as a factory + closure (not a class with private fields) so the
 * queue stays usable when Alpine wraps component state in a Proxy.
 */

/**
 * @typedef {object} SpeechAction
 * @property {string} [label]
 * @property {string|null} [labelI18n]
 * @property {string} method — name of a method on the Alpine page root
 * @property {string|null} [icon] — key in `icons` / heroicons map
 * @property {"green"|"accent"|"hot"|"danger"|"muted"|null} [tone]
 */

/**
 * @typedef {object} SpeechJob
 * @property {string} identity
 * @property {string} [text]
 * @property {string|null} [i18nPath]
 * @property {number|null} holdMs
 * @property {SpeechAction|null} [action]
 */

/**
 * @returns {{
 *   readonly size: number,
 *   has: (identity: string) => boolean,
 *   enqueue: (job: SpeechJob) => boolean,
 *   dequeue: () => SpeechJob|null,
 *   removeWhere: (predicate: (job: SpeechJob) => boolean) => void,
 *   clear: () => void,
 * }}
 */
export function createSpeechQueue() {
  /** @type {SpeechJob[]} */
  const jobs = [];

  return {
    get size() {
      return jobs.length;
    },

    /** @param {string} identity */
    has(identity) {
      return jobs.some((job) => job.identity === identity);
    },

    /**
     * @param {SpeechJob} job
     * @returns {boolean} true when the job was added
     */
    enqueue(job) {
      if (!job?.identity) return false;

      if (job.holdMs == null) {
        for (let i = jobs.length - 1; i >= 0; i -= 1) {
          if (jobs[i].holdMs == null) jobs.splice(i, 1);
        }
      }

      if (jobs.some((item) => item.identity === job.identity)) return false;

      jobs.push(job);
      return true;
    },

    /** @returns {SpeechJob|null} */
    dequeue() {
      return jobs.shift() ?? null;
    },

    /**
     * @param {(job: SpeechJob) => boolean} predicate
     */
    removeWhere(predicate) {
      for (let i = jobs.length - 1; i >= 0; i -= 1) {
        if (predicate(jobs[i])) jobs.splice(i, 1);
      }
    },

    clear() {
      jobs.length = 0;
    },
  };
}
