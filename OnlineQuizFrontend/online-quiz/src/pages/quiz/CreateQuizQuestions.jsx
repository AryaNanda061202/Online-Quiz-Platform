import React, { useState } from "react";
import API_ENDPOINTS from '../../config/apiConfig';
// import "./CreateQuiz.css"; // already imported in Dashboard

const defaultQuestion = {
  text: "",
  points: 10,
  type: "Multiple Choice",
  options: ["", ""],
  correct: null,
};

function CreateQuizQuestions({ quiz, onPrev, onPublish }) {
  const [questions, setQuestions] = useState([
    { ...defaultQuestion }
  ]);
  // Add loading state for publish
  const [publishing, setPublishing] = useState(false);

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].correct = oIdx;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const addOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIdx, oIdx) => {
    const updated = [...questions];
    if (updated[qIdx].options.length > 2) {
      updated[qIdx].options.splice(oIdx, 1);
      if (updated[qIdx].correct === oIdx) updated[qIdx].correct = null;
      setQuestions(updated);
    }
  };

  const isValid = questions.every(
    (q) =>
      q.text.trim() &&
      q.options.length >= 2 &&
      q.options.every((opt) => opt.trim()) &&
      q.correct !== null
  );

  // New handler for publishing quiz to API
  const handlePublish = async () => {
    if (!onPublish) return;
    setPublishing(true);
    try {
      const response = await fetch(API_ENDPOINTS.QUIZZES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quiz, questions }),
      });
      if (response.ok) {
        const savedQuiz = await response.json();
        onPublish(savedQuiz); // Pass saved quiz to parent
      } else {
        // fallback: pass local quiz if API fails
        onPublish({ ...quiz, questions });
      }
    } catch {
      onPublish({ ...quiz, questions });
    }
    setPublishing(false);
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-header">
        <button className="back-btn" onClick={onPrev}>{"<"}</button>
        <div>
          <h2>Create New Quiz</h2>
          <p>Add questions, set answers and configure quiz settings</p>
        </div>
        {/* Removed Save Draft and Preview buttons */}
      </div>
      <div className="create-quiz-body">
        <div className="quiz-details" style={{ width: "100%" }}>
          <h3>Quiz Questions</h3>
          <p>Create and manage your quiz questions</p>
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="question-block">
              <div className="question-header" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontWeight: 600 }}>Question {qIdx + 1}</span>
                <span style={{ marginLeft: "auto" }}>
                  Points:{" "}
                  <input
                    type="number"
                    min={1}
                    style={{ width: 50 }}
                    value={q.points}
                    onChange={e => handleQuestionChange(qIdx, "points", Number(e.target.value))}
                  />
                </span>
                <select
                  value={q.type}
                  onChange={e => handleQuestionChange(qIdx, "type", e.target.value)}
                  style={{ marginLeft: 12 }}
                >
                  <option>Multiple Choice</option>
                  {/* Add more types if needed */}
                </select>
                <button
                  className="delete-btn"
                  style={{ marginLeft: 12, color: "#f87171", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}
                  onClick={() => removeQuestion(qIdx)}
                  title="Delete Question"
                >
                  🗑
                </button>
              </div>
              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  value={q.text}
                  onChange={e => handleQuestionChange(qIdx, "text", e.target.value)}
                  placeholder="Enter your question"
                />
              </div>
              <div className="form-group">
                <label>Answer Options</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correct === oIdx}
                      onChange={() => handleCorrectChange(qIdx, oIdx)}
                      style={{ marginRight: 8 }}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                      placeholder={`Option ${oIdx + 1}`}
                      style={{ flex: 1 }}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIdx, oIdx)}
                        style={{ marginLeft: 8, color: "#f87171", background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
                        title="Remove Option"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIdx)}
                  style={{ marginTop: 8, background: "none", color: "#a855f7", border: "1px dashed #a855f7", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            style={{ marginTop: 16, background: "none", color: "#a855f7", border: "1px dashed #a855f7", borderRadius: 6, padding: "8px 0", width: "100%", cursor: "pointer" }}
          >
            + Add Question
          </button>
        </div>
      </div>
      <div className="create-quiz-footer">
        <button className="prev-btn" onClick={onPrev}>Prev</button>
        <button
          className="next-btn"
          onClick={handlePublish}
          disabled={!isValid || publishing}
        >
          {publishing ? "Publishing..." : "Preview & Publish"}
        </button>
      </div>
    </div>
  );
}

export default CreateQuizQuestions;
