import React, { useState, useEffect, useRef } from "react";

function AttemptQuiz({ quiz, onClose, onComplete, onCoinsEarned }) {
  // Provide at least 2 questions for demo/testing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = quiz.questions && quiz.questions.length > 0 ? quiz.questions : [
    {
      text: "Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?",
      points: 100,
      timer: 30,
      difficulty: "Medium",
      options: [
        "Solar Power",
        "Wind Power",
        "Natural Gas",
        "Hydroelectric Power"
      ],
      correct: 2
    },
    {
      text: "What is the capital of France?",
      points: 50,
      timer: 20,
      difficulty: "Easy",
      options: [
        "Berlin",
        "Madrid",
        "Paris",
        "Rome"
      ],
      correct: 2
    }
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [finalScore, setFinalScore] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const timerRef = useRef();
  const [disableOptions, setDisableOptions] = useState(false);
  const [timer, setTimer] = useState(questions[0].timer || 30);
  const [answers, setAnswers] = useState([]);
  // Add a state to delay navigation until after modal is closed
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Format timer as hh:mm:ss
  const formatTimer = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return (
      h.toString().padStart(2, "0") +
      ":" +
      m.toString().padStart(2, "0") +
      ":" +
      s.toString().padStart(2, "0")
    );
  };

  // Reset timer and selection on question change
  useEffect(() => {
    if (showCompletionModal) return;
    setTimer(questions[current].timer || 30);
    setSelected(null);
    setDisableOptions(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timerRef.current);
          setDisableOptions(true);
          setTimeout(() => {
            if (!showCompletionModal) handleSkip(true);
          }, 0);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [current, showCompletionModal]);

  // Option selection (always allow until Next/Submit)
  const handleOption = (idx) => {
    if (disableOptions) return;
    setSelected(idx);
  };

  // Add coins to user (simulate with localStorage or callback)
  const addCoinsToUser = (coins) => {
    if (typeof onCoinsEarned === "function") {
      onCoinsEarned(coins);
    } else {
      // fallback: store in localStorage for demo
      const prev = parseInt(localStorage.getItem("userCoins") || "0", 10);
      localStorage.setItem("userCoins", prev + coins);
    }
  };

  // Next question logic
  const handleNext = () => {
    setDisableOptions(true);
    const correct = questions[current].correct;
    const isCorrect = selected === correct;
    const pts = isCorrect ? questions[current].points : 0;
    const nextScore = score + pts;
    const nextLives = lives - (isCorrect ? 0 : 1);

    setScore(nextScore);
    setAnswers(a => [...a, { selected, correct, isCorrect }]);
    setLives(nextLives);

    setTimeout(() => {
      if (current + 1 < questions.length && nextLives > 0) {
        setCurrent(c => c + 1);
      } else {
        setFinalScore(nextScore);
        setShowCompletionModal(true);
        addCoinsToUser(nextScore);
        if (typeof onComplete === "function") {
          onComplete(nextScore, true);
        }
      }
    }, 0);
  };

  // Skip logic
  const handleSkip = (fromTimer = false) => {
    setDisableOptions(true);
    const nextLives = lives - 1;
    setAnswers(a => [...a, { selected: null, correct: questions[current].correct, isCorrect: false }]);
    setLives(nextLives);

    setTimeout(() => {
      if (current + 1 < questions.length && nextLives > 0) {
        setCurrent(c => c + 1);
      } else {
        setFinalScore(score);
        setShowCompletionModal(true);
        addCoinsToUser(score);
        if (typeof onComplete === "function") {
          onComplete(score, true);
        }
      }
    }, 0);
    if (!fromTimer) clearInterval(timerRef.current);
  };

  // Submit logic
  const handleSubmit = () => {
    setDisableOptions(true);
    const correct = questions[current].correct;
    const isCorrect = selected === correct;
    const pts = isCorrect ? questions[current].points : 0;
    const total = score + pts;
    setScore(s => s + pts);
    setAnswers(a => [...a, { selected, correct, isCorrect }]);
    setFinalScore(total);
    setShowCompletionModal(true);
    addCoinsToUser(total);
    if (typeof onComplete === "function") {
      onComplete(total, true);
    }
  };

  // Modal for quiz completion and score
  const CompletionModal = ({ finalScore, score, onCloseModal }) => (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(24,24,27,0.95)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#23232b",
        borderRadius: 16,
        boxShadow: "0 4px 32px #0008",
        padding: 40,
        color: "#fff",
        minWidth: 320,
        textAlign: "center",
        position: "relative"
      }}>
        <h2 style={{ marginBottom: 18 }}>Quiz Completed!</h2>
        <div style={{ fontSize: 24, margin: "18px 0" }}>
          Your Score: <span style={{ color: "#FFD700", fontWeight: 700 }}>{finalScore !== null ? finalScore : score} <span role="img" aria-label="coin">🪙</span></span>
        </div>
        <button
          onClick={onCloseModal}
          style={{
            background: "#a855f7",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontWeight: 600,
            fontSize: 16,
            marginTop: 24,
            cursor: "pointer"
          }}
        >Go to Dashboard</button>
      </div>
    </div>
  );

  // When modal closes, trigger dashboard navigation (onClose)
  const handleModalClose = () => {
    setShowCompletionModal(false);
    // Delay navigation to ensure modal unmounts first
    setTimeout(() => {
      if (typeof onClose === "function") onClose();
    }, 200);
  };

  // If shouldRedirect is true, call onClose (which should navigate to dashboard)
  useEffect(() => {
    if (shouldRedirect && typeof onClose === "function") {
      onClose();
    }
    // eslint-disable-next-line
  }, [shouldRedirect]);

  const question = questions[current];
  const percentComplete = Math.round((answers.length / questions.length) * 100);

  return (
    <>
      <div className="quiz-attempt-modal" style={{ position: "fixed", inset: 0, background: "#18181b", zIndex: 1000, overflow: "auto" }}>
        <div style={{
          maxWidth: 1200,
          margin: "40px auto",
          background: "linear-gradient(135deg, #18181b 70%, #2d1a2d 100%)",
          borderRadius: 16,
          boxShadow: "0 4px 32px #0008",
          padding: 32,
          color: "#fff",
          position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                marginRight: 16
              }}
              aria-label="Back"
            >←</button>
            <div style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 22 }}>
              {quiz.title || "Quiz"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 2 }}>
              <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15 }}>Question {current + 1} of {questions.length}</span>
                <span style={{ fontSize: 15, color: "#bdbdbd" }}>
                  {percentComplete}% Complete
                </span>
              </div>
              <div style={{ height: 6, background: "#23232b", borderRadius: 4, marginBottom: 24 }}>
                <div style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #a855f7, #6366f1)",
                  borderRadius: 4
                }} />
              </div>
              <div style={{
                background: "#23232b",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                position: "relative"
              }}>
                <span style={{
                  position: "absolute",
                  left: 24,
                  top: 16,
                  background: "#a855f7",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "2px 14px",
                  fontSize: 13,
                  fontWeight: 600
                }}>{question.points} points</span>
                <span style={{
                  position: "absolute",
                  left: "50%",
                  top: 16,
                  transform: "translateX(-50%)",
                  color: "#f87171",
                  fontWeight: 600,
                  fontSize: 15
                }}>⏰ {formatTimer(timer)}</span>
                <span style={{
                  position: "absolute",
                  right: 24,
                  top: 16,
                  background: "#23232b",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "2px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid #444"
                }}>{question.difficulty}</span>
                <div style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
                  {question.text}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    style={{
                      background: selected === idx ? "#a855f7" : "#18181b",
                      color: "#fff",
                      border: selected === idx ? "2px solid #a855f7" : "1px solid #333",
                      borderRadius: 10,
                      padding: "18px 18px",
                      fontSize: 17,
                      fontWeight: 500,
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: disableOptions ? "not-allowed" : "pointer",
                      transition: "background 0.2s"
                    }}
                    onClick={() => handleOption(idx)}
                    disabled={disableOptions}
                  >
                    <span style={{
                      background: "#23232b",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      border: "1px solid #444"
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  style={{
                    background: "#23232b",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                  onClick={() => handleSkip(false)}
                  disabled={disableOptions}
                >Skip</button>
                {current + 1 === questions.length || lives === 1 ? (
                  <button
                    style={{
                      background: "#a855f7",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 32px",
                      fontWeight: 600,
                      fontSize: 16,
                      marginLeft: "auto",
                      cursor: selected !== null ? "pointer" : "not-allowed"
                    }}
                    onClick={handleSubmit}
                    disabled={selected === null}
                  >Submit</button>
                ) : (
                  <button
                    style={{
                      background: "#a855f7",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 32px",
                      fontWeight: 600,
                      fontSize: 16,
                      marginLeft: "auto",
                      cursor: selected !== null ? "pointer" : "not-allowed"
                    }}
                    onClick={handleNext}
                    disabled={selected === null}
                  >Next Question &rarr;</button>
                )}
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: 24 }}>
              <div style={{
                background: "#23232b",
                borderRadius: 12,
                padding: 24,
                minWidth: 220
              }}>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#bdbdbd", fontSize: 15 }}>Score</div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 22,
                    marginTop: 2
                  }}>{score}</div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#bdbdbd", fontSize: 15 }}>Lives</div>
                  <div style={{ fontSize: 22, color: "#f87171" }}>{lives > 0 ? "❤️".repeat(lives) : "0"}</div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#bdbdbd", fontSize: 15 }}>Progress</div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{current + 1}/{questions.length}</div>
                </div>
                <div>
                  <div style={{ color: "#bdbdbd", fontSize: 15 }}>Position</div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>2nd</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCompletionModal && (
        <CompletionModal
          finalScore={finalScore}
          score={score}
          onCloseModal={handleModalClose}
        />
      )}
    </>
  );
}

export default AttemptQuiz;
