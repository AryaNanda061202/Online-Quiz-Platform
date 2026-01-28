// src/components/SubSubjects/SubSubjects.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Correct path: Up two levels to src/
import { SUB_SUBJECTS, MAIN_CATEGORIES } from '../../data'; 
// Correct path: Up one level to components/
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
// Correct path: CSS is in the same folder
import './SubSubjects.css'; 

function SubSubjects() {
  const { categoryId } = useParams(); 
  const navigate = useNavigate();

  const category = MAIN_CATEGORIES.find(cat => cat.id === categoryId);
  const subSubjects = SUB_SUBJECTS[categoryId] || [];

  const handleSubSubjectClick = (subSubjectId) => {
    // Navigates to the QuizLibrary page
    navigate(`/subject/${subSubjectId}`);
  };

  if (!category) {
    return <h1>Category not found!</h1>;
  }

  return (
    <div>
      <Header />
      <div className="sub-subjects-page">
        <h2>Sub-Subjects for: {category.title}</h2>
        <div className="sub-subject-grid">
          {subSubjects.length > 0 ? (
            subSubjects.map(subject => (
              <div 
                key={subject.id} 
                className="sub-subject-card" 
                onClick={() => handleSubSubjectClick(subject.id)}
              >
                <div className="card-icon">{subject.icon}</div>
                <h3>{subject.title}</h3>
                <p>{subject.description}</p>
                <button className="view-quizzes-btn">View Quizzes →</button>
              </div>
            ))
          ) : (
            <p className="no-sub-subjects">No sub-subjects defined yet for this category. Check back soon!</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SubSubjects;