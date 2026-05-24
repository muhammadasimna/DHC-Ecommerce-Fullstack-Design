import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: 'var(--primary-color)', marginBottom: '15px' }}></i>
        <p style={{ color: 'var(--secondary-color)' }}>Loading account context...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store current location to redirect back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
