import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function BarraNav() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="nav-brand">
          <span>⚡ FitTrack</span>
        </div>
        <div className="nav-user">
          <span>Usuario: <strong className="nav-user-badge">{user?.username}</strong></span>
          <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
        </div>
      </div>
    </header>
  );
}
