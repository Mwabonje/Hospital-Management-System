import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, AlertCircle } from 'lucide-react';
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

    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

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

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setVerifying(true);

        try {
            const { error: verifyError } = await insforge.auth.verifyEmail({
                email: formData.email,
                otp: otp
            });

            if (verifyError) {
                setError(verifyError.message);
                return;
            }

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        try {
            const { error: resendError } = await insforge.auth.resendVerificationEmail({
                email: formData.email
            });
            if (resendError) {
                setError(resendError.message);
            } else {
                // Show a brief success message or notification
                alert("Verification code resent!");
            }
        } catch (err: any) {
            setError(err.message);
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
                        <h2>{success ? 'Verify Email' : 'Create Account'}</h2>
                        <p>{success ? 'Enter the code sent to your email' : 'Enter your details to register as a healthcare professional'}</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 rounded bg-red-50 text-red-600 text-sm border border-red-100">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {success ? (
                        <div className="verification-form flex col gap-6">
                            <div className="flex justify-center mb-2 text-primary">
                                <Mail size={48} />
                            </div>
                            <p className="text-center text-sm text-muted">
                                We've sent a 6-digit verification code to <br />
                                <strong>{formData.email}</strong>
                            </p>

                            <form onSubmit={handleVerifyEmail} className="flex col gap-4">
                                <div className="input-group">
                                    <label>Verification Code</label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        pattern="\d{6}"
                                        inputMode="numeric"
                                        className="styled-input text-center text-2xl tracking-widest"
                                        value={otp}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setOtp(val);
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="primary-btn w-full flex items-center justify-center gap-2"
                                    disabled={verifying}
                                >
                                    {verifying ? 'Verifying...' : 'Verify & Continue'}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="text-xs text-muted mb-2">Didn't receive the code?</p>
                                <button
                                    onClick={handleResendOtp}
                                    className="text-primary text-sm font-bold hover:underline"
                                >
                                    Resend Verification Code
                                </button>
                            </div>

                            <button
                                onClick={() => setSuccess(false)}
                                className="text-muted text-sm hover:underline"
                            >
                                ← Back to Sign Up
                            </button>
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
