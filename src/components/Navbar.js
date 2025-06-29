import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = ["/", "/about", "/products", "/why-us", "/who-we-serve", "/contact"];
const labels = ["Home", "About Us", "Our Products", "Why Us", "Who We Serve", "Contact Us"];

function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navbarRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => setIsMobileNavOpen(!isMobileNavOpen);

  useEffect(() => {
    if (navbarRef.current) {
      navbarRef.current.classList.add('navbar-slide-in');
    }
  }, []);

  return (
    <nav ref={navbarRef} className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Amma Nana Foods Logo" className="logo-circle" />
        </Link>

        <button className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isMobileNavOpen ? 'open' : ''}`} />
          <div className={`bar ${isMobileNavOpen ? 'open' : ''}`} />
          <div className={`bar ${isMobileNavOpen ? 'open' : ''}`} />
        </button>

        <ul className="navbar-list">
          {navItems.map((path, index) => (
            <li key={index}>
              <Link to={path}>
                <button
                  className={`navbar-btn ${
                    location.pathname === path ? 'active-nav-item' : ''
                  }`}
                >
                  {labels[index]}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={`mobile-nav ${isMobileNavOpen ? 'active' : ''}`}>
        <ul className="navbar-list">
          {navItems.map((path, index) => (
            <li key={index}>
              <Link to={path}>
                <button
                  className={`navbar-btn ${
                    location.pathname === path ? 'active-nav-item' : ''
                  }`}
                >
                  {labels[index]}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
