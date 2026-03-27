import './Footer.css';

export default function Footer() {
  const base = import.meta.env.BASE_URL;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-lockup">
              <img src={`${base}assets/guapa_logo_dark.png`} alt="Guapa" className="footer-logo" />
              <span className="footer-logo-text">GUAPA <span className="footer-logo-sub">data</span></span>
            </div>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <a href={`${base}music.html`}>Record Store</a>
            <a href={`${base}coffee.html`}>Coffee</a>
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <a href="#about">About</a>
            <a href={`${base}shop.html`}>Merch</a>
            <a href={`${base}data-solutions.html`}>Data Solutions</a>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <a href={`${base}terms.html`}>Terms</a>
            <a href={`${base}privacy.html`}>Privacy</a>
            <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener" style={{ marginTop: '12px' }}>Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Guapa Data</p>
          <p className="footer-affiliate">Guapa Data earns a small commission from purchases made through links on this page.</p>
        </div>
      </div>
    </footer>
  );
}
