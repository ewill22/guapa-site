import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Footer from './components/Footer';
import GenreExplorer from './components/GenreExplorer';
import {
  TIMELINE, LENS_COLORS, LENS_ICONS, LENS_LABELS,
  hashStr,
} from './data/timeline';
import { BLURBS } from './data/blurbs';
import { DEV_FIRST_DATE, DEV_COMMITS, DEV_BLURBS } from './data/dev-timeline';
import './App.css';

// Only these three lenses (dev is the default "guapa" view)
const LENSES = ['music', 'coffee', 'economics'];

// Get today's date in EST (UTC-5) so daily picks change at midnight EST, not UTC
function getTodayEST() {
  const now = new Date();
  const est = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  return est.toISOString().slice(0, 10);
}

// Build dev day list — every day from first commit to today
function buildDevDays() {
  const start = new Date(DEV_FIRST_DATE + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, commits: DEV_COMMITS[key] || 0 });
  }
  return days;
}
const DEV_DAYS = buildDevDays();

// Parse {Artist Name} in blurb text into clickable links
function renderBlurbText(text, base) {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{(.+)\}$/);
    if (match) {
      const artist = match[1];
      const param = encodeURIComponent(artist);
      return (
        <a key={i} href={`${base}music.html?artist=${param}`} className="blurb-artist-link">
          {artist}
        </a>
      );
    }
    return part;
  });
}

// Find the nearest year with blurb data for a given lens
function getBlurbs(lens, year) {
  const data = BLURBS[lens];
  if (!data) return null;
  if (data[year]) return { year, items: data[year] };
  const yrs = Object.keys(data).map(Number).sort((a, b) => b - a);
  for (const y of yrs) if (y <= year) return { year: y, items: data[y] };
  return null;
}

// Pick the daily artist and build a full playback schedule
// Alternates between modern (2000+) and throwback (<2000) artists by day
// Selection is stable: sorted by name, scored by hash — catalog changes don't shift the pick
function getDailyArtist(catalog) {
  const artists = Object.values(catalog).filter(a => a.albums && a.albums.length > 0);
  if (!artists.length) return null;
  const today = getTodayEST();
  const seed = hashStr(today);

  // Split into modern vs throwback based on begin_year
  const modern = artists.filter(a => (a.begin_year || 2000) >= 2000);
  const throwback = artists.filter(a => (a.begin_year || 2000) < 2000);

  // Alternate days: even seed = throwback, odd = modern
  const pool = (seed % 2 === 0 && throwback.length) ? throwback : (modern.length ? modern : artists);

  // Score each artist by hashing their name with today's date — stable across catalog changes
  const artist = pool.reduce((best, a) => {
    const score = hashStr(today + a.name);
    return (!best || score > best.score) ? { ...a, score } : best;
  }, null);

  // Build chronological playback schedule from full discography
  const albums = [...artist.albums].sort((a, b) => (a.release_year || 0) - (b.release_year || 0));
  const schedule = [];
  let elapsed = 0;
  for (const album of albums) {
    const tracks = album.tracks || [];
    for (const track of tracks) {
      const dur = track.duration_ms || 210000; // default ~3.5min
      schedule.push({
        artist: artist.name,
        album: album.title,
        song: track.title,
        trackNum: track.track_number,
        cover: album.cover_art_small || album.cover_art_large,
        year: album.release_year,
        durationMs: dur,
        startMs: elapsed,
        artistUrl: `music.html?artist=${encodeURIComponent(artist.name)}`,
        albumUrl: `music.html?artist=${encodeURIComponent(artist.name)}&album=${encodeURIComponent(album.title)}`,
      });
      elapsed += dur;
    }
  }

  return {
    artist: artist.name,
    artistUrl: `music.html?artist=${encodeURIComponent(artist.name)}`,
    totalMs: elapsed,
    totalTracks: schedule.length,
    albumCount: albums.length,
    schedule,
    isThrowback: pool === throwback,
  };
}

// Find what's currently playing based on time of day (starts 8am EST)
function getNowPlaying(dailyArtist) {
  if (!dailyArtist || !dailyArtist.schedule.length) return null;
  const now = new Date();
  // Use EST date for todayStart so it aligns with EST-based daily artist
  const estDateStr = getTodayEST(); // e.g. "2026-03-20"
  const todayStart = new Date(estDateStr + 'T13:00:00Z'); // 8am EST = 13:00 UTC
  // If it's before 8am EST today, nothing playing yet
  if (now.getTime() < todayStart.getTime()) {
    return { waiting: true, artist: dailyArtist.artist, artistUrl: dailyArtist.artistUrl };
  }
  const elapsedMs = now.getTime() - todayStart.getTime();

  if (elapsedMs >= dailyArtist.totalMs) {
    // Discography finished — Aux Cord is open
    return {
      auxCord: true,
      artist: dailyArtist.artist,
      artistUrl: dailyArtist.artistUrl,
      finishedAtMs: dailyArtist.totalMs,
    };
  }

  // Find current track
  for (let i = dailyArtist.schedule.length - 1; i >= 0; i--) {
    if (elapsedMs >= dailyArtist.schedule[i].startMs) {
      const track = dailyArtist.schedule[i];
      const trackElapsed = elapsedMs - track.startMs;
      const progress = Math.min(trackElapsed / track.durationMs, 1);

      // Compute album-level progress
      const albumTracks = dailyArtist.schedule.filter(t => t.album === track.album);
      const albumStartMs = albumTracks[0].startMs;
      const lastTrack = albumTracks[albumTracks.length - 1];
      const albumEndMs = lastTrack.startMs + lastTrack.durationMs;
      const albumProgress = Math.min((elapsedMs - albumStartMs) / (albumEndMs - albumStartMs), 1);

      // Compute artist-level (full discography) progress
      const artistProgress = Math.min(elapsedMs / dailyArtist.totalMs, 1);

      return {
        auxCord: false,
        ...track,
        progress,
        trackElapsedMs: trackElapsed,
        albumProgress,
        albumTrackIndex: albumTracks.findIndex(t => t === track) + 1,
        albumTrackCount: albumTracks.length,
        artistProgress,
      };
    }
  }
  return { auxCord: false, ...dailyArtist.schedule[0], progress: 0, trackElapsedMs: 0, albumProgress: 0 };
}

// Coffee beans of the moment — rotates daily
const COFFEE_BEANS = [
  { name: 'Yirgacheffe', origin: 'Ethiopia', notes: 'Floral, bright citrus, tea-like body', process: 'Washed' },
  { name: 'Huehuetenango', origin: 'Guatemala', notes: 'Chocolate, stone fruit, full body', process: 'Washed' },
  { name: 'Geisha', origin: 'Panama', notes: 'Jasmine, bergamot, silky mouthfeel', process: 'Natural' },
  { name: 'Sidamo', origin: 'Ethiopia', notes: 'Blueberry, wine-like, complex', process: 'Natural' },
  { name: 'Tarrazú', origin: 'Costa Rica', notes: 'Honey, citrus, clean finish', process: 'Honey' },
  { name: 'Cerrado', origin: 'Brazil', notes: 'Nutty, caramel, low acidity', process: 'Natural' },
  { name: 'Kintamani', origin: 'Bali', notes: 'Citrus, brown sugar, smooth', process: 'Wet-hulled' },
];

function getDailyBean() {
  const today = getTodayEST();
  const seed = hashStr(today + 'bean');
  return COFFEE_BEANS[seed % COFFEE_BEANS.length];
}

// Pull albums from catalog for a given year, shuffled by date seed
function getAlbumsForYear(catalog, year) {
  if (!catalog) return [];
  const albums = [];
  Object.values(catalog).forEach(artist => {
    (artist.albums || []).forEach(album => {
      if (album.release_year === year) {
        albums.push({
          artist: artist.name,
          title: album.title,
          cover: album.cover_art_small || album.cover_art_large,
          artistUrl: `music.html?artist=${encodeURIComponent(artist.name)}&album=${encodeURIComponent(album.title)}`,
        });
      }
    });
  });
  // Shuffle deterministically by year so it's consistent but not alphabetical
  albums.sort((a, b) => hashStr(a.title + year) - hashStr(b.title + year));
  return albums;
}

const GUAPA_COLOR = '#f0c014';

export default function App() {
  const [lens, setLens] = useState('music');
  const [year, setYear] = useState(null);
  const [devDay, setDevDay] = useState(DEV_DAYS.length - 1);
  const [catalog, setCatalog] = useState(null);

  const base = import.meta.env.BASE_URL;
  const isGuapa = lens === 'guapa';
  const lc = isGuapa ? GUAPA_COLOR : LENS_COLORS[lens];

  // Load music catalog for daily pick
  useEffect(() => {
    fetch(`${base}data/music-catalog.json`)
      .then(r => r.json())
      .then(setCatalog)
      .catch(() => {});
  }, [base]);

  const dailyArtist = useMemo(() => catalog ? getDailyArtist(catalog) : null, [catalog]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const dailyBean = useMemo(() => getDailyBean(), []);
  const yearAlbums = useMemo(() => getAlbumsForYear(catalog, year), [catalog, year]);
  const [deepLink, setDeepLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const genreExplorerRef = useRef(null);

  // Search catalog for artists/albums/songs
  const searchResults = useMemo(() => {
    if (!catalog || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    for (const artist of Object.values(catalog)) {
      if (artist.name.toLowerCase().includes(q)) {
        results.push({ type: 'artist', name: artist.name });
      }
      for (const album of (artist.albums || [])) {
        if (album.title?.toLowerCase().includes(q)) {
          results.push({ type: 'album', name: album.title, meta: artist.name, artist: artist.name });
        }
        for (const track of (album.tracks || [])) {
          if (track.title?.toLowerCase().includes(q)) {
            results.push({ type: 'song', name: track.title, meta: `${artist.name} — ${album.title}`, artist: artist.name, album: album.title });
          }
        }
      }
      if (results.length >= 8) break;
    }
    return results.slice(0, 8);
  }, [catalog, searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToExplorer = useCallback((artistName, albumTitle) => {
    setLens('music');
    setDeepLink({ artist: artistName, album: albumTitle || null });
    // Only scroll to explorer top if no album target — album scroll is handled by GenreExplorer
    if (!albumTitle) {
      setTimeout(() => {
        const el = genreExplorerRef.current;
        if (el) {
          const top = window.scrollY + el.getBoundingClientRect().top - (parseInt(getComputedStyle(el).scrollMarginTop) || 0);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  // Tick now playing every 5 seconds
  const prevAlbumRef = useRef(null);
  useEffect(() => {
    if (!dailyArtist) return;
    setNowPlaying(getNowPlaying(dailyArtist));
    const interval = setInterval(() => {
      setNowPlaying(getNowPlaying(dailyArtist));
    }, 5000);
    return () => clearInterval(interval);
  }, [dailyArtist]);

  // Sync timeline year + genre explorer to currently playing album
  const initialDeepLinked = useRef(false);
  const randYear = () => Math.floor(Math.random() * (2026 - 1960 + 1)) + 1960;
  useEffect(() => {
    if (!nowPlaying) return;
    if (nowPlaying.waiting) {
      // Before 8am — random year
      if (year === null) setYear(randYear());
      return;
    }
    if (nowPlaying.auxCord) {
      // Aux cord open — random year, clear selection
      if (prevAlbumRef.current !== '__aux__') {
        setYear(randYear());
        if (initialDeepLinked.current) setDeepLink(null);
        prevAlbumRef.current = '__aux__';
      }
    } else if (nowPlaying.year && !nowPlaying.waiting) {
      // Playing a track — sync year to album's release year
      const key = `${nowPlaying.album}_${nowPlaying.year}`;
      if (prevAlbumRef.current !== key) {
        setYear(nowPlaying.year);
        // Deep link to artist on initial load only
        if (!initialDeepLinked.current && nowPlaying.artist) {
          setDeepLink({ artist: nowPlaying.artist, album: null });
          initialDeepLinked.current = true;
        }
        prevAlbumRef.current = key;
      }
    }
  }, [nowPlaying]);

  // Dev timeline bars — commit counts per day
  const devBars = useMemo(() => {
    const maxCommits = Math.max(...DEV_DAYS.map(d => d.commits), 1);
    return DEV_DAYS.map((d, i) => ({
      index: i,
      date: d.date,
      commits: d.commits,
      h: d.commits > 0 ? 8 + (d.commits / maxCommits) * 48 : 3,
    }));
  }, []);

  // Standard lens bars
  const bars = useMemo(() => {
    const src = lens || 'music';
    const ey = Object.keys(TIMELINE[src] || {}).map(Number);
    return Array.from({ length: 67 }, (_, i) => {
      const y = 1960 + i;
      const has = ey.includes(y);
      return { year: y, h: has ? 18 + (hashStr(y + src) % 38) : 3 + (hashStr(y + src) % 10) };
    });
  }, [lens]);

  const blurbData = getBlurbs(lens, year);

  // Collect all dev blurbs for the week containing the selected day (weeks start Saturday)
  const weekBlurbs = useMemo(() => {
    if (!isGuapa) return null;
    const selectedDate = DEV_DAYS[devDay]?.date;
    if (!selectedDate) return null;
    const d = new Date(selectedDate + 'T00:00:00');
    // Find the Friday that starts this week (Friday = 5, new music release day)
    const dayOfWeek = d.getDay(); // 0=Sun, 5=Fri
    const friOffset = dayOfWeek === 5 ? 0 : -(((dayOfWeek - 5) + 7) % 7);
    const weekStart = new Date(d);
    weekStart.setDate(weekStart.getDate() + friOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startStr = weekStart.toISOString().slice(0, 10);
    const endStr = weekEnd.toISOString().slice(0, 10);

    // Gather all days in this week that have blurbs (newest first)
    const entries = [];
    Object.keys(DEV_BLURBS).sort().reverse().forEach(date => {
      if (date >= startStr && date <= endStr) {
        entries.push({ date, blurbs: DEV_BLURBS[date] });
      }
    });
    if (entries.length === 0) return null;

    // Sum commits for the week
    const weekCommits = entries.reduce((sum, e) => {
      const day = DEV_DAYS.find(dd => dd.date === e.date);
      return sum + (day ? day.commits : 0);
    }, 0);

    return { startStr, endStr, entries, weekCommits };
  }, [isGuapa, devDay]);

  // Navigation for dev timeline
  const navDev = useCallback((dir) => {
    setDevDay(d => Math.max(0, Math.min(DEV_DAYS.length - 1, d + dir)));
  }, []);

  const navYear = useCallback((dir) => {
    if (isGuapa) {
      navDev(dir);
    } else {
      setYear(y => Math.max(1960, Math.min(2026, y + dir)));
    }
  }, [isGuapa, navDev]);

  // Arrow key navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') navYear(-1);
      if (e.key === 'ArrowRight') navYear(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navYear]);

  return (
    <>
      <Nav />
      <Banner />


      <main>
        <section className="dashboard-hero">

          {/* === Coffee Shop Counter (L-shape) === */}
          <div className="counter">

            {/* Top row: KPI tiles (left) + Timeline (right) */}
            <div className="counter-top">

              {/* KPI Tiles — stacked vertically: Artist, Album, Song */}
              <div className="counter-tiles">
                <div className="kpi-tile kpi-tile--artist" style={{ cursor: dailyArtist ? 'pointer' : 'default' }} onClick={() => dailyArtist && scrollToExplorer(dailyArtist.artist)}>
                  <span className="kpi-label">Artist of the Day</span>
                  <span className="kpi-value">{dailyArtist?.artist || '...'}</span>
                  {dailyArtist && <span className="kpi-sub">{dailyArtist.albumCount} albums — {dailyArtist.totalTracks} tracks</span>}
                  {nowPlaying && !nowPlaying.auxCord && !nowPlaying.waiting && (
                    <div className="kpi-artist-progress">
                      <div className="kpi-artist-progress-bar" style={{ width: `${(nowPlaying.artistProgress * 100).toFixed(1)}%` }} />
                    </div>
                  )}
                </div>
                {nowPlaying && !nowPlaying.auxCord && !nowPlaying.waiting ? (
                  <>
                    <div className="kpi-tile kpi-tile--album kpi-tile--album-art" style={{ cursor: 'pointer' }} onClick={() => scrollToExplorer(nowPlaying.artist, nowPlaying.album)}>
                      {nowPlaying.cover ? (
                        <div className="kpi-album-art" style={{ backgroundImage: `url(${nowPlaying.cover})` }} />
                      ) : (
                        <div className="kpi-album-art kpi-album-art--empty" />
                      )}
                      <div className="kpi-album-info">
                        <span className="kpi-label">{nowPlaying.album}</span>
                        <span className="kpi-sub">{nowPlaying.year} — track {nowPlaying.albumTrackIndex}/{nowPlaying.albumTrackCount}</span>
                      </div>
                      <div className="kpi-album-progress">
                        <div className="kpi-album-progress-bar" style={{ width: `${(nowPlaying.albumProgress * 100).toFixed(1)}%` }} />
                      </div>
                    </div>
                    <div className="kpi-tile kpi-tile--song">
                      <span className="kpi-label">Now Playing</span>
                      <span className="kpi-value">{nowPlaying.song}</span>
                      <div className="kpi-progress">
                        <div className="kpi-progress-bar" style={{ width: `${(nowPlaying.progress * 100).toFixed(1)}%` }} />
                      </div>
                    </div>
                    {dailyArtist && (
                      <div className="up-next up-next--mobile">
                        up next: {(() => {
                          const idx = dailyArtist.schedule.findIndex(t => t.song === nowPlaying.song && t.album === nowPlaying.album);
                          const next = dailyArtist.schedule[idx + 1];
                          return next ? `${next.song} — ${next.album}` : 'Aux Cord';
                        })()}
                      </div>
                    )}
                  </>
                ) : nowPlaying?.auxCord ? (
                  <>
                    <div className="kpi-tile kpi-tile--aux">
                      <span className="kpi-label">Discography wrapped</span>
                      <span className="kpi-value kpi-value--aux">Aux Cord is Open</span>
                    </div>
                    <div className="kpi-tile kpi-tile--song kpi-tile--aux-logo">
                      <img src={`${base}assets/guapa_logo_dark.png`} alt="Guapa" className="kpi-aux-logo" style={{ filter: `hue-rotate(${hashStr(getTodayEST() + 'aux') % 360}deg)` }} />
                    </div>
                  </>
                ) : nowPlaying?.waiting ? (
                  <>
                    <div className="kpi-tile kpi-tile--album">
                      <span className="kpi-label">Opening at 8am EST</span>
                      <span className="kpi-value" style={{ color: 'var(--gray-600)' }}>Coffee's brewing</span>
                    </div>
                    <div className="kpi-tile kpi-tile--song">
                      <span className="kpi-label">Now Playing</span>
                      <span className="kpi-value" style={{ color: 'var(--gray-600)' }}>...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="kpi-tile kpi-tile--album">
                      <span className="kpi-label">Album</span>
                      <span className="kpi-value">...</span>
                    </div>
                    <div className="kpi-tile kpi-tile--song">
                      <span className="kpi-label">Now Playing</span>
                      <span className="kpi-value">...</span>
                    </div>
                  </>
                )}
              </div>

              {/* Timeline — shifted right */}
              <div className="counter-timeline">
                <div className="world-timeline" style={lens ? { borderColor: `${lc}30` } : {}}>

                  {isGuapa ? (
                    <>
                      <h2 className="timeline-section-header" style={{ color: lc }}>Guapa</h2>
                      <div className="timeline-header">
                        <div className="timeline-nav-row">
                          <button className="year-arrow" onClick={() => navDev(-1)} aria-label="Previous day">&larr;</button>
                          <div className="year-display">
                            <h2 style={{ color: lc }}>Day {devDay + 1}</h2>
                            <span className="dev-date">{DEV_DAYS[devDay]?.date}</span>
                          </div>
                          <button className="year-arrow" onClick={() => navDev(1)} aria-label="Next day">&rarr;</button>
                        </div>
                        <div className="event-bars">
                          {devBars.map(b => (
                            <div key={b.index}
                              className={`event-bar ${b.index === devDay ? 'active' : ''}`}
                              style={{
                                height: b.h,
                                background: b.index === devDay ? lc : undefined,
                                opacity: b.commits > 0 ? undefined : 0.2,
                              }}
                              onClick={() => setDevDay(b.index)}
                              title={`${b.date}: ${b.commits} commits`}
                            />
                          ))}
                        </div>
                        <button className={`live-badge ${devDay === DEV_DAYS.length - 1 ? 'live-badge--active' : ''}`} onClick={() => setDevDay(DEV_DAYS.length - 1)}>
                          <span className="live-dot" />Live
                        </button>
                      </div>

                      <div className="slider-row">
                        <div className="slider-wrapper">
                          <input type="range" className="year-slider" min="0" max={DEV_DAYS.length - 1}
                            value={devDay} onChange={e => setDevDay(+e.target.value)}
                            style={{
                              background: `linear-gradient(to right, ${lc} 0%, ${lc} ${(devDay / (DEV_DAYS.length - 1)) * 100}%, var(--gray-800) ${(devDay / (DEV_DAYS.length - 1)) * 100}%, var(--gray-800) 100%)`,
                              accentColor: lc,
                            }}
                          />
                          <div className="timeline-markers">
                            <span>{DEV_DAYS[0]?.date.slice(5)}</span>
                            <span>{DEV_DAYS[devDay]?.commits || 0} commits</span>
                            <span>{DEV_DAYS[DEV_DAYS.length - 1]?.date.slice(5)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="timeline-section-header" style={{ color: lc }}>{LENS_LABELS[lens]}</h2>
                      <div className="timeline-header">
                        <div className="timeline-nav-row">
                          <button className="year-arrow" onClick={() => navYear(-1)} aria-label="Previous year">&larr;</button>
                          <div className="year-display">
                            <h2 style={{ color: lc }}>{year}</h2>
                          </div>
                          <button className="year-arrow" onClick={() => navYear(1)} aria-label="Next year">&rarr;</button>
                        </div>
                        <div className="event-bars">
                          {bars.map(b => (
                            <div key={b.year}
                              className={`event-bar ${b.year === year ? 'active' : ''}`}
                              style={{
                                height: b.h,
                                background: b.year === year ? lc : undefined,
                              }}
                              onClick={() => setYear(b.year)}
                            />
                          ))}
                        </div>
                        <button className={`live-badge ${year === 2026 ? 'live-badge--active' : ''}`} onClick={() => setYear(2026)}>
                          <span className="live-dot" />Live
                        </button>
                      </div>

                      <div className="slider-row">
                        <div className="slider-wrapper">
                          <input type="range" className="year-slider" min="1960" max="2026"
                            value={year || 1960} onChange={e => setYear(+e.target.value)}
                            style={{
                              background: `linear-gradient(to right, ${lc} 0%, ${lc} ${(((year || 1960) - 1960) / 66) * 100}%, var(--gray-800) ${(((year || 1960) - 1960) / 66) * 100}%, var(--gray-800) 100%)`,
                              accentColor: lc,
                            }}
                          />
                          <div className="timeline-markers">
                            <span>1960</span><span>1980</span><span>2000</span><span>2026</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Lens Selector */}
                  <div className="lens-selector">
                    {LENSES.map(l => (
                      <button key={l}
                        className={`lens-pill ${lens === l ? 'active' : ''}`}
                        style={lens === l ? { color: LENS_COLORS[l], borderColor: LENS_COLORS[l], background: `${LENS_COLORS[l]}10` } : {}}
                        onClick={() => setLens(lens === l ? 'guapa' : l)}>
                        <span>{LENS_ICONS[l]}</span>{LENS_LABELS[l]}
                      </button>
                    ))}
                  </div>
                </div>
                {nowPlaying && !nowPlaying.auxCord && dailyArtist && (
                  <div className="up-next">
                    up next: {(() => {
                      const idx = dailyArtist.schedule.findIndex(t => t.song === nowPlaying.song && t.album === nowPlaying.album);
                      const next = dailyArtist.schedule[idx + 1];
                      return next ? `${next.song} — ${next.album}` : 'Aux Cord';
                    })()}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom row: Greeting + Coffee Bean + Album Tiles */}
            <div className="counter-bottom">
              <div className="counter-greeting">
                <h2>Welcome to Guapa</h2>
                <p>
                  This is the coffee shop. Sit down, look around.
                  Browse the <a href={`${base}music.html`}>record collection</a>,
                  explore <a href={`${base}coffee.html`}>where the beans come from</a>,
                  or check out what we're <a href={`${base}data-solutions.html`}>building with data</a>.
                </p>
                <p className="counter-greeting-sub">Use the timeline above to travel through the years. Switch lenses to see music, coffee, or economics through time.</p>
              </div>
              {lens === 'music' ? (
                <div className="counter-search" ref={searchRef}>
                  <span className="kpi-label">Search</span>
                  <input
                    type="text"
                    className="counter-search-input"
                    placeholder="Artists, albums, songs..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                  />
                  {searchOpen && searchResults.length > 0 && (
                    <div className="counter-search-results">
                      {searchResults.map((r, i) => (
                        <div key={i} className="counter-search-item" onClick={() => {
                          setSearchQuery('');
                          setSearchOpen(false);
                          const albumTarget = r.type === 'album' ? r.name : (r.album || null);
                          scrollToExplorer(r.artist || r.name, albumTarget);
                        }}>
                          <span className="counter-search-icon">{r.type === 'artist' ? '🎤' : r.type === 'album' ? '💿' : '♫'}</span>
                          <span className="counter-search-type">{r.type}</span>
                          <span className="counter-search-name">{r.name}</span>
                          {r.meta && <span className="counter-search-meta">{r.meta}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="ge-sub-legend">
                    <span className="ge-sub-legend-item ge-sub-legend--emerging">Emerging</span>
                    <span className="ge-sub-legend-item ge-sub-legend--rising">Rising</span>
                    <span className="ge-sub-legend-item ge-sub-legend--peak">Peak</span>
                    <span className="ge-sub-legend-item ge-sub-legend--fading">Fading</span>
                  </div>
                </div>
              ) : (
                <div className="counter-bean">
                  <span className="kpi-label">Bean of the Moment</span>
                  <span className="bean-name">{dailyBean.name}</span>
                  <span className="bean-origin">{dailyBean.origin}</span>
                  <span className="bean-notes">{dailyBean.notes}</span>
                  <span className="bean-process">{dailyBean.process} process</span>
                </div>
              )}
              {lens === 'music' && yearAlbums.length > 0 && (
                <div className="counter-albums">
                  <span className="kpi-label">Releases from {year}</span>
                  <div className="counter-albums-grid">
                    {yearAlbums.slice(0, 8).map((a, i) => (
                      <div key={i} className="counter-album-tile" onClick={() => scrollToExplorer(a.artist, a.title)}>
                        <div className="counter-album-art" style={a.cover ? { backgroundImage: `url(${a.cover})` } : {}}>
                          {!a.cover && <span className="counter-album-no-art">{a.title.charAt(0)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Blurbs — below the counter */}
          {isGuapa ? (
            weekBlurbs ? (
              <div className="blurbs-section">
                <div className="blurbs-header">
                  <span className="blurbs-nearest">Week of {weekBlurbs.startStr.slice(5)} — {weekBlurbs.weekCommits} commits</span>
                </div>
                {weekBlurbs.entries.map(entry => (
                  <div key={entry.date} className="blurbs-day-group">
                    <div className="blurbs-day-label">{entry.date}</div>
                    <div className="blurbs-list">
                      {entry.blurbs.map((blurb, i) => (
                        <div key={i} className={`blurb-card blurb-card--${blurb.type}`}>
                          {blurb.type === 'metric' ? (
                            <div className="blurb-metric">
                              <span className="blurb-metric-label">{blurb.label}</span>
                              <span className="blurb-metric-value" style={{ color: lc }}>{blurb.value}</span>
                              <span className="blurb-metric-change">{blurb.change}</span>
                            </div>
                          ) : (
                            <div className="blurb-content">
                              <span className={`blurb-type blurb-type--${blurb.type}`}>{blurb.type}</span>
                              <p>{blurb.text}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="blurbs-section">
                <div className="blurbs-header">
                  <span className="blurbs-nearest">Week of {DEV_DAYS[devDay]?.date?.slice(5)}</span>
                </div>
                <div className="blurbs-list">
                  <div className="blurb-card blurb-card--update">
                    <div className="blurb-content">
                      <span className="blurb-type blurb-type--update">quiet</span>
                      <p>No activity this week yet.</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="blurbs-section">
              {/* Genre Explorer for music lens */}
              {lens === 'music' && (
                <div ref={genreExplorerRef}>
                  <GenreExplorer year={year} catalog={catalog} deepLink={deepLink} onDeepLinkHandled={() => setDeepLink(null)} />
                </div>
              )}

              {/* Text blurbs for non-music lenses */}
              {lens !== 'music' && blurbData ? (
                <>
                  <div className="blurbs-header">
                    {blurbData.year !== year && (
                      <span className="blurbs-nearest">Showing {blurbData.year} — nearest data to {year}</span>
                    )}
                  </div>
                  <div className="blurbs-list">
                    {blurbData.items.map((blurb, i) => (
                      <div key={i} className={`blurb-card blurb-card--${blurb.type}`}>
                        {blurb.type === 'metric' ? (
                          <div className="blurb-metric">
                            <span className="blurb-metric-label">{blurb.label}</span>
                            <span className="blurb-metric-value" style={{ color: lc }}>{blurb.value}</span>
                            <span className="blurb-metric-change">{blurb.change}</span>
                          </div>
                        ) : (
                          <div className="blurb-content">
                            <span className={`blurb-type blurb-type--${blurb.type}`}>{blurb.type}</span>
                            <p>{renderBlurbText(blurb.text, base)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : lens !== 'music' && !yearAlbums.length && (
                <div className="blurbs-placeholder">
                  <img src={`${base}assets/guapa_logo_dark.png`} alt="Guapa" className="blurbs-placeholder-logo" style={{ filter: `hue-rotate(${hashStr(year + lens) % 360}deg)` }} />
                </div>
              )}
            </div>
          )}

        </section>

        {/* Newsletter */}
        <section className="newsletter">
          <div className="container">
            <div className="newsletter-content">
              <h2>Stay in the loop</h2>
              <p>Get updates on new drops and Guapa Inc projects.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="your@email.com" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
