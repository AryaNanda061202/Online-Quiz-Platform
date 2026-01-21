import React, { useState } from 'react';
import AuthModal from '../../components/AuthModal/AuthModal';
import './SignUpPage.css';
import API_ENDPOINTS from '../../config/apiConfig';

function SignupPage({ onLoginClick, onNavigate }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'student' // default role
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(form).every(val => val && val.trim() !== '');

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    console.log('Submitting form:', form);
    // Use API endpoint from config
    const apiUrl = API_ENDPOINTS.SIGNUP;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setMessage('Thank you for registering!');
        setError('');
      } else {
        const data = await response.json();
        if (data && data.error && data.error.toLowerCase().includes('already')) {
          setError('Account already exists. Please sign in.');
        } else {
          setError('Registration failed. Please try again.');
        }
        setMessage('');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setMessage('');
    }
  };

  // The Signup page will use the AuthModal wrapper for centering
  return (
    <AuthModal 
        title="Create Account"
        onNavigate={onNavigate}
    >    
            <div className="card">
          <h2 className="card-title-bg">Create Account</h2>
          <p className="subtitle">Choose your account type and start your journey with us</p>    
          <div className="account-types">
            <button
              type="button"
              className={`type student${form.role === 'student' ? ' active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              <div className="icon">🎓</div>
              <div className="label">Student</div>
              <div className="meta">Take quizzes and track your progress</div>
            </button>

            <button
              type="button"
              className={`type teacher${form.role === 'teacher' ? ' active' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
            >
              <div className="icon">👩‍🏫</div>
              <div className="label">Teacher</div>
              <div className="meta">Create quizzes and manage students</div>
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="row">
              <input
                name="firstname"
                placeholder="First Name"
                value={form.firstname}
                onChange={handleChange}
              />
              <input
                name="lastname"
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
              />
            </div>

            <input
              className="wide"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="wide"
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              className={`btn-primary-signup${!isFormValid ? ' btn-disabled' : ''}`}
              disabled={!isFormValid}
            >
              Sign Up
            </button>
          </form>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
    </AuthModal>
  );
}

export default SignupPage;