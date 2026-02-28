import { useState } from 'react';
import GuapaAvatar from './GuapaAvatar';
import './Nav.css';

export default function Nav({ currentUser, onTogglePublic, onPlugIn, showLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="nav">
      <a href="/" className="nav-logo">
        <span className="logo-text">
          GUAPA <span className="logo-sub">inc</span>
        </span>
      </a>

      <div className={`nav-links ${mobileOpen ? 'nav-links--open' : ''}`}>
        <a href="/music.html" onClick={() => setMobileOpen(false)}>Music</a>
        <a href="/coffee.html" onClick={() => setMobileOpen(false)}>Coffee</a>
      </div>

      <div className="nav-actions">
        <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener" className="nav-social">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a href="/shop.html" className="nav-cart">Shop →</a>

        {currentUser ? (
          <div className="nav-user">
            <GuapaAvatar name={currentUser.name} size={18} />
            <div className="nav-user-info">
              <span className="nav-user-name">{currentUser.name}</span>
              <button onClick={onTogglePublic} className={`nav-user-status ${currentUser.pub ? 'public' : ''}`}>
                {currentUser.pub ? '● public' : '○ private'} · toggle
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onPlugIn}
            className={`nav-plug-in ${showLogin ? 'active' : ''}`}
          >
            Plug In
          </button>
        )}
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
