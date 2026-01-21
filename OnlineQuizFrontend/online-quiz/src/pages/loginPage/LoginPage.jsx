import React, { useState } from "react";
import AuthModal from "../../components/AuthModal/AuthModal";
import "./LoginPage.css";
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apiConfig';


function LoginPage({ onSignupClick, onNavigate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.email && form.password && form.role;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    // Use API endpoint from config
    const apiUrl = API_ENDPOINTS.LOGIN;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) // form includes role (student/teacher)
      });
      if (response.ok) {
        // Pass name, emailId, and role to dashboard via navigation state
        navigate('/dashboard', { 
          state: { 
            name: 'Komal', // You can update this if you fetch/display the user's name after login
            emailId: form.email,
            role: form.role 
          } 
        });
      } else {
        setError('Invalid credentials or role. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <AuthModal title="Sign in" onNavigate={onNavigate}>
      <div className="card">
        <h2 className="card-title-ug">Welcome back</h2>
        <p className="subtitle">
          Enter your credentials to access your account
        </p>
        <form className="auth-form-modal" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            className={`btn-primary full-width modal-continue-btn${!isFormValid ? ' btn-disabled' : ''}`}
            disabled={!isFormValid}
          >
            Sign In
          </button>
          <a href="#" className="forgot-link">
            Can't sign in?
          </a>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </AuthModal>
  );
}

export default LoginPage;
