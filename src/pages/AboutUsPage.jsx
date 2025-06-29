import React from 'react';
import '../styles/aboutus.css';
import Navbar from '../components/Navbar';
import mandala from '../assets/mandela.png';
import sofica from '../assets/sofi.jpg';
import signature from '../assets/signature.png';

function AboutUsPage() {
  return (
    <div className="aboutus-page">
      <Navbar />

      {/* Mandala background */}
      <div className="rotating-mandala-background">
        <img src={mandala} alt="Mandala Background" />
      </div>

      {/* Main Content */}
      <div className="aboutus-content">
        <h2>ABOUT US</h2>
        <img src={sofica} alt="Sofica Bharath" className="founder-photo" />

        <h3>Hi, I’m Sofica Bharath</h3>
        <p className="founder-title">Founder of Amma Nana Foods</p>

        <div className="story-text">
          <p>
            I hold a Master’s degree in Biomedical Engineering from the UK and worked as a Regulatory Affairs Associate in a leading 
            medical device company in the UK.
          </p>
          <p>
            While my career was progressing in the corporate world, there was always a voice in me — a passion for authentic food and a dream to build something of my own. 
            I grew up watching how my Amma and Nana cooked with love, precision, and care.
          </p>
          <p>
            That’s where my food journey began — at home, with tradition. But today, I see what's missing: Real quality. Real ingredients. Real care. 
            Everywhere you turn, shortcuts are being taken preservatives, chemical additives, and no heart in the process.
          </p>
          <p>
            That’s when I knew: It’s time to bring trust back to food. So I started Amma Nana Foods not just as a business, but as a promise. A promise to deliver fresh, honest, 
            high-quality batter to your homes and kitchens, just like how Amma and Nana would make it. No chemicals. No salt. No compromises. Just food  the way it should be.
          </p>
          <p className="closing-line">
            From my kitchen to yours, with warmth, care, and tradition.
          </p>
        </div>

        <div className="signature-block">
  <img src={signature} alt="Sofica Signature" className="signature-image" />
  <p className="signature-title">Founder, Dreamer, and Daughter of Amma & Nana</p>
</div>

      </div>
    </div>
  );
}

export default AboutUsPage;
