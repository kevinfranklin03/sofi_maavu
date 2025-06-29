import React from 'react';
import '../styles/whyuspage.css';
import Navbar from '../components/Navbar';
import mandala from '../assets/mandela.png';
// import videoSrc from '../assets/whyus-video.mp4';
import batterBowl from '../assets/batter.png';

function WhyUsPage() {
  return (
    <div className="whyus-page">
      {/* Navbar at top */}
      <Navbar />

      {/* Rotating mandala background */}
      <div className="rotating-mandala-background">
        <img src={mandala} alt="Mandala Background" />
      </div>

      {/* Page Layout */}
      {/* HERO SECTION – Full Width */}
<div className="whyus-hero">
  <h1>WHY CHOOSE US</h1>
  <h2>No More In-House Hassles — Let Amma Nana Foods Handle It</h2>
  <p>
    Running in-house batter production in hotels and kitchens might sound smart — 
    but let’s be honest: it’s time-consuming, inconsistent, and resource-heavy.
  </p>
  <p>
    At Amma Nana Foods, we do it right — every single day — so you don’t have to.
  </p>
</div>

{/* MIDDLE SECTION – Side-by-side bullets and image */}
<div className="whyus-layout">
  <div className="whyus-left">
    <h3>Here’s What You’re Stuck Managing:</h3>
    <ul>
      <li>Daily sourcing and quality checks of raw ingredients</li>
      <li>Staff training, retention, and performance</li>
      <li>Cleanliness audits and hygiene maintenance</li>
      <li>Equipment maintenance, space constraints</li>
      <li>Time lost in prep — instead of serving customers</li>
    </ul>

    <h3>Here’s What You Get With Us:</h3>
    <ul>
      <li>100% focus on batter — that’s our only business</li>
      <li>Same taste every time — batch after batch</li>
      <li>No preservatives, no salt, no chemicals</li>
      <li>Customized dhal-to-rice ratios based on your menu</li>
      <li>Free doorstep delivery</li>
      <li>Every batch supervised by Amma & Nana with love</li>
    </ul>
  </div>

  <div className="whyus-right">
    <img src={batterBowl} alt="Batter Bowl" className="whyus-image" />
  </div>
</div>

{/* CTA – Bottom Centered Text */}
<div className="whyus-cta">
  <p>
    We do the hard work — you stay focused on delighting your customers.
    <br />
    <strong>Save time. Cut costs. Guarantee quality.</strong><br />
    <strong>That’s the Amma Nana promise.</strong>
  </p>
</div>

    </div>
  );
}

export default WhyUsPage;
