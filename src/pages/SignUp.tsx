import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck } from 'lucide-react';

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="login-visual">
                <div className="visual-content">
                    <h1>Join HMS</h1>
                    <p>The standard in healthcare management. Secure, efficient, and patient-focused.</p>
                </div>
            </div>
            <div className="login-form-side">
                <div className="form-card premium-card">
                    <div className="form-header">
                        <h2>Create Account</h2>
                        <p>Enter your details to register as a healthcare professional</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex col gap-4">
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} />
                                <input type="text" placeholder="Dr. John Doe" required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} />
                                <input type="email" placeholder="john.doe@hospital.com" required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>System Role</label>
                            <div className="input-with-icon">
                                <UserCheck size={18} />
                                <select required className="styled-select">
                                    <option value="">Select Role</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input type="password" placeholder="••••••••" required />
                            </div>
                        </div>

                        <button type="submit" className="primary-btn w-full flex items-center justify-center gap-4">
                            Get Started
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>


        </div>
    );
};

export default SignUp;
