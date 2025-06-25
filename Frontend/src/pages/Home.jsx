// src/pages/Home.jsx
import { Link } from "react-router-dom";
import "./Home.scss";

export default function Home() {
  return (
    <div className="hero-container">
      <header className="hero-header">
        <h1>
          Welcome to TuneSync
          <span role="img" aria-label="music">
            🎵
          </span>
        </h1>
        <p className="tagline">Secure your media. Simplify your life.</p>
        <img src="src/assets/headset.png" alt="img" className="hero-image" />
        <Link to="/dashboard" className="cta-button">
          Get Started
        </Link>
      </header>

      <footer className="hero-footer">
        <p>© 2025 TuneSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
