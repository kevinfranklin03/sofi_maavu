import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import './App.css';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import OurProductsPage from './pages/OurProductsPage';
import WhoWeServePage from './pages/WhoWeServePage';
import ContactUsPage from './pages/ContactUsPage';
import WhyUsPage from './pages/WhyUsPage';
// Import other page components

function App() {
  return (
    <BrowserRouter> {/* Wrap your routes with BrowserRouter */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/products" element={<OurProductsPage/>} />
          <Route path="/who-we-serve" element={<WhoWeServePage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          {/* Define routes for your other pages here */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
