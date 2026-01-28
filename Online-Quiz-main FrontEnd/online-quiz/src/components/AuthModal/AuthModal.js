import React from 'react';
import './AuthModal.css';

function AuthModal({ children, title, onNavigate }) {
  // Function to close the modal by navigating back to the landing page
  const handleClose = () => onNavigate('landing'); 

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      {/* Stop click propagation on the content box itself */}
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Adjusted Header Section */}
        <div className="form-header">
            <h2>{title}</h2>
            {/* 1. Adjusted link position */}
            {title === 'Sign in' && (
                <a href="#" className="modal-top-link" onClick={() => onNavigate('signup')}>I don't have an account</a>
            )}
            {title === 'Create Account' && (
                <a href="#" className="modal-top-link" onClick={() => onNavigate('login')}>Sign In</a>
            )}
        </div>

        {/* 2. Added Rocket icon (rocket-icon class added in App.css) */}
        <div className="modal-rocket-box">
            <span className="rocket-icon">🚀</span>
        </div>

        {children}
        
      </div>
    </div>
  );
}

export default AuthModal;