import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-centered">
      <div className="auth-card-wrapper">
        <div className="auth-form-container">
          <div className="auth-header-centered">
            <Link to="/" className="auth-brand-logo">
              <Zap size={24} />
              <span>VYNORA CONNECT</span>
            </Link>
          </div>

          {!submitted ? (
            <>
              <div className="auth-form-header">
                <h2>Reset your password</h2>
                <p>Enter the email address associated with your student account.</p>
              </div>

              {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="reset-email" className="form-label">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <>
                      <Mail size={16} />
                      <span>Send Recovery Link</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-state">
              <div className="success-icon-badge">
                <CheckCircle2 size={36} />
              </div>
              <h3>Check your inbox</h3>
              <p>
                If an account exists for <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>, we have sent instructions to reset your password.
              </p>
            </div>
          )}

          <div className="auth-form-footer">
            <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
