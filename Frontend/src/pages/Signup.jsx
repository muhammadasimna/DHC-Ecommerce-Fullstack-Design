import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px', backgroundColor: 'var(--gray-100)' }}>
      <div style={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--gray-300)',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/assets/Layout/Brand/logo-colored.png" alt="Logo" style={{ height: '40px', marginBottom: '15px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--dark-color)' }}>Create an account</h2>
          <p style={{ color: 'var(--secondary-color)', fontSize: '14px', marginTop: '5px' }}>Get started with us today!</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFF2F2',
            border: '1px solid var(--red)',
            borderRadius: '6px',
            color: 'var(--red)',
            padding: '12px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 15px',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--secondary-color)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 15px',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--secondary-color)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                <i className={showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: 'var(--secondary-color)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" className="btn btn-white" style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
