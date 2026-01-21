// src/components/QuizLibrary/QuizLibrary.js

import React from 'react';
import { useParams } from 'react-router-dom';
// Correct path: Up two levels to src/
import { QUIZZES } from '../../data'; 
// Correct path: CSS is in the same folder
import './QuizLibrary.css'; 

function QuizLibrary() {
  const { subSubjectId } = useParams(); 
  
  const filteredQuizzes = subSubjectId
    ? QUIZZES.filter(quiz => quiz.subSubjectId === subSubjectId)
    : QUIZZES;

  const subjectTitle = subSubjectId 
    ? subSubjectId.charAt(0).toUpperCase() + subSubjectId.slice(1) 
    : 'All Quizzes';

  return (
    <div className="quiz-library-page">
      {/* Sidebar (Mock UI from image) */}
      <div className="sidebar">
        <h2>Quizzy</h2>
        <div className="sidebar-link"><i className="fas fa-chart-line"></i> Dashboard</div>
        <div className="sidebar-link active"><i className="fas fa-list-alt"></i> Quizzes</div> 
        <div className="sidebar-link"><i className="fas fa-calendar-alt"></i> Events</div>
        <div className="sidebar-link"><i className="fas fa-users"></i> Students</div>
        <div className="manage-heading">Manage</div>
        <div className="sidebar-link"><i className="fas fa-cog"></i> Settings</div>
      </div>

      <div className="main-content">
        <h1>{subjectTitle} Quiz Library</h1>
        
        <div className="top-bar">
          <input type="text" placeholder="Search quizzes..." />
          <button className="create-btn">+ Create New Quiz</button>
        </div>

        <div className="quiz-list">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="quiz-item">
                <div className="quiz-details">
                  <h4>{quiz.title}</h4>
                  <span className={`status ${quiz.status.toLowerCase()}`}>{quiz.status}</span>
                  <div className="meta">
                    <span><i className="fas fa-question-circle"></i> {quiz.questions} questions</span>
                    <span><i className="fas fa-clock"></i> {quiz.time} min</span>
                    <span><i className="fas fa-check-circle"></i> {quiz.completions} completions</span>
                    <span><i className="fas fa-star"></i> Created just now</span>
                  </div>
                </div>
                <div className="quiz-actions">
                    <button className="view-btn">View</button>
                    <button className="options-btn"><i className="fas fa-ellipsis-v"></i></button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-quizzes">No quizzes available for **{subjectTitle}** yet. Please create one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizLibrary;