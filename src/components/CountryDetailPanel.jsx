import { useEffect, useRef, useState } from 'react';
import {
  COLOMBIA_COFFEE_DEPARTMENTS,
  COLOMBIA_COFFEE_DEPARTMENT_LABELS,
  COLOMBIA_MAP_ATTRIBUTION,
} from '../data/coffee-regions-colombia';
import {
  FNC_AREA_BY_DEPARTMENT,
  FNC_FETCHED_ON,
  FNC_SOURCE_URL,
} from '../data/coffee-production-colombia';
import './CountryDetailPanel.css';

const COLOMBIA_SVG_PATH = `${import.meta.env.BASE_URL}assets/colombia-departments.svg`;
const LOGO_PATH = `${import.meta.env.BASE_URL}assets/guapa_logo_dark.png`;

function AreaSparkline({ series }) {
  if (!series || series.length < 2) return null;
  const w = 180;
  const h = 36;
  const max = Math.max(...series.map(([, v]) => v));
  const min = Math.min(...series.map(([, v]) => v));
  const range = max - min || 1;
  const step = w / (series.length - 1);
  const pts = series.map(([, v], i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg className="cdp-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ColombiaMap({ selected, onSelect }) {
  const [svgMarkup, setSvgMarkup] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(COLOMBIA_SVG_PATH)
      .then(r => r.text())
      .then(text => { if (alive) setSvgMarkup(text); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !svgMarkup) return;
    const svg = root.querySelector('svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path[aria-label]');
    paths.forEach(p => {
      const label = p.getAttribute('aria-label');
      const isCoffee = COLOMBIA_COFFEE_DEPARTMENT_LABELS.includes(label);
      p.classList.add('co-dept');
      if (isCoffee) p.classList.add('co-dept--coffee');
      if (selected === label) p.classList.add('co-dept--selected');
      else p.classList.remove('co-dept--selected');
    });

    const onClick = (e) => {
      const t = e.target.closest('path[aria-label]');
      if (!t) return;
      const label = t.getAttribute('aria-label');
      if (!COLOMBIA_COFFEE_DEPARTMENT_LABELS.includes(label)) return;
      onSelect(prev => (prev === label ? null : label));
    };
    svg.addEventListener('click', onClick);
    return () => { svg.removeEventListener('click', onClick); };
  }, [svgMarkup, selected, onSelect]);

  return (
    <div
      className="cdp-map-svg"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

function MapPlaceholder({ country }) {
  return (
    <div className="cdp-map-placeholder">
      <img src={LOGO_PATH} alt="" className="cdp-map-placeholder-logo" />
      <span className="cdp-map-placeholder-text">
        {country} drill-down map coming
      </span>
    </div>
  );
}

export default function CountryDetailPanel({ country, story, onClose }) {
  const [selected, setSelected] = useState(null);
  const isColombia = country === 'Colombia';

  useEffect(() => { setSelected(null); }, [country]);

  const dept = isColombia && selected ? COLOMBIA_COFFEE_DEPARTMENTS[selected] : null;
  const areaByYear = isColombia && selected ? FNC_AREA_BY_DEPARTMENT[selected] : null;
  const areaSeries = areaByYear
    ? Object.entries(areaByYear).map(([y, v]) => [Number(y), v]).sort((a, b) => a[0] - b[0])
    : null;
  const latest = areaSeries && areaSeries.length ? areaSeries[areaSeries.length - 1] : null;
  const earliest = areaSeries && areaSeries.length ? areaSeries[0] : null;
  const pctChange = latest && earliest && earliest[1]
    ? Math.round(((latest[1] - earliest[1]) / earliest[1]) * 100)
    : null;

  return (
    <div className="country-detail-panel">
      <div className="cdp-head">
        <span className="cdp-label">{country}</span>
        {isColombia && (
          <span className="cdp-sub">
            6 departments highlighted · click to drill in · Editorial
          </span>
        )}
        {onClose && (
          <button type="button" className="cdp-clear" onClick={onClose}>
            clear
          </button>
        )}
      </div>
      <div className="cdp-grid">
        <div className="cdp-map-area">
          {isColombia
            ? <ColombiaMap selected={selected} onSelect={setSelected} />
            : <MapPlaceholder country={country} />
          }
        </div>
        <div className="cdp-side">
          {isColombia && dept && (
            <div className="cdp-dept">
              <div className="cdp-dept-head">
                <span className="cdp-dept-name">{dept.name}</span>
                <button
                  type="button"
                  className="cdp-dept-clear"
                  onClick={() => setSelected(null)}
                >
                  clear
                </button>
              </div>
              <dl className="cdp-dept-meta">
                <div><dt>Capital</dt><dd>{dept.capital}</dd></div>
                <div><dt>Altitude</dt><dd>{dept.altitude}</dd></div>
                <div><dt>Harvest</dt><dd>{dept.harvest}</dd></div>
              </dl>
              <p className="cdp-dept-body">{dept.character}</p>
              {latest && (
                <div className="cdp-area">
                  <div className="cdp-area-head">
                    <span className="cdp-area-label">Cultivated area</span>
                    <span className="cdp-area-value">
                      {latest[1].toFixed(1)}k ha
                      <span className="cdp-area-year"> · {latest[0]}</span>
                    </span>
                  </div>
                  <AreaSparkline series={areaSeries} />
                  <div className="cdp-area-foot">
                    <span>
                      {earliest[0]} → {latest[0]}
                      {pctChange !== null && (
                        <span className={pctChange >= 0 ? 'cdp-trend-up' : 'cdp-trend-down'}>
                          {' '}{pctChange >= 0 ? '+' : ''}{pctChange}%
                        </span>
                      )}
                    </span>
                    <a
                      className="cdp-source-pill"
                      href={FNC_SOURCE_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      FNC · {FNC_FETCHED_ON}
                    </a>
                  </div>
                </div>
              )}
              <a
                className="cdp-dept-ref"
                href={dept.fncRef}
                target="_blank"
                rel="noreferrer"
              >
                FNC regional brief →
              </a>
            </div>
          )}
          {isColombia && !dept && (
            <div className="cdp-pills-block">
              <p className="cdp-pills-intro">
                The six highlighted departments carry the FNC coffee axis. Each
                has its own altitude band, harvest window, and cup profile.
                Click one to read the editorial note.
              </p>
              <ul className="cdp-pills">
                {COLOMBIA_COFFEE_DEPARTMENT_LABELS.map(name => (
                  <li key={name}>
                    <button
                      type="button"
                      className="cdp-pill"
                      onClick={() => setSelected(name)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {story && (
            <div className="cdp-story-block">
              <span className="cdp-story-label">On {country}</span>
              <p className="cdp-story">{story}</p>
            </div>
          )}
        </div>
      </div>
      {isColombia && (
        <div className="cdp-attr">
          Map:{' '}
          <a href={COLOMBIA_MAP_ATTRIBUTION.url} target="_blank" rel="noreferrer">
            {COLOMBIA_MAP_ATTRIBUTION.source}
          </a>{' '}
          by {COLOMBIA_MAP_ATTRIBUTION.author} ·{' '}
          <a
            href={COLOMBIA_MAP_ATTRIBUTION.licenseUrl}
            target="_blank"
            rel="noreferrer"
          >
            {COLOMBIA_MAP_ATTRIBUTION.license}
          </a>
        </div>
      )}
    </div>
  );
}
