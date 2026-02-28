import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* User will add lockup_light.png to public/assets/ */}
            <img src="/assets/lockup_light.png" alt="Guapa" className="footer-logo" />
            <p>A creative collective for friends who make things.</p>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <a href="/music.html">Music</a>
            <a href="/coffee.html">Coffee</a>
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <a href="#about">About</a>
            <a href="/shop.html">Shop</a>
          </div>
          <div className="footer-links">
            <h4>Follow</h4>
            <a href="https://instagram.com/guapa_skate" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Guapa Collective</p>
        </div>
      </div>
    </footer>
  );
}
