import React, { useEffect } from 'react';
import Icon from '../components/Icon';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import dosa from '../assets/dosa.png';
import idly from '../assets/idli.png';
import paniyaram from '../assets/paniyaram.png';
import aapam from '../assets/appam.png';
import vadai from '../assets/vada.png';
import kitchenHero from '../assets/kitchen-hero.png';
import founder from '../assets/sofi.jpg';
import signature from '../assets/signature.png';
import mandala from '../assets/mandela.png';
import logo from '../assets/logo-transparent.png';

const products = [
  ['Dosa Batter', 'Golden edges. A beautiful crunch.', dosa, '01'],
  ['Idly Batter', 'Soft, fluffy, and made for mornings.', idly, '02'],
  ['Paniyaram Batter', 'Little bites of everyday comfort.', paniyaram, '03'],
  ['Aapam Batter', 'Delicate edges. A pillowy centre.', aapam, '04'],
  ['Vadai Batter', 'Crisp outside. Full of goodness.', vadai, '05'],
];
const audiences = [
  ['01', 'Hotels & restaurants', 'Consistent batter that keeps up with your kitchen.'],
  ['02', 'Caterers', 'Freshly prepared for the moments you bring people together.'],
  ['03', 'Hospitals', 'Carefully made batter for your everyday meal service.'],
  ['04', 'PG accommodations', 'Comforting breakfasts, ready for a busy household.'],
];

export default function LandingPage() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    elements.forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('reveal-ready')); };
  }, []);

  return <>
    <Navbar />
    <main id="main-content" tabIndex={-1}>
      <section className="hero hero-cinematic" id="home" aria-labelledby="hero-title" tabIndex={-1}>
        <div className="hero-backdrop" aria-hidden="true"><img src={kitchenHero} alt="" fetchPriority="high" /></div>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="little-line" />FROM OUR KITCHEN TO YOURS</p>
            <h1 id="hero-title">Good mornings<br />start with<br /><em>better batter.</em></h1>
            <p className="hero-description">A little tradition. A lot of care. Fresh, natural batters made the way Amma and Nana would, for food that feels like home.</p>
            <div className="hero-actions">
              <a className="btn" href="#products">Explore our batters <span aria-hidden="true"><Icon /></span></a>
              <a className="btn btn-outline" href="#contact">Enquire about bulk orders <span aria-hidden="true"><Icon /></span></a>
            </div>
            <div className="hero-footnote"><span className="leaf-mark" aria-hidden="true"><Icon name="sunburst" /></span><span>Simple ingredients.<br /><strong>Nothing unnecessary.</strong></span></div>
          </div>
        </div>
        <aside className="custom-batter-strip" aria-label="Customised batter"><div className="shell"><p>Customised for <em>your kitchen.</em></p><span>Your rice-to-dal ratio. Your pack size.</span><a href="#contact">Let’s make it yours <span aria-hidden="true"><Icon /></span></a></div></aside>
      </section>

      <section className="section products-section" id="products" aria-labelledby="products-title" tabIndex={-1}>
        <div className="shell">
          <div className="section-heading reveal"><div><p className="eyebrow">OUR FRESH FAVOURITES</p><h2 id="products-title">A batter for<br /><em>every craving.</em></h2></div><p>From the first idly of the morning to the last crisp dosa at dinner. Familiar favourites, thoughtfully prepared.</p></div>
          <div className="product-grid">{products.map(([name, description, image, number], index) => <article className="product-card reveal" key={name} style={{ '--delay': `${index * 45}ms` }}>
            <div className="product-photo"><span className="product-number">{number}</span><img src={image} alt={name.replace(' Batter', '') + ' serving suggestion'} loading="lazy" /></div>
            <div className="product-info"><h3>{name}</h3><p>{description}</p><a href="#contact" aria-label={`Enquire about ${name.toLowerCase()}`}>Let’s talk batter <span aria-hidden="true"><Icon /></span></a></div>
          </article>)}</div>
          <div className="product-note reveal"><span aria-hidden="true"><Icon name="sunburst" /></span><p>Your kitchen, your preference. We customise rice-to-dal ratios and pack sizes for your menu.</p><a className="text-link" href="#contact">Tell us what you need <span aria-hidden="true"><Icon /></span></a></div>
        </div>
      </section>

      <section className="section promise-section" id="why-us" aria-labelledby="promise-title" tabIndex={-1}>
        <div className="shell promise-grid">
          <div className="promise-intro reveal"><p className="eyebrow">THE GOODNESS IS IN THE DETAILS</p><h2 id="promise-title">Honest ingredients.<br /><em>Extraordinary care.</em></h2><p>We take care of the soaking, grinding, and preparation. You take care of the joy of serving something delicious.</p><a className="btn btn-cream" href="#contact">Bring us to your kitchen <span aria-hidden="true"><Icon /></span></a><img src={mandala} className="promise-mandala" alt="" aria-hidden="true" loading="lazy" /></div>
          <div className="promise-list">
            {[
              ['01', 'Goodness, without the extras.', 'Premium rice, urad dal, and fenugreek. No added salt or preservatives. Just the ingredients your kitchen needs.'],
              ['02', 'Freshness you can count on.', 'RO-purified water, a clean preparation space, and fresh, sealed packing. Care at every step.'],
              ['03', 'A little more personal.', 'Customised ratios, family packs or bulk quantities, and every batch prepared under the loving supervision of Amma and Nana.'],
            ].map(([number, title, description]) => <div className="promise-item reveal" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="section process-section" aria-labelledby="process-title">
        <div className="shell"><div className="center-heading reveal"><p className="eyebrow">SIMPLE STEPS. NO SHORTCUTS.</p><h2 id="process-title">From grain <em>to your kitchen.</em></h2></div>
          <div className="process-grid">{[
            ['01', 'Selected with care', 'Premium ingredients and a rice-to-dal ratio suited to your favourites.'],
            ['02', 'Traditionally prepared', 'Soaked and ground with purified water, with attention to taste and texture.'],
            ['03', 'Packed fresh for you', 'Clean, sealed containers in the quantity that works for your kitchen.'],
          ].map(([number, title, description]) => <div className="process-step reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
        </div>
      </section>

      <section className="section story-section" id="about" aria-labelledby="story-title" tabIndex={-1}>
        <div className="shell story-grid">
          <div className="founder-image reveal"><img src={founder} alt="Sofica Bharath, founder of Amma Nana Foods" loading="lazy" /><div><span>SOFICA BHARATH</span><small>Founder, dreamer & daughter</small></div></div>
          <div className="story-copy reveal"><p className="eyebrow">ROOTED IN FAMILY</p><h2 id="story-title">It started at home.<br /><em>It still feels like it.</em></h2><p className="story-lead">“Amma Nana Foods is more than a business. It’s a promise to bring trust back to everyday food.”</p><p>I’m Sofica Bharath. I grew up watching Amma and Nana cook with love, precision, and care. Those small, everyday moments became the inspiration for something of my own.</p><p>Today, we make fresh, honest batter for your homes and kitchens, with the same warmth and care that started it all.</p><details><summary>A little more of our story <span aria-hidden="true"><Icon name="plus" /></span></summary><p>After a Master’s degree in Biomedical Engineering in the UK and a career in regulatory affairs, I followed a long-held passion for authentic food. I wanted to offer the quality, real ingredients, and attention I grew up with — prepared with care, just as Amma and Nana would make it.</p></details><img src={signature} className="founder-signature" alt="Sofica’s signature" loading="lazy" /><p className="signature-label">From my kitchen to yours, with love.</p></div>
        </div>
      </section>

      <section className="section serve-section" id="who-we-serve" aria-labelledby="serve-title" tabIndex={-1}>
        <div className="shell"><div className="section-heading reveal"><div><p className="eyebrow">GOOD FOOD. ON A BIGGER SCALE.</p><h2 id="serve-title">For kitchens that<br /><em>bring people together.</em></h2></div><p>Running a busy kitchen? Let us handle the batter. Consistent taste, customised quantities, and free delivery for bulk orders.</p></div>
          <div className="audience-grid">{audiences.map(([number, title, text]) => <article className="audience-card reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="serve-bottom reveal"><p><span className="status-dot" />Supermarkets & online platforms — coming soon.</p><a className="btn btn-outline" href="#contact">Discuss your bulk order <span aria-hidden="true"><Icon /></span></a></div>
        </div>
      </section>

      <section className="section contact-section" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
        <div className="shell contact-grid"><div className="contact-copy reveal"><p className="eyebrow">LET’S MAKE SOMETHING GOOD</p><h2 id="contact-title">Your next great<br />meal starts<br /><em>with a hello.</em></h2><p>Fresh batter from Sholinganallur, Chennai. A family order or a kitchen to supply? We’d love to hear what you have in mind.</p><a className="contact-email" href="mailto:ammananafoodschennai@gmail.com">ammananafoodschennai@gmail.com <span aria-hidden="true"><Icon /></span></a><div className="contact-note"><span aria-hidden="true"><Icon name="sunburst" /></span><p>Made with tradition.<br />Delivered with care.</p></div></div><div className="reveal"><ContactForm /></div></div>
      </section>
    </main>
    <footer className="site-footer"><div className="shell footer-top"><a href="#home" className="brand" aria-label="Back to Amma Nana Foods home"><img src={logo} alt="" width="60" height="60" /><span>Amma Nana Foods<small>FRESH BATTER. FAMILIAR COMFORT.</small></span></a><p>Tradition you can taste.<br />Quality you can count on.</p><a href="#home" className="back-top">Back to top <span aria-hidden="true"><Icon name="up" /></span></a></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Amma Nana Foods</span><span>GSTIN: 33NDVPS4644R1Z</span><span>Made with a little love, every day.</span></div></footer>
  </>;
}
