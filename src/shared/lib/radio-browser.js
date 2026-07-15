/**
 * Radio Browser API — open catalog of internet radio stations (no API key).
 * @see https://api.radio-browser.info/
 */

const API_HOSTS = [
  "https://de1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
];

const CACHE_KEY = "profile:radio-stations:v2";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8_000;

/**
 * Curated HTTPS MP3 streams that tend to work behind CIS firewalls/CDNs.
 * Used when Radio Browser is slow/unreachable or returns unplayable URLs.
 */
export const FALLBACK_STATIONS = [
  {
    id: "fallback-laut-lofi",
    name: "laut.fm · LoFi",
    streamUrl: "https://lofi.stream.laut.fm/lofi",
    homepage: "https://laut.fm/lofi",
    favicon: "",
    tags: "lofi",
    codec: "MP3",
  },
  {
    id: "fallback-laut-chillout",
    name: "laut.fm · Chillout",
    streamUrl: "https://chillout.stream.laut.fm/chillout",
    homepage: "https://laut.fm/chillout",
    favicon: "",
    tags: "chillout,ambient",
    codec: "MP3",
  },
  {
    id: "fallback-laut-ambient",
    name: "laut.fm · Ambient",
    streamUrl: "https://ambient.stream.laut.fm/ambient",
    homepage: "https://laut.fm/ambient",
    favicon: "",
    tags: "ambient",
    codec: "MP3",
  },
  {
    id: "fallback-plaza",
    name: "Nightwave Plaza",
    streamUrl: "https://radio.plaza.one/mp3",
    homepage: "https://plaza.one/",
    favicon: "",
    tags: "lofi,vaporwave",
    codec: "MP3",
  },
];

/**
 * @typedef {object} RadioStation
 * @property {string} id
 * @property {string} name
 * @property {string} streamUrl
 * @property {string} homepage
 * @property {string} favicon
 * @property {string} tags
 * @property {string} codec
 */

/**
 * @param {object} raw
 * @returns {RadioStation | null}
 */
function mapStation(raw) {
  const streamUrl = String(raw?.url_resolved || raw?.url || "").trim();
  if (!streamUrl.startsWith("https://")) return null;
  const lower = streamUrl.toLowerCase();
  if (
    lower.endsWith(".pls") ||
    lower.endsWith(".m3u") ||
    lower.endsWith(".m3u8") ||
    lower.includes(".pls?") ||
    lower.includes(".m3u?")
  ) {
    return null;
  }
  const id = String(raw?.stationuuid || "").trim();
  if (!id) return null;
  return {
    id,
    name: String(raw?.name || "Radio").trim() || "Radio",
    streamUrl,
    homepage: String(raw?.homepage || "").trim(),
    favicon: String(raw?.favicon || "").trim(),
    tags: String(raw?.tags || "").trim(),
    codec: String(raw?.codec || "").trim(),
  };
}

/**
 * @param {string} path
 * @param {Record<string, string | number | boolean>} [params]
 */
async function fetchJson(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    query.set(key, String(value));
  }
  const qs = query.toString();
  const suffix = qs ? `?${qs}` : "";

  let lastError = null;
  for (const host of API_HOSTS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      // Avoid custom Accept — it triggers a CORS preflight that some mirrors mishandle.
      const res = await fetch(`${host}${path}${suffix}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        lastError = new Error(`Radio Browser ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (err) {
      lastError = err;
    } finally {
      window.clearTimeout(timer);
    }
  }
  throw lastError || new Error("Radio Browser unreachable");
}

/**
 * Prefer short names + MP3 hosts that browsers actually play.
 * @param {RadioStation[]} stations
 */
function rankStations(stations) {
  return [...stations].sort((a, b) => scoreStation(b) - scoreStation(a));
}

/** @param {RadioStation} station */
function scoreStation(station) {
  let score = 0;
  const codec = station.codec.toLowerCase();
  const url = station.streamUrl.toLowerCase();
  const nameLen = station.name.length;

  if (codec.includes("mp3") || codec.includes("mpeg")) score += 8;
  if (url.includes("laut.fm")) score += 10;
  if (url.includes("stream.")) score += 3;
  if (url.includes("icecast") || url.includes("/stream")) score += 2;
  if (url.includes("somafm")) score -= 4; // often blocked / flaky from some networks
  if (nameLen > 80) score -= 3;
  if (nameLen > 140) score -= 6;
  return score;
}

/**
 * @param {{ tags?: string[]; limit?: number }} [opts]
 * @returns {Promise<RadioStation[]>}
 */
export async function fetchAmbientStations(opts = {}) {
  const tags = opts.tags?.length ? opts.tags : ["ambient", "chillout", "lofi"];
  const limit = Math.min(40, Math.max(6, opts.limit ?? 18));
  const cacheKey = `${CACHE_KEY}:${tags.join("+")}:${limit}`;

  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (
      cached?.savedAt &&
      Date.now() - cached.savedAt < CACHE_TTL_MS &&
      Array.isArray(cached.stations) &&
      cached.stations.length
    ) {
      return mergeWithFallback(cached.stations, limit);
    }
  } catch {
    /* ignore bad cache */
  }

  /** @type {Map<string, RadioStation>} */
  const byId = new Map();

  await Promise.all(
    tags.map(async (tag) => {
      try {
        const rows = await fetchJson("/json/stations/search", {
          tag,
          limit: Math.ceil(limit / tags.length) + 6,
          hidebroken: true,
          order: "clickcount",
          reverse: true,
          is_https: true,
          codec: "mp3",
        });
        if (!Array.isArray(rows)) return;
        for (const row of rows) {
          const station = mapStation(row);
          if (station) byId.set(station.id, station);
        }
      } catch {
        /* try next tag / fall through to curated list */
      }
    })
  );

  let stations = rankStations([...byId.values()]).slice(0, limit);
  stations = mergeWithFallback(stations, limit);

  if (!stations.length) {
    throw new Error("No radio stations found");
  }

  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ savedAt: Date.now(), stations })
    );
  } catch {
    /* quota / private mode */
  }

  return stations;
}

/**
 * @param {RadioStation[]} stations
 * @param {number} limit
 */
function mergeWithFallback(stations, limit) {
  const byUrl = new Map();
  for (const station of [...FALLBACK_STATIONS, ...stations]) {
    if (!byUrl.has(station.streamUrl)) {
      byUrl.set(station.streamUrl, station);
    }
  }
  return rankStations([...byUrl.values()]).slice(0, Math.max(limit, FALLBACK_STATIONS.length));
}

/** Best-effort vote so popular ambient stations stay discoverable. */
export function recordStationClick(stationId) {
  if (!stationId || stationId.startsWith("fallback-")) return;
  const path = `/json/url/${encodeURIComponent(stationId)}`;
  const host = API_HOSTS[0];
  const controller = new AbortController();
  window.setTimeout(() => controller.abort(), 4_000);
  fetch(`${host}${path}`, { signal: controller.signal }).catch(() => {});
}
