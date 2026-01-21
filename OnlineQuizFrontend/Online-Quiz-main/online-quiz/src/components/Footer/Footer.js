// src/components/Footer/Footer.js

import React from 'react';
// Correct path: CSS is in the same folder
import './Footer.css'; 

function Footer() {
  // Fix for jsx-a11y/anchor-is-valid warning
  const preventDefault = (e) => e.preventDefault();

  return (
    <footer className="landing-footer">
      <div className="footer-col">
        <div className="logo-quizzy">Quizzy</div>
        <p>The ultimate quiz platform for students and teachers. Join today!</p>
        <div className="social-links">
          {/* FIX: Using role="button" and onClick to resolve a11y warning */}
          <a href="#" role="button" onClick={preventDefault} aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" role="button" onClick={preventDefault} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" role="button" onClick={preventDefault} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Quizzes</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Pricing</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;