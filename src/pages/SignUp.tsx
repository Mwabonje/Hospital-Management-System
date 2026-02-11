import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { insforge } from '../utils/insforge';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data, error: signUpError } = await insforge.auth.signUp({
                email: formData.email,
                password: formData.password,
                name: formData.fullName
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            // Set role in profile
            if (data?.user) {
                await insforge.auth.setProfile({
                    role: formData.role
                });
            }

            if (data?.requireEmailVerification) {
                setSuccess(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 rounded bg-red-50 text-red-600 text-sm border border-red-100">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="flex justify-center mb-4 text-green-500">
                                <CheckCircle size={64} />
                            </div>
                            <h3>Verify Your Email</h3>
                            <p className="text-muted mt-2">We've sent a verification code to <strong>{formData.email}</strong>. Please check your inbox.</p>
                            <button onClick={() => navigate('/login')} className="primary-btn w-full mt-6">Go to Login</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex col gap-4">
                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-with-icon">
                                    <User size={18} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Dr. John Doe"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john.doe@hospital.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>System Role</label>
                                <div className="input-with-icon">
                                    <UserCheck size={18} />
                                    <select
                                        name="role"
                                        required
                                        className="styled-select"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
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
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Confirm Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn w-full flex items-center justify-center gap-4"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Get Started'}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <p className="auth-footer">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    )}
                </div>
            </div>


        </div>
    );
};

export default SignUp;
