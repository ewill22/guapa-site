import { useState, useMemo, useEffect, useCallback } from 'react';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Footer from './components/Footer';
import {
  TIMELINE, LENS_COLORS, LENS_ICONS, LENS_LABELS,
  hashStr,
} from './data/timeline';
import { BLURBS } from './data/blurbs';
import { DEV_FIRST_DATE, DEV_COMMITS, DEV_BLURBS } from './data/dev-timeline';
import './App.css';

// Only these three lenses (dev is the default "guapa" view)
const LENSES = ['music', 'coffee', 'economics'];

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

// Pick a random artist/album/song from the music catalog (seeded by date so it changes daily)
function getDailyPick(catalog) {
  const artists = Object.values(catalog);
  if (!artists.length) return null;
  const today = new Date().toISOString().slice(0, 10);
  const seed = hashStr(today);
  const artist = artists[seed % artists.length];
  const albums = artist.albums || [];
  if (!albums.length) return { artist: artist.name, album: null, song: null, cover: null };
  const album = albums[hashStr(today + 'album') % albums.length];
  const tracks = album.tracks || [];
  const song = tracks.length ? tracks[hashStr(today + 'song') % tracks.length] : null;
  return {
    artist: artist.name,
    album: album.title,
    song: song ? song.title : null,
    cover: album.cover_art_small,
    year: album.release_year,
    artistUrl: `music.html?artist=${encodeURIComponent(artist.name)}`,
  };
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
  const today = new Date().toISOString().slice(0, 10);
  const seed = hashStr(today + 'bean');
  return COFFEE_BEANS[seed % COFFEE_BEANS.length];
}

const GUAPA_COLOR = '#f0c014';

export default function App() {
  const [lens, setLens] = useState('guapa');
  const [year, setYear] = useState(2026);
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

  const dailyPick = useMemo(() => catalog ? getDailyPick(catalog) : null, [catalog]);
  const dailyBean = useMemo(() => getDailyBean(), []);

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
  const devBlurbData = isGuapa ? (DEV_BLURBS[DEV_DAYS[devDay]?.date] || null) : null;

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

              {/* KPI Tiles — stacked vertically */}
              <div className="counter-tiles">
                <a href={dailyPick ? `${base}${dailyPick.artistUrl}` : '#'} className="kpi-tile kpi-tile--artist">
                  <span className="kpi-label">Artist of the Day</span>
                  <span className="kpi-value">{dailyPick?.artist || '...'}</span>
                </a>
                <div className="kpi-tile kpi-tile--album">
                  <span className="kpi-label">Album of the Day</span>
                  <span className="kpi-value">{dailyPick?.album || '...'}</span>
                  {dailyPick?.year && <span className="kpi-sub">{dailyPick.year}</span>}
                </div>
                <div className="kpi-tile kpi-tile--song">
                  <span className="kpi-label">Now Playing</span>
                  <span className="kpi-value">{dailyPick?.song || '...'}</span>
                </div>
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
                            value={year} onChange={e => setYear(+e.target.value)}
                            style={{
                              background: `linear-gradient(to right, ${lc} 0%, ${lc} ${((year - 1960) / 66) * 100}%, var(--gray-800) ${((year - 1960) / 66) * 100}%, var(--gray-800) 100%)`,
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
              </div>

            </div>

            {/* Bottom row: Greeting (left) + Coffee Bean (right) */}
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
              <div className="counter-bean">
                <span className="kpi-label">Bean of the Moment</span>
                <span className="bean-name">{dailyBean.name}</span>
                <span className="bean-origin">{dailyBean.origin}</span>
                <span className="bean-notes">{dailyBean.notes}</span>
                <span className="bean-process">{dailyBean.process} process</span>
              </div>
            </div>

          </div>

          {/* Blurbs — below the counter */}
          {isGuapa ? (
            devBlurbData ? (
              <div className="blurbs-section">
                <div className="blurbs-header">
                  <span className="blurbs-nearest">{DEV_DAYS[devDay]?.date} — {DEV_DAYS[devDay]?.commits} commits</span>
                </div>
                <div className="blurbs-list">
                  {devBlurbData.map((blurb, i) => (
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
            ) : (
              <div className="blurbs-section">
                <div className="blurbs-header">
                </div>
                <div className="blurbs-list">
                  <div className="blurb-card blurb-card--update">
                    <div className="blurb-content">
                      <span className="blurb-type blurb-type--update">quiet</span>
                      <p>No commits on {DEV_DAYS[devDay]?.date}. Rest day.</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : blurbData ? (
            <div className="blurbs-section">
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
            </div>
          ) : (
            <div className="blurbs-placeholder">
              <img src={`${base}assets/guapa_logo_dark.png`} alt="Guapa" className="blurbs-placeholder-logo" style={{ filter: `hue-rotate(${hashStr(year + lens) % 360}deg)` }} />
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
