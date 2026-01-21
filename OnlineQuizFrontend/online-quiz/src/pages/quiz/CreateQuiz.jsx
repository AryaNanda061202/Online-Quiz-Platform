import React, { useState } from "react";
// import "./CreateQuiz.css"; // already imported in Dashboard

function CreateQuiz({ onNext, onCancel }) {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    timeLimit: 15,
    passingScore: 70,
    randomize: false,
    immediateResults: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValid =
    quiz.title.trim() &&
    quiz.description.trim() &&
    quiz.category &&
    quiz.difficulty &&
    quiz.timeLimit > 0 &&
    quiz.passingScore > 0;

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-header">
        <button className="back-btn" onClick={onCancel}>
          {"<"}
        </button>
        <div>
          <h2>Create New Quiz</h2>
          <p>Add questions, set answers and configure quiz settings</p>
        </div>
        {/* Removed Save Draft and Preview buttons */}
      </div>
      <div className="create-quiz-body">
        <div className="quiz-details">
          <h3>Quiz Details</h3>
          <div className="form-group">
            <label>Quiz Title</label>
            <input
              name="title"
              placeholder="Quiz Title"
              value={quiz.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={quiz.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={quiz.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Science">Science</option>
                <option value="Math">Math</option>
                {/* Add more categories as needed */}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
        <div className="quiz-settings">
          <h3>Quiz Settings</h3>
          <div className="form-group">
            <label>Time Limit</label>
            <div className="input-inline">
              <input
                type="number"
                name="timeLimit"
                value={quiz.timeLimit}
                onChange={handleChange}
                min={1}
              />
              <span>minutes</span>
            </div>
          </div>
          <div className="form-group">
            <label>Passing Score</label>
            <div className="input-inline">
              <input
                type="number"
                name="passingScore"
                value={quiz.passingScore}
                onChange={handleChange}
                min={1}
                max={100}
              />
              <span>%</span>
            </div>
          </div>
          <div className="form-group toggle-row">
            <label>Randomize Questions</label>
            <input
              type="checkbox"
              name="randomize"
              checked={quiz.randomize}
              onChange={handleChange}
            />
          </div>
          <div className="form-group toggle-row">
            <label>Immediate Results</label>
            <input
              type="checkbox"
              name="immediateResults"
              checked={quiz.immediateResults}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="create-quiz-footer">
        <button className="prev-btn" onClick={onCancel}>
          Prev
        </button>
        <button
          className="next-btn"
          onClick={() => onNext && onNext(quiz)}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CreateQuiz;
