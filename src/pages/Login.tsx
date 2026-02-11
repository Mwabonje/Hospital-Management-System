import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-content">
          <h1>HMS Premium</h1>
          <p>Advanced Hospital Management Solutions for Modern Healthcare.</p>
        </div>
      </div>
      <div className="login-form-side">
        <div className="form-card premium-card">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to login</p>
          </div>

          <form onSubmit={handleSubmit} className="flex col gap-4">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input type="email" placeholder="doctor@hospital.com" required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <label className="flex items-center gap-2 checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="primary-btn w-full flex items-center justify-center gap-4">
              <LogIn size={20} /> Login
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>


    </div>
  );
};

export default Login;
