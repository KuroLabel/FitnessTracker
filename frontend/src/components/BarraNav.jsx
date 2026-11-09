import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function BarraNav() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>FitTrack</h3>
        <div>
          <span style={{ marginRight: '15px' }}>
            Usuario: <strong>{user?.username}</strong>
          </span>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}
