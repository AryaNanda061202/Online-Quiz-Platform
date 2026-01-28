import React, { useState } from 'react';
import './Header.css';
import SignupPage from '../../pages/signupPage/SignupPage';
import LoginPage from '../../pages/loginPage/LoginPage';
import { Link } from 'react-router-dom';

function Header({ onSignupClick, onLoginClick }) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSignupClick = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const handleCloseModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(false);
  };

  return (
    <header className="landing-header">
      <div className="logo">Quizzy</div>
      <nav>
        {/* 
          These <Link to="/#section"> links will navigate to the landing page ("/") 
          and set the hash in the URL (e.g., "/#subjects"). 
          On the landing page, you should have elements with matching IDs (e.g., id="subjects").
          When the hash changes, the browser will scroll to the element with that ID.
        */}
        <Link to="/#home">Home</Link>
        <Link to="/#subjects">Subjects</Link>
        <Link to="/#features">Features</Link>
        <Link to="/#contact">Contact</Link>
        <button className="btn-primary nav-button" onClick={handleLoginClick}>Sign In</button>
        <button className="btn-secondary nav-button" onClick={handleSignupClick}>Sign Up</button>
      </nav>
      {showSignupModal && (
        <div className="modal">
          <div className="modal-content">
            <SignupPage onSignupClick={onSignupClick} onLoginClick={onLoginClick}  onNavigate={handleCloseModal} />
          </div>
        </div>
      )}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <LoginPage onSignupClick={onSignupClick} onLoginClick={onLoginClick} onNavigate={handleCloseModal} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;