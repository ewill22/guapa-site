import { useState, useMemo, useEffect, useCallback } from 'react';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Footer from './components/Footer';
import {
  TIMELINE, LENS_COLORS, LENS_ICONS, LENS_LABELS,
  hashStr,
} from './data/timeline';
import { BLURBS } from './data/blurbs';
import './App.css';

// Only these three lenses
const LENSES = ['music', 'coffee', 'economics'];

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

const GUAPA_COLOR = '#f0c014';

export default function App() {
  const [lens, setLens] = useState('guapa');
  const [year, setYear] = useState(2026);

  const base = import.meta.env.BASE_URL;
  const isGuapa = lens === 'guapa';
  const lc = isGuapa ? GUAPA_COLOR : LENS_COLORS[lens];

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

  const navYear = useCallback((dir) => {
    setYear(y => Math.max(1960, Math.min(2026, y + dir)));
  }, []);

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

          {/* Timeline */}
          <div className="world-timeline" style={lens ? { borderColor: `${lc}30` } : {}}>

            {/* Year + Arrows + Bars */}
            <div className="timeline-header">
              <button className="year-arrow" onClick={() => navYear(-1)} aria-label="Previous year">&larr;</button>
              <div className="year-display">
                <h2 style={{ color: lc }}>{year}</h2>
              </div>
              <button className="year-arrow" onClick={() => navYear(1)} aria-label="Next year">&rarr;</button>
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

            {/* Slider */}
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

          {/* Blurbs */}
          {blurbData ? (
            <div className="blurbs-section">
              <div className="blurbs-header">
                {isGuapa ? (
                  <span className="blurbs-lens-tag" style={{ color: GUAPA_COLOR, borderColor: `${GUAPA_COLOR}40`, background: `${GUAPA_COLOR}10` }}>
                    Guapa Inc
                  </span>
                ) : (
                  <span className="blurbs-lens-tag" style={{ color: lc, borderColor: `${lc}40`, background: `${lc}10` }}>
                    {LENS_ICONS[lens]} {LENS_LABELS[lens]}
                  </span>
                )}
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
            <div className="blurbs-placeholder" />
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
