import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import './Navbar.css';

const items = [['home', 'Home'], ['products', 'Our batters'], ['why-us', 'Our promise'], ['about', 'Our story'], ['who-we-serve', 'Who we serve']];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  const menuButton = useRef(null);
  const nav = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia?.('(min-width: 1101px)');
    if (!desktop) return;
    const closeOnDesktop = event => { if (event.matches) setIsOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const dismiss = event => {
      if (event.key === 'Escape') { setIsOpen(false); menuButton.current?.focus(); }
    };
    const outside = event => { if (!nav.current?.contains(event.target)) setIsOpen(false); };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', outside); };
  }, [isOpen]);

  const select = id => { setActive(id); setIsOpen(false); };
  return <header className="site-header" ref={nav}>
    <nav className="nav-wrap shell" aria-label="Main navigation">
      <a href="#home" className="brand" aria-label="Amma Nana Foods home" onClick={() => select('home')}>
        <img src={logo} alt="" width="64" height="64" />
        <span>Amma Nana <small>FOODS · MADE WITH CARE</small></span>
      </a>
      <button type="button" className={`menu-toggle ${isOpen ? 'is-open' : ''}`} ref={menuButton}
        aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="primary-menu"
        onClick={() => setIsOpen(open => !open)}><span /><span /></button>
      <ul className={`nav-links ${isOpen ? 'is-open' : ''}`} id="primary-menu">
        {items.map(([id, label]) => <li key={id}><a href={`#${id}`} aria-current={active === id ? 'location' : undefined}
          onClick={() => select(id)}>{label}</a></li>)}
        <li><a href="#contact" className="btn nav-cta" aria-current={active === 'contact' ? 'location' : undefined} onClick={() => select('contact')}>Let’s talk <span aria-hidden="true">↗</span></a></li>
      </ul>
    </nav>
  </header>;
}
