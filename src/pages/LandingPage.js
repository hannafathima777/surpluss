import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-view">
      <nav className="landing-nav">
        <span className="nav-brand">SURPLUS_SAVER_v1.0</span>
        <span className="nav-date">{new Date().getFullYear()}</span>
      </nav>

      <main className="landing-main">
        <section className="hero-text-container">
          <h1 className="hero-title">SURPLUS<br/>SAVER.</h1>
          <p className="hero-description">
            A specialized protocol for food waste management. 
            Direct connection between vendors and shelters.
          </p>
        </section>

        <section className="landing-actions">
          <button className="btn-black" onClick={() => navigate("/login")}>
            SIGN_IN ↗
          </button>
          <button className="btn-outline" onClick={() => navigate("/register")}>
            REGISTER_IDENTITY
          </button>
        </section>
      </main>

      <footer className="landing-bottom">
        <div className="bottom-meta">
          <span>STATUS: OPERATIONAL</span>
          <span>LOCATION: GLOBAL_NETWORK</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;