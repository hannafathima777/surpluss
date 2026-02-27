import { useState } from "react";
import "./VendorDashboard.css";

function VendorDashboard() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SURPLUS VENDOR</h1>
        <div className="status-badge">LIVE 🟢</div>
      </header>

      <section className="listing-section">
        <div className="line thick"></div>
        <h3>Post Surplus Food</h3>
        <form className="post-form">
          <input type="text" placeholder="ITEM NAME (E.G. VEG THALI)" />
          <div className="form-row">
            <input type="text" placeholder="ORIGINAL PRICE" />
            <input type="text" placeholder="SURPLUS PRICE" />
          </div>
          <label>PICK-UP WINDOW CLOSES AT:</label>
          <input type="time" />
          <button type="submit" className="post-btn">LIST ITEM FOR PICKUP ↗</button>
        </form>
      </section>

      <section className="active-listings">
        <div className="line thin"></div>
        <h3>Active Offers</h3>
        <div className="food-card">
          <div className="card-info">
            <h4>BIRYANI BOWL (X4)</h4>
            <p>PICKUP: 10:30 PM - 11:30 PM</p>
          </div>
          <div className="card-price">$4.00</div>
        </div>
      </section>
    </div>
  );
}

export default VendorDashboard;