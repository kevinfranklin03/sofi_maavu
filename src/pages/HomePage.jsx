// HomePage.js
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/homepage.css";
import mandela from '../assets/mandela.png';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      
      <div className="main-content">
        <div className="home-content-wrapper">
          <div className="text-content">
            <div className="amma-nana-foods-container">
              <h1 className="brand-name">AMMA NANA</h1>
              <h2 className="brand-sub">FOODS</h2>
              <div className="main-tagline">
                <h2>Tradition you can taste.</h2>
                <h2>Quality you can count on.</h2>
                <h2 className="product-highlights">
                  100% Natural | No Preservatives | No Artificial Flavors
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Background mandala - larger with fade effect */}
        <img
          src={mandela}
          alt="Mandala Background"
          className="rotating-mandala-back"
        />
        
        {/* Foreground mandala - original size */}
        <img
          src={mandela}
          alt="Decorative Mandala"
          className="rotating-mandala"
        />
      </div>
    </div>
  );
}

export default HomePage;