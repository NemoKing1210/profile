import profile from "../../shared/data/profile.js";
import {
  FALLBACK_STATIONS,
  fetchAmbientStations,
  recordStationClick,
} from "../../shared/lib/radio-browser.js";

const VOLUME_KEY = "profile:music-volume";
const EXPANDED_KEY = "profile:music-expanded";
const GENRE_KEY = "profile:music-genre";
const DEFAULT_VOLUME = 0.35;
const PROBE_TIMEOUT_MS = 4_500;
const PROBE_STATION_LIMIT = 3;

function musicConfig() {
  return profile.musicPlayer || {};
}

function genreList() {
  const genres = musicConfig().genres;
  return Array.isArray(genres) && genres.length
    ? genres
    : [{ id: "ambient", tags: ["ambient"], fallback: true }];
}

function defaultGenreId() {
  const cfg = musicConfig();
  const genres = genreList();
  if (cfg.defaultGenre && genres.some((g) => g.id === cfg.defaultGenre)) {
    return cfg.defaultGenre;
  }
  return genres[0].id;
}

function readStoredVolume() {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw == null) return DEFAULT_VOLUME;
    const n = Number(raw);
    if (!Number.isFinite(n)) return DEFAULT_VOLUME;
    return Math.min(1, Math.max(0, n));
  } catch {
    return DEFAULT_VOLUME;
  }
}

function readExpanded() {
  try {
    return localStorage.getItem(EXPANDED_KEY) === "1";
  } catch {
    return false;
  }
}

function readStoredGenre() {
  try {
    const id = localStorage.getItem(GENRE_KEY);
    if (id && genreList().some((g) => g.id === id)) return id;
  } catch {
    /* ignore */
  }
  return defaultGenreId();
}

function resolveGenre(genreId) {
  return genreList().find((g) => g.id === genreId) || genreList()[0];
}

export function musicPlayerState() {
  return {
    /** Entire dock is hidden until a stream proves reachable (or after total failure). */
    musicVisible: false,
    musicBooting: true,
    musicOpen: false,
    musicReady: false,
    musicLoading: false,
    musicBuffering: false,
    musicError: false,
    musicPlaying: false,
    musicVolume: readStoredVolume(),
    musicGenreId: readStoredGenre(),
    musicStations: [],
    musicIndex: 0,
    musicTrack: null,
    _musicAudio: null,
    _musicLoadPromise: null,
    _musicSkipTries: 0,
    _musicPlayToken: 0,
    _musicWantOpen: readExpanded(),
  };
}

export function musicPlayerMethods() {
  return {
    get musicHasTrack() {
      return Boolean(this.musicTrack?.streamUrl);
    },

    get musicBusy() {
      return Boolean(this.musicLoading || this.musicBuffering || this.musicBooting);
    },

    get musicVolumePct() {
      return Math.round((this.musicVolume ?? 0) * 100);
    },

    get musicGenreOptions() {
      return genreList();
    },

    musicGenreName(id) {
      return this.t?.ui?.musicGenres?.[id] || id;
    },

    async initMusicPlayer() {
      this.musicBooting = true;
      this.musicLoading = true;
      this.musicError = false;
      try {
        const ok = await this._bootstrapMusic();
        if (!ok) {
          this._hideMusicPlayer();
          return;
        }
        this.musicVisible = true;
        this.musicReady = true;
        if (this._musicWantOpen) {
          this.musicOpen = true;
          this._persistMusicOpen();
        }
      } catch {
        this._hideMusicPlayer();
      } finally {
        this.musicBooting = false;
        this.musicLoading = false;
      }
    },

    async _bootstrapMusic() {
      const stations = await this.ensureMusicPlaylist({ force: true });
      if (!stations?.length) return false;
      return this._probeReachableStation();
    },

    async _probeReachableStation() {
      this._bindMusicAudio();
      const audio = this._musicAudio;
      if (!audio || !this.musicStations.length) return false;

      const limit = Math.min(PROBE_STATION_LIMIT, this.musicStations.length);
      for (let i = 0; i < limit; i += 1) {
        const station = this.musicStations[i];
        if (!station?.streamUrl) continue;
        const reachable = await this._probeStream(audio, station.streamUrl);
        if (reachable) {
          this.musicIndex = i;
          this.musicTrack = station;
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
          return true;
        }
      }
      return false;
    },

    _probeStream(audio, url) {
      return new Promise((resolve) => {
        let done = false;
        const finish = (ok) => {
          if (done) return;
          done = true;
          window.clearTimeout(timer);
          audio.removeEventListener("loadeddata", onReady);
          audio.removeEventListener("canplay", onReady);
          audio.removeEventListener("error", onError);
          resolve(ok);
        };
        const onReady = () => finish(true);
        const onError = () => finish(false);
        const timer = window.setTimeout(() => finish(false), PROBE_TIMEOUT_MS);

        audio.pause();
        audio.muted = true;
        audio.preload = "auto";
        audio.addEventListener("loadeddata", onReady);
        audio.addEventListener("canplay", onReady);
        audio.addEventListener("error", onError);
        audio.src = url;
        audio.load();
        audio.play().catch(() => {});
      }).finally(() => {
        audio.muted = false;
        audio.preload = "none";
      });
    },

    _hideMusicPlayer() {
      this.musicVisible = false;
      this.musicOpen = false;
      this.musicReady = false;
      this.musicPlaying = false;
      this.musicBuffering = false;
      this.musicError = true;
      this.musicTrack = null;
      this._musicWantOpen = false;
      this._persistMusicOpen();
      if (this._musicAudio) {
        this._musicAudio.pause();
        this._musicAudio.removeAttribute("src");
        this._musicAudio.load();
      }
    },

    toggleMusicPanel() {
      if (!this.musicVisible) return;
      this.musicOpen = !this.musicOpen;
      this._musicWantOpen = this.musicOpen;
      this._persistMusicOpen();
      if (this.musicOpen) {
        this.ensureMusicPlaylist();
      }
    },

    closeMusicPanel() {
      if (!this.musicOpen) return;
      this.musicOpen = false;
      this._musicWantOpen = false;
      this._persistMusicOpen();
    },

    _persistMusicOpen() {
      try {
        localStorage.setItem(EXPANDED_KEY, this.musicOpen ? "1" : "0");
      } catch {
        /* ignore */
      }
    },

    _persistMusicGenre() {
      try {
        localStorage.setItem(GENRE_KEY, this.musicGenreId);
      } catch {
        /* ignore */
      }
    },

    async selectMusicGenre(genreId) {
      if (!this.musicVisible || !genreId) return;
      if (genreId === this.musicGenreId || this.musicLoading || this.musicBooting) {
        return;
      }
      if (!genreList().some((g) => g.id === genreId)) return;

      const wasPlaying = this.musicPlaying;
      this.musicGenreId = genreId;
      this._persistMusicGenre();
      this._musicPlayToken += 1;
      this._musicSkipTries = 0;
      this.musicError = false;

      if (this._musicAudio) {
        this._musicAudio.pause();
        this._musicAudio.removeAttribute("src");
        this._musicAudio.load();
      }
      this.musicPlaying = false;
      this.musicBuffering = false;
      this.musicStations = [];
      this.musicTrack = null;
      this.musicIndex = 0;

      const stations = await this.ensureMusicPlaylist({ force: true });
      if (!stations?.length) {
        this.musicError = true;
        this.musicReady = false;
        return;
      }

      this.musicIndex = 0;
      this.musicTrack = stations[0];
      this.musicReady = true;
      if (wasPlaying) {
        await this._playCurrentStation();
      }
    },

    async ensureMusicPlaylist({ force = false } = {}) {
      if (!force && this.musicStations.length) {
        return this.musicStations;
      }
      if (!force && this._musicLoadPromise) {
        return this._musicLoadPromise;
      }

      this.musicLoading = true;
      this.musicError = false;
      this._musicLoadPromise = (async () => {
        const genre = resolveGenre(this.musicGenreId);
        const cfg = musicConfig();
        const useFallback = Boolean(genre.fallback);
        try {
          const stations = await fetchAmbientStations({
            tags: genre.tags?.length ? genre.tags : [genre.id],
            limit: cfg.limit,
            includeFallback: useFallback,
          });
          this.musicStations = preferReliableOrder(stations, useFallback);
          if (!this.musicTrack) {
            this.musicIndex = 0;
            this.musicTrack = this.musicStations[0] || null;
          }
          this.musicReady = Boolean(this.musicTrack);
          this._bindMusicAudio();
          return this.musicStations;
        } catch {
          if (useFallback) {
            this.musicStations = shuffle([...FALLBACK_STATIONS]);
            if (!this.musicTrack) {
              this.musicIndex = 0;
              this.musicTrack = this.musicStations[0] || null;
            }
            this.musicReady = Boolean(this.musicTrack);
            this.musicError = !this.musicTrack;
            this._bindMusicAudio();
            return this.musicStations;
          }
          this.musicStations = [];
          this.musicTrack = null;
          this.musicReady = false;
          this.musicError = true;
          return this.musicStations;
        } finally {
          this.musicLoading = false;
          this._musicLoadPromise = null;
        }
      })();

      return this._musicLoadPromise;
    },

    _bindMusicAudio() {
      if (this._musicAudio) return;
      const audio = new Audio();
      audio.preload = "none";
      audio.volume = this.musicVolume;
      audio.addEventListener("playing", () => {
        this.musicPlaying = true;
        this.musicBuffering = false;
        this.musicError = false;
      });
      audio.addEventListener("waiting", () => {
        if (this.musicPlaying || audio.src) this.musicBuffering = true;
      });
      audio.addEventListener("canplay", () => {
        this.musicBuffering = false;
      });
      audio.addEventListener("pause", () => {
        this.musicPlaying = false;
        this.musicBuffering = false;
      });
      audio.addEventListener("ended", () => {
        this.nextMusicTrack({ autoplay: true });
      });
      audio.addEventListener("error", () => {
        if (!this.musicTrack) return;
        this.musicBuffering = false;
        this._skipBrokenStation();
      });
      this._musicAudio = audio;
    },

    _skipBrokenStation() {
      if (this._musicSkipTries >= Math.max(1, this.musicStations.length)) {
        this.musicError = true;
        this.musicPlaying = false;
        this.musicBuffering = false;
        this._musicSkipTries = 0;
        return;
      }
      this._musicSkipTries += 1;
      this.nextMusicTrack({ autoplay: true });
    },

    async toggleMusicPlayback() {
      if (!this.musicVisible) return;
      await this.ensureMusicPlaylist();
      if (!this.musicTrack) return;
      this.musicError = false;
      this._bindMusicAudio();
      const audio = this._musicAudio;
      if (this.musicPlaying) {
        audio.pause();
        this.musicBuffering = false;
        return;
      }
      this._musicSkipTries = 0;
      await this._playCurrentStation();
    },

    async _playCurrentStation() {
      const track = this.musicTrack;
      const audio = this._musicAudio;
      if (!track?.streamUrl || !audio) return;

      const token = ++this._musicPlayToken;
      audio.pause();
      this.musicBuffering = true;
      audio.src = track.streamUrl;
      recordStationClick(track.id);
      audio.volume = this.musicVolume;

      const playTimeout = window.setTimeout(() => {
        if (token !== this._musicPlayToken) return;
        if (audio.readyState >= 2) return;
        this.musicBuffering = false;
        audio.pause();
        this._skipBrokenStation();
      }, 8_000);

      try {
        await audio.play();
        if (token !== this._musicPlayToken) return;
        this.musicPlaying = true;
        this.musicError = false;
        this._musicSkipTries = 0;
      } catch (err) {
        if (token !== this._musicPlayToken) return;
        this.musicPlaying = false;
        this.musicBuffering = false;
        if (err?.name === "NotAllowedError") return;
        this._skipBrokenStation();
      } finally {
        window.clearTimeout(playTimeout);
      }
    },

    async nextMusicTrack({ autoplay = false } = {}) {
      if (!this.musicVisible && !this.musicStations.length) return;
      await this.ensureMusicPlaylist();
      if (!this.musicStations.length) return;
      const next =
        (this.musicIndex + 1) % Math.max(1, this.musicStations.length);
      this.musicIndex = next;
      this.musicTrack = this.musicStations[next];
      this._bindMusicAudio();
      const audio = this._musicAudio;
      if (!audio) return;
      const shouldPlay = autoplay || this.musicPlaying;
      this._musicPlayToken += 1;
      audio.pause();
      this.musicBuffering = false;
      if (!shouldPlay) {
        audio.removeAttribute("src");
        audio.load();
        return;
      }
      if (this.musicTrack) {
        await this._playCurrentStation();
      }
    },

    onMusicVolumeInput(event) {
      const raw = Number(event?.target?.value);
      const volume = Number.isFinite(raw)
        ? Math.min(1, Math.max(0, raw / 100))
        : DEFAULT_VOLUME;
      this.musicVolume = volume;
      if (this._musicAudio) this._musicAudio.volume = volume;
      try {
        localStorage.setItem(VOLUME_KEY, String(volume));
      } catch {
        /* ignore */
      }
    },

    destroyMusicPlayer() {
      this._musicPlayToken += 1;
      if (this._musicAudio) {
        this._musicAudio.pause();
        this._musicAudio.removeAttribute("src");
        this._musicAudio.load();
        this._musicAudio = null;
      }
      this.musicPlaying = false;
      this.musicBuffering = false;
      this._musicLoadPromise = null;
    },
  };
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function preferReliableOrder(stations, useFallback) {
  if (!useFallback) return shuffle(stations);
  const fallbackUrls = new Set(FALLBACK_STATIONS.map((s) => s.streamUrl));
  const reliable = [];
  const rest = [];
  for (const station of stations) {
    if (
      fallbackUrls.has(station.streamUrl) ||
      station.streamUrl.includes("laut.fm")
    ) {
      reliable.push(station);
    } else {
      rest.push(station);
    }
  }
  return [...shuffle(reliable), ...shuffle(rest)];
}
