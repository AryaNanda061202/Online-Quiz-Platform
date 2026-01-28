// src/components/Card/Card.js

import React from 'react';

// Card Styles are defined in LandingPage.css, but for completeness, 
// let's define a minimal, reusable card component.
// The necessary styles are included in LandingPage.css

const Card = ({ icon, title, description, onClick, isCategory, isFeature }) => {
    // Determine the class based on card type
    let cardClass = 'card-container';
    if (isCategory) cardClass += ' category-card';
    if (isFeature) cardClass += ' feature-card';

    return (
        <div className={cardClass} onClick={onClick}>
            <span className="card-icon">{icon}</span>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            {isCategory && <div className="card-link">Explore Quizzes →</div>}
        </div>
    );
};

export default Card;