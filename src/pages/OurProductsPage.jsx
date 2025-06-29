import React from 'react';
import '../styles/ourproducts.css';
import Navbar from '../components/Navbar';

import dosa from '../assets/dosa.png';
import idly from '../assets/idli.png';
import paniyaram from '../assets/paniyaram.png';
import aapam from '../assets/appam.png';
import vadai from '../assets/vada.png';
import mandala from '../assets/mandela.png';

function OurProductsPage() {
  return (
    <div className="our-products-page">
      <Navbar />

      {/* Mandala background */}
      <div className="rotating-mandala-background">
        <img src={mandala} alt="Mandala Background" />
      </div>

      {/* Hero section */}
      <div className="ourproducts-hero">
        <h1>OUR PRODUCTS</h1>
        <h2>Freshly Made. Purely Yours.</h2>
        <p>
          At Amma Nana Foods, we specialize in freshly made, high-quality batters tailored to your taste. All batters
          are 100% natural, free from preservatives, no salt, and no chemicals — perfect for families who care about clean, wholesome food.
        </p>
      </div>

      {/* Preparation Details Section */}
      <div className="products-description">
        <h3>How We Prepare</h3>
        <ul>
          <li>
            <strong>Customized Ratios:</strong> We start by understanding your exact needs —
            soft idlies? crispy dosas? spongy paniyarams? We adjust the rice and dhal ratio accordingly.
          </li>
          <li>
            <strong>High-Quality Ingredients:</strong> Only premium rice, urad dal, and fenugreek
            are selected, ensuring purity and nutrition.
          </li>
          <li>
            <strong>Purified Water Only:</strong> We use RO purified water in every step — soaking,
            grinding, and mixing.
          </li>
          <li>
            <strong>With the loving supervision of Amma and Nana:</strong> The batter is ground in a
            clean, hygienic environment using traditional methods that preserve taste and texture.
          </li>
          <li>
            <strong>Fresh Packing:</strong> We pack your batter in clean, sealed containers based on
            your preferences — daily packs, bulk orders, or family-sized.
          </li>
        </ul>
      </div>

      {/* Product grid section */}
<div className="ourproducts-grid-section">
  <h3>We currently offer:</h3>
  <div className="products-grid-wrapper">
    <div className="products-grid">
      <div className="grid-item"><img src={dosa} alt="Dosa" /><p>Dosa Batter</p></div>
      <div className="grid-item"><img src={idly} alt="Idly" /><p>Idly Batter</p></div>
      <div className="grid-item"><img src={paniyaram} alt="Paniyaram" /><p>Paniyaram Batter</p></div>
      <div className="grid-item"><img src={aapam} alt="Aapam" /><p>Aapam Batter</p></div>
      <div className="grid-item"><img src={vadai} alt="Vadai" /><p>Vadai Batter</p></div>
    </div>
  </div>
</div>


      {/* CTA */}
      <div className="ourproducts-cta">
        <p>
          We pack your batter fresh and deliver across the region — whether for homes, PGs, hotels, or catering services.
        </p>
      </div>
    </div>
  );
}

export default OurProductsPage;