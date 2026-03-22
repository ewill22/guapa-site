import { useState } from 'react';
import './Nav.css';

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  return (
    <nav className="nav">
      <a href={base} className="nav-logo">
        <img src={`${base}assets/guapa_logo_dark.png`} className="logo-img" alt="Guapa" />
        <span className="logo-text">GUAPA <span className="logo-sub">data</span></span>
      </a>

      <div className={`nav-links ${mobileOpen ? 'nav-links--open' : ''}`}>
        <a href={`${base}music.html`} onClick={() => setMobileOpen(false)}>Music</a>
        <a href={`${base}coffee.html`} onClick={() => setMobileOpen(false)}>Coffee</a>
        <a href={`${base}data-solutions.html`} onClick={() => setMobileOpen(false)}>Data Solutions</a>
        <a href={`${base}shop.html`} onClick={() => setMobileOpen(false)}>Merch</a>
      </div>

      <div className="nav-actions">
        <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener" className="nav-social">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a href={`${base}shop.html`} className="nav-cart">Merch →</a>
      </div>

      <button
        className={`nav-toggle ${mobileOpen ? 'nav-toggle--open' : ''}`}
        aria-label="Toggle menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span /><span />
      </button>
    </nav>
  );
}
