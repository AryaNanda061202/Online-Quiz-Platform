// src/pages/landingPage/LandingPage.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Correct path: Up two levels to src/components/
import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import Card from '../../components/Card/Card';     
// Correct path: Up two levels to src/
import { MAIN_CATEGORIES } from '../../data'; 
// Correct path: CSS is in the same folder
import './LandingPage.css'; 

function LandingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to section if hash is present in URL
    React.useEffect(() => {
        if (location.hash) {
            const el = document.getElementById(location.hash.replace('#', ''));
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash]);

    const handleCategoryClick = (categoryId) => {
        // Navigates to the SubSubjects page, e.g., /category/science
        navigate(`/category/${categoryId}`);
    };

    const today = new Date();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const days = Array(7).fill(0).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return { 
            name: dayNames[d.getDay()], 
            active: i >= 4 // Example: Last 3 days are active
        };
    });

    return (
        <div className="landing-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section" id="home">
                <div className="hero-content">
                    <p className="subtitle">THE NEXT GENERATION LEARNING</p>
                    <h1>Master Any Subject with Interactive Quizzes</h1>
                    <p>Stop cramming, start quizzing. Quizzy uses spaced repetition and smart learning paths to guarantee retention and boost your grades.</p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Start Learning Now</button>
                        <button className="btn-secondary">Explore Features</button>
                    </div>
                    <div className="join-info">Join 500,000+ students and teachers today.</div>
                </div>
            </section>

            {/* Streaks Section (Mock Data) */}
            <section className="streaks-section" id="streaks">
                <div className="streak-count-display">
                    <span className="current-streak-fire">🔥</span>
                    <span className="streak-number">3 Day Streak</span>
                </div>
                <div className="streak-container">
                    {days.map((day, index) => (
                        <div key={index} className={`streak-day-item ${day.active ? 'active' : ''}`}>
                            <span className="streak-fire">{day.active ? '🔥' : '💧'}</span>
                            <span className="streak-day-label">{day.name}</span>
                        </div>
                    ))}
                </div>
                <p className="streak-text">Keep the streak alive by completing one quiz every day!</p>
            </section>

            {/* Categories Section */}
            <section className="categories-section" id="subjects">
                <h2>Browse Subjects</h2>
                <p>Pick a subject area and dive into thousands of expertly crafted quizzes.</p>
                <div className="categories-grid">
                    {MAIN_CATEGORIES.map(category => (
                        <Card 
                            key={category.id} 
                            icon={category.icon} 
                            title={category.title} 
                            description={category.description}
                            onClick={() => handleCategoryClick(category.id)}
                            isCategory={true}
                        />
                    ))}
                </div>
            </section>

            {/* Why Quizzy Section (Features) */}
            <section className="why-quizzy-section" id="features">
                <h2>Why Choose Quizzy?</h2>
                <p>Smart tools to make learning effective, fun, and personalized.</p>
                <div className="features-grid">
                    <Card
                        icon="🤖"
                        title="AI-Generated Quizzes"
                        description="Instantly create quizzes from any text, link, or document."
                        isFeature={true}
                    />
                     <Card
                        icon="📈"
                        title="Progress Tracking"
                        description="Visualize your mastery and identify weak areas quickly."
                        isFeature={true}
                    />
                     <Card
                        icon="🤝"
                        title="Collaborative Events"
                        description="Challenge your friends or classmates in real-time quiz events."
                        isFeature={true}
                    />
                </div>
            </section>

            {/* Ready to Start Section */}
            <section className="ready-start-section" id="contact">
                <div className="start-content">
                    <h2>Ready to supercharge your study?</h2>
                    <p>Start your free trial today and experience the difference smarter learning makes.</p>
                    <div className="start-buttons">
                        <button className="btn-primary">Get Started Free</button>
                        <button className="btn-secondary-light">Learn More</button>
                    </div>
                </div>
                <div className="start-quiz-preview">
                    <div className="preview-header">
                        <span className="preview-icon">🧪</span>
                        <h3>Chemistry Quiz 101</h3>
                    </div>
                    <p>12 Questions | 15 Mins</p>
                    <button className="preview-btn">Start Quiz</button>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}

export default LandingPage;