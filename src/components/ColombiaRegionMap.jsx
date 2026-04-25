import { useEffect, useRef, useState } from 'react';
import {
  COLOMBIA_COFFEE_DEPARTMENTS,
  COLOMBIA_COFFEE_DEPARTMENT_LABELS,
  COLOMBIA_MAP_ATTRIBUTION,
} from '../data/coffee-regions-colombia';
import './ColombiaRegionMap.css';

const SVG_PATH = `${import.meta.env.BASE_URL}assets/colombia-departments.svg`;

export default function ColombiaRegionMap() {
  const [svgMarkup, setSvgMarkup] = useState('');
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(SVG_PATH)
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
      setSelected(prev => (prev === label ? null : label));
    };
    svg.addEventListener('click', onClick);
    return () => { svg.removeEventListener('click', onClick); };
  }, [svgMarkup, selected]);

  const dept = selected ? COLOMBIA_COFFEE_DEPARTMENTS[selected] : null;

  return (
    <div className="colombia-region-map">
      <div className="colombia-map-head">
        <span className="colombia-map-label">Colombia · coffee axis</span>
        <span className="colombia-map-sub">
          6 departments highlighted · click to drill in · Editorial
        </span>
      </div>
      <div className="colombia-map-grid">
        <div
          className="colombia-map-svg"
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
        <div className="colombia-map-panel">
          {dept ? (
            <>
              <div className="colombia-panel-head">
                <span className="colombia-panel-name">{dept.name}</span>
                <button
                  type="button"
                  className="colombia-panel-clear"
                  onClick={() => setSelected(null)}
                >
                  clear
                </button>
              </div>
              <dl className="colombia-panel-meta">
                <div><dt>Capital</dt><dd>{dept.capital}</dd></div>
                <div><dt>Altitude</dt><dd>{dept.altitude}</dd></div>
                <div><dt>Harvest</dt><dd>{dept.harvest}</dd></div>
              </dl>
              <p className="colombia-panel-body">{dept.character}</p>
              <a
                className="colombia-panel-ref"
                href={dept.fncRef}
                target="_blank"
                rel="noreferrer"
              >
                FNC regional brief →
              </a>
            </>
          ) : (
            <>
              <div className="colombia-panel-head">
                <span className="colombia-panel-name">Pick a department</span>
              </div>
              <p className="colombia-panel-body colombia-panel-body--muted">
                The six highlighted departments carry the FNC coffee axis: Cauca,
                Huila, Nariño, Antioquia, Caldas, Tolima. Each has its own
                altitude band, harvest window, and cup profile. Click one to
                read the editorial note.
              </p>
              <ul className="colombia-panel-list">
                {COLOMBIA_COFFEE_DEPARTMENT_LABELS.map(name => (
                  <li key={name}>
                    <button
                      type="button"
                      className="colombia-panel-list-item"
                      onClick={() => setSelected(name)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="colombia-map-attr">
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
    </div>
  );
}
