import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', marginBottom: '1rem' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>cargando FitTrack</p>
      </div>
    );
  }

  
  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}
