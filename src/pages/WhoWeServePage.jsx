import React from 'react';
import '../styles/whoweserve.css';
import Navbar from '../components/Navbar';
import mandala from '../assets/mandela.png';
import hotelIcon from '../assets/hotel.png';
import hospitalIcon from '../assets/hospital.jpg';
import pgIcon from '../assets/apartment.png';
import catererIcon from '../assets/catering.png';
import supermarketIcon from '../assets/supermarkets.png';
import onlineIcon from '../assets/online.png';

function WhoWeServePage() {
  return (
    <div className="whoweserve-page">
      <Navbar />

      <div className="rotating-mandala-background">
        <img src={mandala} alt="Mandala Background" />
      </div>

      <div className="whoweserve-hero">
        <h1>WHO WE SERVE</h1>
        <h2>Bulk Orders to Meet Your Needs</h2>
        <p>
          At Amma Nana Foods, we proudly serve a variety of clients who require high-quality, natural batter in larger quantities.
          Whether you're running a kitchen or planning to stock up, we've got you covered.
        </p>
      </div>

      {/* Bulk Orders Grid Section */}
<div className="whoweserve-grid-section">
  <h3>We currently supply bulk orders to:</h3>
  <div className="grid-container">
    <div className="grid-item"><img src={hotelIcon} alt="Hotel" /><p>Hotels</p></div>
    <div className="grid-item"><img src={hospitalIcon} alt="Hospital" /><p>Hospitals</p></div>
    <div className="grid-item"><img src={pgIcon} alt="PG" /><p>Paying Guest Accommodations</p></div>
    <div className="grid-item"><img src={catererIcon} alt="Caterer" /><p>Caterers</p></div>
  </div>

  <h3>Coming Soon:</h3>
  <div className="grid-container">
    <div className="grid-item"><img src={supermarketIcon} alt="Supermarket" /><p>Supermarkets</p></div>
    <div className="grid-item"><img src={onlineIcon} alt="Online" /><p>Online Platforms</p></div>
  </div>
</div>


      <div className="whoweserve-cta">
        <p>
          Free delivery for all bulk orders — because we believe tradition and quality should come
          straight to your doorstep, with no extra cost.
        </p>
      </div>
    </div>
  );
}

export default WhoWeServePage;
