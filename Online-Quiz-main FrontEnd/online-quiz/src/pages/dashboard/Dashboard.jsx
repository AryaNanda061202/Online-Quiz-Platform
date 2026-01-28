import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useLocation } from "react-router-dom";
import CreateQuiz from "../quiz/CreateQuiz";
import CreateQuizQuestions from "../quiz/CreateQuizQuestions";
import AttemptQuiz from "../quiz/AttemptQuiz";
import "../quiz/CreateQuiz.css";
import API_ENDPOINTS from '../../config/apiConfig';

const statCards = [
  { label: "Total Quizzes", value: "2,543", change: "+12.5%", trend: "up" },
  { label: "Active Events", value: "2,543", change: "+12.5%", trend: "up" },
  { label: "Students", value: "2,543", change: "+12.5%", trend: "up" },
  { label: "Avg. Completion", value: "2,543", change: "-12.5%", trend: "down" },
];

const events = [
  { title: " Mid-term Quiz", meta: "Today, 2:30 PM • 32 participants", primary: true },
  { title: " Weekly Test", meta: "Tomorrow, 10:00 AM • 28 participants" },
  { title: " Final Exam", meta: "May 20, 9:00 AM • 45 participants" },
];

const quizzes = [
  { title: "Introduction to ", questions: 15, completions: 28, completionRate: 75 },
  { title: "Introduction to ", questions: 15, completions: 28, completionRate: 40 },
  { title: "Introduction to ", questions: 15, completions: 28, completionRate: 90 },
];

// Example data for student quizzes and top students this week
const studentQuizzes = [
  { title: "Math Basics", assignedBy: "Mr. Smith", coins: 50, completed: true },
  { title: "Science Quiz", assignedBy: "Ms. Green", coins: 30, completed: false },
  { title: "English Grammar", assignedBy: "Mrs. Brown", coins: 40, completed: true },
];

const topStudentsWeek = [
  { name: "Emma Watson", coins: 120 },
  { name: "Alex John", coins: 110 },
  { name: "Sophia Green", coins: 105 },
  { name: "Michael Clark", coins: 100 },
  { name: "Lucia Wilde", coins: 98 },
  { name: "John Doe", coins: 95 },
  { name: "Jane Smith", coins: 92 },
  { name: "Chris Evans", coins: 90 },
  { name: "Olivia Lee", coins: 88 },
  { name: "Liam Brown", coins: 85 },
];

// Add a placeholder for the quiz attempt screen
function QuizAttemptScreen({ quiz, onClose }) {
  // You can replace this with your actual quiz UI component
  return (
    <div className="quiz-attempt-modal">
      <div style={{
        background: "#18181b",
        color: "#fff",
        borderRadius: 12,
        maxWidth: 900,
        margin: "40px auto",
        boxShadow: "0 4px 32px #0002",
        padding: 32,
        position: "relative"
      }}>
        <button style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer"
        }} onClick={onClose}>×</button>
        <h2>{quiz.title}</h2>
        <p>Quiz attempt screen goes here.</p>
        {/* You can render the quiz questions and logic here */}
      </div>
    </div>
  );
}

const megaQuizzes = [
  {
    id: "science",
    title: "Mega Science Quiz",
    description: "Challenge yourself with advanced science questions.",
    price: 100,
    icon: "🔬",
    quiz: {
      title: "Mega Science Quiz",
      questions: [
        {
          text: "What is the chemical symbol for gold?",
          options: ["Au", "Ag", "Gd", "Go"],
          correct: 0,
          points: 50,
          timer: 30,
          difficulty: "Medium"
        },
        {
          text: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Venus"],
          correct: 1,
          points: 50,
          timer: 30,
          difficulty: "Easy"
        }
      ]
    }
  },
  {
    id: "tech",
    title: "Mega Tech Quiz",
    description: "Test your knowledge of technology and computers.",
    price: 120,
    icon: "💻",
    quiz: {
      title: "Mega Tech Quiz",
      questions: [
        {
          text: "Who is known as the father of computers?",
          options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"],
          correct: 0,
          points: 50,
          timer: 30,
          difficulty: "Medium"
        },
        {
          text: "What does CPU stand for?",
          options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor Utility"],
          correct: 1,
          points: 50,
          timer: 30,
          difficulty: "Easy"
        }
      ]
    }
  },
  {
    id: "maths",
    title: "Mega Maths Quiz",
    description: "Solve tricky math problems and puzzles.",
    price: 90,
    icon: "➗",
    quiz: {
      title: "Mega Maths Quiz",
      questions: [
        {
          text: "What is the value of π (pi) up to two decimal places?",
          options: ["3.12", "3.14", "3.16", "3.18"],
          correct: 1,
          points: 50,
          timer: 30,
          difficulty: "Easy"
        },
        {
          text: "What is 12 x 12?",
          options: ["124", "144", "132", "142"],
          correct: 1,
          points: 50,
          timer: 30,
          difficulty: "Easy"
        }
      ]
    }
  }
];

function Dashboard() {
  const location = useLocation();
  const role = location.state?.role || "teacher";
  // Use name and emailId from navigation state if available, fallback to defaults
  const name = location.state?.name;
  const emailId = location.state?.emailId || "";
  const teacherId = location.state?.teacherId || ""; // <-- Add this line if not present
  const username = name;
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizList, setQuizList] = useState(quizzes);
  const [quizStep, setQuizStep] = useState(1);
  const [quizDraft, setQuizDraft] = useState(null);
  const [showQuizAttempt, setShowQuizAttempt] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentQuizList, setStudentQuizList] = useState(studentQuizzes);
  // Track purchased mega quizzes by id
  const [purchasedMegaQuizIds, setPurchasedMegaQuizIds] = useState([]);
  // Track which mega quiz to attempt
  const [megaQuizToAttempt, setMegaQuizToAttempt] = useState(null);
  // Track coins spent on mega quizzes
  const [coinsSpent, setCoinsSpent] = useState(0);
  // Track completed mega quizzes
  const [completedMegaQuizIds, setCompletedMegaQuizIds] = useState([]);
  // Track recent quizzes (for student, includes assigned + completed mega)
  const [recentStudentQuizzes, setRecentStudentQuizzes] = useState([...studentQuizzes]);
  const [eventsList, setEventsList] = useState([
    { title: "Mid-term Quiz", time: "Today, 2:30 PM", participants: 32, primary: true },
    { title: "Weekly Test", time: "Tomorrow, 10:00 AM", participants: 28, primary: false },
    { title: "Final Exam", time: "May 20, 9:00 AM", participants: 45, primary: false },
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', participants: '', primary: false });
  // Add state for top students
  const [topStudents, setTopStudents] = useState([]);

  // Fetch events from API on mount (for teacher)
  useEffect(() => {
    if (role === "teacher" && emailId && teacherId) {
      fetch(`${API_ENDPOINTS.EVENTS}?teacherEmail=${encodeURIComponent(emailId)}}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setEventsList(data);
        })
        .catch(() => { /* fallback to local if error */ });
    }
  }, [role, emailId, teacherId]);

  // Fetch top students from API on mount (for teacher)
  useEffect(() => {
    if (role === "teacher") {
      fetch(API_ENDPOINTS.TOP_STUDENTS)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTopStudents(data);
        })
        .catch(() => {
          // fallback to empty or static if error
          setTopStudents([]);
        });
    }
  }, [role]);

  // Fetch quizzes from API for teacher on mount and after publishing
  const fetchQuizzes = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.QUIZZES);
      const data = await res.json();
      if (Array.isArray(data)) setQuizList(data);
    } catch {
      // fallback: do nothing or keep local quizzes
    }
  };

  useEffect(() => {
    if (role === "teacher") {
      fetchQuizzes();
    }
  }, [role]);

  // Update event input handler for new fields
  const handleEventInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Update event creation to use API and include teacher info
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time || !newEvent.participants) return;
    const eventToAdd = {
      title: newEvent.title,
      time: newEvent.time,
      participants: Number(newEvent.participants),
      primary: newEvent.primary,
      teacherEmail: emailId,
      teacherId: teacherId
    };
    try {
      const res = await fetch(API_ENDPOINTS.EVENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventToAdd)
      });
      if (res.ok) {
        const created = await res.json();
        setEventsList(prev => [...prev, created]);
      } else {
        setEventsList(prev => [...prev, eventToAdd]);
      }
    } catch {
      setEventsList(prev => [...prev, eventToAdd]);
    }
    setNewEvent({ title: '', time: '', participants: '', primary: false });
  };

  // Calculate total coins for student (subtract spent coins)
  const totalCoins = studentQuizList.reduce((sum, q) => sum + (q.coins || 0), 0) - coinsSpent;

  // Logout handler (replace with real logic as needed)
  const handleLogout = () => {
    // For demo: just reload or redirect to login
    window.location.href = "/";
  };

  // Handler to add a new quiz after publishing
  const handleQuizPublished = async (newQuiz) => {
    console.log('Published Quiz:', newQuiz);
    // Send full quiz (including questions/answers) to backend
    try {
      const apiUrl = API_ENDPOINTS.QUIZZES; // Use API endpoint from config
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      });
    } catch (err) {
      // Optionally handle error (show message, etc.)
    }

    // Transform for dashboard display
    const dashboardQuiz = {
      title: newQuiz.title,
      questions: Array.isArray(newQuiz.questions) ? newQuiz.questions.length : 0,
      completions: 0,
      completionRate: 0,
      // add other fields if needed
    };
    setQuizList([...quizList, dashboardQuiz]);
    // After publishing, refresh quiz list from API
    await fetchQuizzes();
    setShowCreateQuiz(false);
    setQuizStep(1);
    setQuizDraft(null);
  };

  // Handler for moving to questions step
  const handleNextToQuestions = (quizData) => {
    setQuizDraft(quizData);
    setQuizStep(2);
  };

  // Handler for going back to details step
  const handlePrevToDetails = () => {
    setQuizStep(1);
  };

  const handleQuizAttemptComplete = (score, completed) => {
    setStudentQuizList((prev) =>
      prev.map((q) =>
        q.title === selectedQuiz.title
          ? {
              ...q,
              completed: completed,
              coins: score,
              timer: selectedQuiz.questions && selectedQuiz.questions[0]?.timer,
              questions: selectedQuiz.questions ? selectedQuiz.questions.length : 1,
            }
          : q
      )
    );
    setShowQuizAttempt(false);
    setSelectedQuiz(null);
  };

  // Buy logic for Mega Quiz
  const handleBuyMegaQuiz = (quizId, price) => {
    if (totalCoins < price) {
      alert("Not enough coins to buy this quiz!");
      return;
    }
    if (purchasedMegaQuizIds.includes(quizId)) {
      alert("You have already purchased this quiz.");
      return;
    }
    setPurchasedMegaQuizIds(ids => [...ids, quizId]);
    setCoinsSpent(prev => prev + price);
    alert("Mega Quiz purchased! You can now attempt it.");
  };

  // When a Mega Quiz is completed, add it to recent quizzes and mark as completed
  const handleMegaQuizComplete = (score, completed) => {
    if (megaQuizToAttempt) {
      const megaQuizObj = megaQuizzes.find(q => q.quiz === megaQuizToAttempt);
      if (megaQuizObj) {
        setCompletedMegaQuizIds(ids => [...ids, megaQuizObj.id]);
        setRecentStudentQuizzes(prev => {
          // If already present, update as completed; else add
          const exists = prev.find(q => q.title === megaQuizObj.quiz.title);
          if (exists) {
            return prev.map(q =>
              q.title === megaQuizObj.quiz.title
                ? { ...q, completed: true, coins: score, questions: megaQuizObj.quiz.questions.length }
                : q
            );
          }
          return [
            ...prev,
            {
              title: megaQuizObj.quiz.title,
              assignedBy: "Mega Quiz",
              coins: score,
              completed: true,
              timer: megaQuizObj.quiz.questions[0]?.timer,
              questions: megaQuizObj.quiz.questions.length
            }
          ];
        });
      }
    }
    setMegaQuizToAttempt(null);
  };

  // Header component for both roles
  const DashboardHeaderBar = () => (
    <header className="dashboard-topbar" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: 64,
      background: "#23232b",
      borderBottom: "1px solid #2d2d36"
    }}>
      <div style={{ fontWeight: 700, fontSize: 24, color: "#a855f7", letterSpacing: 1 }}>
        Quizzy
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 500,
          color: "#fff",
          fontSize: 16
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#a855f7",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18
          }}>
            <svg width="20" height="20" fill="currentColor" style={{ marginRight: 0 }}>
              <circle cx="10" cy="7" r="4" />
              <ellipse cx="10" cy="15" rx="6" ry="4" />
            </svg>
          </span>
          {username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "#f87171",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );

  if (role === "student") {
    // Student view
    return (
      <div className="dashboard-root">
        <div className="dashboard-shell">
          <DashboardHeaderBar />
          <main className="dashboard-layout">
            <section className="dashboard-main">
              <header className="dashboard-header">
                <h1>Welcome, {username}</h1>
                <p>Here are your assigned quizzes and progress.</p>
                <div style={{
                  marginTop: 12,
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#FFD700",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span role="img" aria-label="coin">🪙</span> Total Coins: {totalCoins}
                </div>
              </header>

              {/* Mega Quizzes Widget - Multiple Cards */}
              <section className="panel" style={{ marginBottom: 24, background: "#2d1a2d", color: "#fff" }}>
                <header className="panel-header">
                  <h2>Mega Quizzes</h2>
                  <p className="panel-subtitle">Unlock premium quizzes using your coins!</p>
                </header>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: 16 }}>
                  {megaQuizzes.map((mq) => (
                    <div key={mq.id} style={{
                      background: "#23232b",
                      borderRadius: 12,
                      width: 260,
                      minHeight: 210,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 20,
                      boxShadow: "0 2px 12px #0003",
                      marginBottom: 12
                    }}>
                      <div style={{ fontSize: 44, marginBottom: 8 }}>{mq.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mq.title}</div>
                      <div style={{ fontSize: 14, color: "#e0e0e0", marginBottom: 10, textAlign: "center" }}>{mq.description}</div>
                      <div style={{ fontWeight: 600, color: "#FFD700", marginBottom: 10 }}>
                        {mq.price} <span role="img" aria-label="coin">🪙</span>
                      </div>
                      {purchasedMegaQuizIds.includes(mq.id) ? (
                        completedMegaQuizIds.includes(mq.id) ? (
                          <span style={{
                            background: "#22c55e",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "8px 24px",
                            fontWeight: 700,
                            fontSize: 15
                          }}>Completed</span>
                        ) : (
                          <button
                            style={{
                              background: "#a855f7",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 24px",
                              fontWeight: 700,
                              fontSize: 15,
                              cursor: "pointer"
                            }}
                            onClick={() => setMegaQuizToAttempt(mq.quiz)}
                          >
                            Attempt Quiz
                          </button>
                        )
                      ) : (
                        <button
                          style={{
                            background: totalCoins >= mq.price ? "#FFD700" : "#888",
                            color: "#23232b",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 24px",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: totalCoins >= mq.price ? "pointer" : "not-allowed"
                          }}
                          disabled={totalCoins < mq.price}
                          onClick={() => handleBuyMegaQuiz(mq.id, mq.price)}
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Quizzes (assigned + completed mega quizzes) */}
              <section className="panel">
                <header className="panel-header">
                  <h2>Your Assigned Quizzes</h2>
                </header>
                <div className="quiz-grid">
                  {recentStudentQuizzes.length === 0 ? (
                    <p>No quizzes assigned yet.</p>
                  ) : (
                    recentStudentQuizzes.map((quiz, idx) => (
                      <article key={idx} className="quiz-card">
                        <div className="quiz-header">
                          <h3>{quiz.title}</h3>
                          <span className="quiz-arrow">›</span>
                        </div>
                        <p className="quiz-meta">
                          Assigned by: {quiz.assignedBy}
                        </p>
                        <div className="progress-row">
                          <span>
                            Coins: <span style={{ color: "#FFD700", fontWeight: 600 }}>
                              <span role="img" aria-label="coin">🪙</span> {quiz.coins}
                            </span>
                          </span>
                          <span>
                            {quiz.completed ? (
                              <span style={{ color: "green" }}>Completed</span>
                            ) : (
                              <button
                                className="btn-primary"
                                style={{
                                  background: "#a855f7",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "6px 18px",
                                  cursor: "pointer"
                                }}
                                onClick={() => {
                                  setSelectedQuiz(quiz);
                                  setShowQuizAttempt(true);
                                }}
                                type="button"
                              >
                                Attempt Quiz
                              </button>
                            )}
                          </span>
                        </div>
                        <div className="progress-row">
                          <span>Time: {quiz.timer ? `${quiz.timer}s` : "--"}</span>
                          <span>Questions: {quiz.questions || (quiz.questions === 0 ? 0 : "--")}</span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </section>
            <aside className="dashboard-sidebar">
              <section className="panel">
                <header className="panel-header">
                  <h2>Top 10 Students This Week</h2>
                  <p className="panel-subtitle">
                    Based on coins earned
                  </p>
                </header>
                <ol className="student-list">
                  {topStudentsWeek.map((student, index) => (
                    <li key={student.name} className="student-item">
                      <span className="student-rank">{index + 1}</span>
                      <div className="student-info">
                        <p className="student-name">{student.name}</p>
                      </div>
                      <span className="student-score" style={{ color: "#FFD700" }}>
                        <span role="img" aria-label="coin">🪙</span> {student.coins}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
            {/* Render AttemptQuiz modal at the end of the student dashboard */}
            {showQuizAttempt && selectedQuiz && (
              <AttemptQuiz
                quiz={selectedQuiz}
                onClose={() => {
                  setShowQuizAttempt(false);
                  setSelectedQuiz(null);
                }}
                onComplete={handleQuizAttemptComplete}
              />
            )}
            {/* Render AttemptQuiz modal for Mega Quiz */}
            {megaQuizToAttempt && (
              <AttemptQuiz
                quiz={megaQuizToAttempt}
                onClose={() => setMegaQuizToAttempt(null)}
                onComplete={handleMegaQuizComplete}
              />
            )}
          </main>
        </div>
      </div>
    );
  }
  // Teacher view
  return (
    <div className="dashboard-root">
      <div className="dashboard-shell">
        <DashboardHeaderBar />
        <main className="dashboard-layout">
          <section className="dashboard-main">
            <header className="dashboard-header">
              <h1>Welcome, {username}</h1>
              <p>Here's what's happening with your quizzes.</p>
              {/* No coins or Mega Quiz widget for teacher */}
            </header>

            {/* Quiz creation flow */}
            {showCreateQuiz ? (
              quizStep === 1 ? (
                <CreateQuiz
                  onNext={handleNextToQuestions}
                  onCancel={() => { setShowCreateQuiz(false); setQuizStep(1); setQuizDraft(null); }}
                />
              ) : (
                <CreateQuizQuestions
                  quiz={quizDraft}
                  onPrev={handlePrevToDetails}
                  onPublish={handleQuizPublished}
                />
              )
            ) : (
              <>
                <section className="stats-grid">
                  {statCards.map((card) => (
                    <article key={card.label} className="stat-card">
                      <p className="stat-label">{card.label}</p>
                      <h2 className="stat-value">{card.value}</h2>
                      <p
                        className={`stat-change ${
                          card.trend === "up" ? "up" : "down"
                        }`}
                      >
                        {card.change}
                      </p>
                    </article>
                  ))}
                </section>

                <section className="panel">
                  <header className="panel-header">
                    <h2>Recent Events</h2>
                  </header>
                  <div className="events-list">
                    {eventsList.map((event) => (
                      <article key={event.title} className="event-card">
                        <div className="event-info">
                          <h3>{event.title}</h3>
                          <p>
                            {event.time}
                            {" • "}
                            {event.participants} participants
                          </p>
                        </div>
                        {event.primary ? (
                          <button className="btn btn-accent">View Live</button>
                        ) : (
                          <button className="btn btn-outline">Manage</button>
                        )}
                      </article>
                    ))}
                  </div>
                  {/* Event creation form for teacher */}
                  {role === "teacher" && (
                    <form onSubmit={handleCreateEvent} style={{ marginTop: 16 }}>
                      <input
                        name="title"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={handleEventInputChange}
                        required
                        style={{ marginRight: 8 }}
                      />
                      <input
                        name="time"
                        placeholder="Time (e.g. Today, 2:30 PM)"
                        value={newEvent.time}
                        onChange={handleEventInputChange}
                        required
                        style={{ marginRight: 8 }}
                      />
                      <input
                        name="participants"
                        type="number"
                        min="1"
                        placeholder="Participants"
                        value={newEvent.participants}
                        onChange={handleEventInputChange}
                        required
                        style={{ marginRight: 8, width: 110 }}
                      />
                      <label style={{ marginRight: 8 }}>
                        <input
                          type="checkbox"
                          name="primary"
                          checked={newEvent.primary}
                          onChange={handleEventInputChange}
                        /> Primary
                      </label>
                      <button type="submit" className="btn btn-primary">Add Event</button>
                    </form>
                  )}
                </section>

                <section className="panel">
                  <header className="panel-header">
                    <h2>Recent Quizzes</h2>
                  </header>
                  <div className="quiz-grid">
                    {quizList.map((quiz, idx) => (
                      <article key={idx} className="quiz-card">
                        <div className="quiz-header">
                          <h3>{quiz.title}</h3>
                          <span className="quiz-arrow">›</span>
                        </div>
                        <p className="quiz-meta">
                          {quiz.questions} questions • {quiz.completions} completions
                        </p>
                        <div className="progress-row">
                          <span>Completion Rate</span>
                          <span>{quiz.completionRate}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${quiz.completionRate}%` }}
                          />
                        </div>
                      </article>
                    ))}

                    <article className="quiz-card quiz-create">
                      <button className="btn-circle" onClick={() => { setShowCreateQuiz(true); setQuizStep(1); }}>+</button>
                      <p>Create New Quiz</p>
                    </article>
                  </div>
                </section>
              </>
            )}
          </section>

          {/* Show sidebar only when not creating a quiz */}
          {!showCreateQuiz && (
            <aside className="dashboard-sidebar">
              <section className="panel">
                <header className="panel-header">
                  <h2>Top Students</h2>
                  <p className="panel-subtitle">
                    Students with highest quiz scores
                  </p>
                </header>
                <ol className="student-list">
                  {topStudents.map((student, index) => (
                    <li key={student.name} className="student-item">
                      <span className="student-rank">{index + 1}</span>
                      <div className="student-info">
                        <p className="student-name">{student.name}</p>
                        <p className="student-subject">{student.subject}</p>
                      </div>
                      <span className="student-score">{student.score}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          )}
        </main>

        {/* Render quiz attempt screen as a modal/overlay */}
        {showQuizAttempt && selectedQuiz && (
          <AttemptQuiz
            quiz={selectedQuiz}
            onClose={() => {
              setShowQuizAttempt(false);
              setSelectedQuiz(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
