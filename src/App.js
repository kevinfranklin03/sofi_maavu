import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css';

const sections = { '/about': 'about', '/products': 'products', '/why-us': 'why-us', '/who-we-serve': 'who-we-serve', '/bulk-supply': 'bulk-supply', '/contact': 'contact' };

function Site() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      if (!target) return;
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      // Only an explicit section click animates. Deep links and history restore instantly.
      target.scrollIntoView({ behavior: navigationType === 'PUSH' && !reducedMotion ? 'smooth' : 'instant', block: 'start' });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.hash, navigationType]);

  useEffect(() => { document.title = 'Amma Nana Foods | Idli & Dosa Batter Supplier in Chennai'; }, []);

  const handleSectionLink = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href^="#"]');
    const hash = anchor?.getAttribute('href');
    if (!hash || !document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    // A single scroll handler avoids racing native hash scrolling with JavaScript.
    navigate({ pathname: '/', hash });
  };

  return <div className="site-root" onClick={handleSectionLink}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {Object.entries(sections).map(([path, section]) => <Route key={path} path={path} element={<Navigate to={`/#${section}`} replace />} />)}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>;
}

export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}
