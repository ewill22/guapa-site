import './Footer.css';

export default function Footer() {
  const base = import.meta.env.BASE_URL;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={`${base}assets/lockup_light.png`} alt="Guapa" className="footer-logo" />
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <a href={`${base}music.html`}>Music</a>
            <a href={`${base}coffee.html`}>Coffee</a>
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <a href="#about">About</a>
            <a href={`${base}shop.html`}>Merch</a>
          </div>
          <div className="footer-links">
            <h4>Follow</h4>
            <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Guapa Inc</p>
        </div>
      </div>
    </footer>
  );
}
