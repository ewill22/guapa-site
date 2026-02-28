import { useState, useEffect, useMemo } from 'react';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import ProfileModal from './components/ProfileModal';
import GuapaAvatar from './components/GuapaAvatar';
import {
  TIMELINE, LENS_COLORS, LENS_ICONS, LENS_LABELS, FULL_LABELS,
  getEvent, hashStr,
} from './data/timeline';
import { getTaxonomy } from './data/taxonomy';
import { MOCK_USERS } from './data/users';
import './App.css';

// ============ TAXONOMY BRANCH ============
function TaxBranch({ branch, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const badges = {
    up:   ['var(--green)',  'rgba(126,200,155,0.12)', '↑ rising'],
    down: ['#c45a5a',      'rgba(196,90,90,0.12)',   '↓ falling'],
    new:  ['var(--yellow)', 'rgba(240,192,20,0.12)',  '✦ new'],
    peak: ['var(--pink)',   'rgba(232,160,176,0.12)', '● peak'],
  };

  return (
    <div className="tax-branch">
      <button className={`tax-header ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span className="tax-icon">{branch.icon}</span>
        <span className="tax-label">{branch.label}</span>
        <span className="tax-stat">{branch.stat}</span>
        <svg className={`tax-chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <div className="tax-items" style={{ maxHeight: open ? 300 : 0 }}>
        {branch.items.map((item, j) => {
          const [col, bg, lbl] = badges[item.b] || badges.up;
          return (
            <div key={j} className="tax-item">
              <span className="tax-item-name">{item.name}</span>
              <span className="tax-item-detail">{item.d}</span>
              <span className="tax-badge" style={{ color: col, background: bg }}>{lbl}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ APP ============
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [lens, setLens] = useState('world');
  const [year, setYear] = useState(2026);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [showLogin, setShowLogin] = useState(false);
  const [loginName, setLoginName] = useState('');

  // Simulate users moving around
  useEffect(() => {
    const iv = setInterval(() => {
      setUsers(prev => prev.map(u => {
        if (u.id === 999 || Math.random() > 0.9) return u;
        const ls = Object.keys(LENS_COLORS);
        return Math.random() > 0.6
          ? { ...u, lens: ls[Math.floor(Math.random() * ls.length)], year: 1960 + Math.floor(Math.random() * 66) }
          : { ...u, year: Math.max(1960, Math.min(2026, u.year + Math.floor(Math.random() * 11) - 5)) };
      }));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Sync current user's position
  useEffect(() => {
    if (currentUser) setUsers(p => p.map(u => u.id === 999 ? { ...u, lens, year } : u));
  }, [lens, year, currentUser]);

  const doLogin = () => {
    if (!loginName.trim()) return;
    const u = { id: 999, name: loginName.trim(), lens, year, pub: true, bio: '' };
    setCurrentUser(u);
    setUsers(p => [u, ...p]);
    setShowLogin(false);
    setLoginName('');
  };

  const togglePub = () => {
    if (!currentUser) return;
    const u = { ...currentUser, pub: !currentUser.pub };
    setCurrentUser(u);
    setUsers(p => p.map(x => x.id === 999 ? u : x));
  };

  const lc = LENS_COLORS[lens];
  const ev = getEvent(lens, year);
  const tax = getTaxonomy(lens, year);
  const headerLabel = currentUser
    ? `The World According to ${currentUser.name}`
    : FULL_LABELS[lens];

  const bars = useMemo(() => {
    const ey = Object.keys(TIMELINE[lens]).map(Number);
    return Array.from({ length: 67 }, (_, i) => {
      const y = 1960 + i;
      const has = ey.includes(y);
      return { year: y, h: has ? 18 + (hashStr(y + lens) % 38) : 3 + (hashStr(y + lens) % 10) };
    });
  }, [lens]);

  return (
    <>
      <Nav
        currentUser={currentUser}
        onTogglePublic={togglePub}
        onPlugIn={() => setShowLogin(!showLogin)}
        showLogin={showLogin}
      />

      <Banner />

      <Ticker users={users} onUserClick={setProfile} />

      {/* Login Panel */}
      {showLogin && !currentUser && (
        <div className="login-wrapper">
          <div className="login-panel">
            <h4>Plug in to the coffeeshop</h4>
            <p>Your Guapa figure is generated from your name.</p>
            <div className="login-preview">
              <GuapaAvatar name={loginName || 'preview'} size={36} />
              <span>{loginName ? 'Your avatar' : 'Type a name to preview'}</span>
            </div>
            <div className="login-form">
              <input
                type="text" value={loginName}
                onChange={e => setLoginName(e.target.value)}
                placeholder="your_name" maxLength={16}
                onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
              />
              <button onClick={doLogin} disabled={!loginName.trim()}
                className={loginName.trim() ? 'active' : ''}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Dashboard Hero */}
        <section className="dashboard-hero">
          <p className="dashboard-label">{headerLabel}</p>

          {/* Lens Selector */}
          <div className="lens-selector">
            {Object.keys(LENS_COLORS).map(l => (
              <button key={l}
                className={`lens-pill ${lens === l ? 'active' : ''}`}
                style={lens === l ? { color: LENS_COLORS[l], borderColor: LENS_COLORS[l], background: `${LENS_COLORS[l]}10` } : {}}
                onClick={() => setLens(l)}>
                <span>{LENS_ICONS[l]}</span>{LENS_LABELS[l]}
              </button>
            ))}
          </div>

          <div className="world-timeline">
            {/* Decade Nav */}
            <div className="decade-nav">
              {[1960,1970,1980,1990,2000,2010,2020].map(d => {
                const act = Math.floor(year/10)*10 === d || (year >= 2020 && d === 2020);
                return (
                  <button key={d}
                    className={`decade-btn ${act ? 'active' : ''}`}
                    style={act ? { color: lc, borderColor: lc, background: `${lc}12` } : {}}
                    onClick={() => setYear(d)}>
                    {`${d}`.slice(2)}s
                  </button>
                );
              })}
            </div>

            {/* Year + Bars */}
            <div className="timeline-header">
              <div className="year-display">
                <h2 style={{ color: lc }}>{year}</h2>
              </div>
              <div className="year-vibe">{ev?.vibe}</div>
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
              {year === 2026 && (
                <span className="live-badge">
                  <span className="live-dot" />Live
                </span>
              )}
            </div>

            {/* Slider */}
            <div className="slider-row">
              <div className="slider-spacer" />
              <div className="slider-wrapper">
                <input type="range" className="year-slider" min="1960" max="2026"
                  value={year} onChange={e => setYear(+e.target.value)}
                  style={{
                    background: `linear-gradient(to right, ${lc} 0%, ${lc} ${((year-1960)/66)*100}%, var(--gray-800) ${((year-1960)/66)*100}%, var(--gray-800) 100%)`,
                    accentColor: lc,
                  }}
                />
                <div className="timeline-markers">
                  <span>1960</span><span>1980</span><span>2000</span><span>2026</span>
                </div>
              </div>
            </div>

            {/* Event Card */}
            <div className="world-event visible">
              <div className="event-category">{ev?.ev?.cat}</div>
              <div className="event-title">{ev?.ev?.title}</div>
              <div className="event-description">{ev?.ev?.desc}</div>
            </div>

            {/* Taxonomy */}
            {tax && (
              <div className="taxonomy-section">
                <h3 className="taxonomy-title">
                  {lens === 'world' ? "What's Happening" : `${LENS_LABELS[lens]} Landscape`}
                </h3>
                <div className="taxonomy-branches">
                  {tax.map((b, i) => <TaxBranch key={i} branch={b} defaultOpen={i === 0} />)}
                </div>
              </div>
            )}

            <div className="taxonomy-cta">
              <span>The Guapa Aggregated Taxonomy — a living index of the world. </span>
              <span className="taxonomy-cta-link">Explore the full archive →</span>
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="category-section">
          <p className="section-label">Go Deeper</p>
          <div className="category-grid">
            <a href="/music.html" className="category-card">
              <span className="category-icon">♫</span>
              <h3>Music</h3>
              <p>Journey through sound</p>
            </a>
            <a href="/coffee.html" className="category-card">
              <span className="category-icon">☕</span>
              <h3>Coffee</h3>
              <p>Origins & roasters</p>
            </a>
            <a href="/shop.html" className="category-card">
              <span className="category-icon">🛹</span>
              <h3>Shop</h3>
              <p>Merch from the collective</p>
            </a>
          </div>
        </section>

        {/* Coffeeshop CTA */}
        {!currentUser && (
          <section className="coffeeshop-cta">
            <div className="coffeeshop-cta-inner">
              <div className="coffeeshop-cta-icon">☕</div>
              <h3>The Guapa Virtual Coffeeshop</h3>
              <p>Plug in to see who's exploring. Click someone to see the world through their eyes.</p>
              <button onClick={() => setShowLogin(true)} className="btn btn-primary">Plug In →</button>
            </div>
          </section>
        )}

        {/* Featured Banner */}
        <section className="featured-banner">
          <div className="featured-banner-inner">
            <p className="featured-banner-label">The Collective</p>
            <h2 className="featured-banner-headline">Music. Coffee. Culture. New Jersey.</h2>
            <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener" className="featured-banner-btn">Follow Along →</a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="about">
          <div className="container">
            <div className="about-grid">
              <div className="about-image">
                <img src={`${import.meta.env.BASE_URL}assets/guapa_logo_dark.png`} alt="Guapa" className="about-logo" />
              </div>
              <div className="about-content">
                <h2>About Guapa</h2>
                <p>Guapa is a creative collective based in New Jersey. We're a group of friends who skate, make things, and share what we love.</p>
                <p>This is a space for our creative projects—music, data, and whatever else we get into. No pressure, just making stuff.</p>
                <div className="about-links">
                  <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener" className="btn btn-outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    @guapa_skate
                  </a>
                  <div className="about-sub-links">
                    <a href="https://www.instagram.com/erycwill/" target="_blank" rel="noopener">Website + Data: @erycwill</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter">
          <div className="container">
            <div className="newsletter-content">
              <h2>Stay in the loop</h2>
              <p>Get updates on new drops and collective projects.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="your@email.com" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Profile Modal */}
      {profile && <ProfileModal user={profile} onClose={() => setProfile(null)} />}
    </>
  );
}
