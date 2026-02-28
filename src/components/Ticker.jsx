import { useRef, useEffect, useMemo } from 'react';
import GuapaAvatar from './GuapaAvatar';
import { LENS_COLORS, LENS_ICONS } from '../data/timeline';
import './Ticker.css';

export default function Ticker({ users, onUserClick }) {
  const innerRef = useRef(null);
  const tripled = useMemo(() => [...users, ...users, ...users], [users]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    let pos = 0;
    const sw = inner.scrollWidth / 3;
    let raf;
    const tick = () => {
      pos -= 0.4;
      if (Math.abs(pos) >= sw) pos += sw;
      inner.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tripled]);

  return (
    <div className="ticker">
      <div className="ticker-label">
        <div className="ticker-label-title">☕ Coffeeshop</div>
        <div className="ticker-label-count">{users.length} plugged in</div>
      </div>
      <div className="ticker-fade-right" />
      <div className="ticker-scroll">
        <div ref={innerRef} className="ticker-inner">
          {tripled.map((u, i) => (
            <button
              key={`${u.id}-${i}`}
              className="ticker-user"
              onClick={() => onUserClick(u)}
            >
              <div className="ticker-avatar">
                <GuapaAvatar name={u.name} size={20} />
                <div className="ticker-online-dot" />
              </div>
              <span className="ticker-name">{u.name}</span>
              <span className="ticker-lens" style={{ color: LENS_COLORS[u.lens] }}>
                {LENS_ICONS[u.lens]} {u.year}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
