import React, { useState } from 'react';

export default function ModalEliminar({ isOpen, onClose, onConfirm, workout }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !workout) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(workout.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, color: '#dc2626' }}>⚠️ Confirmar Eliminación</h3>
        <p style={{ marginBottom: '8px' }}>
          ¿Estás seguro de que deseas eliminar el registro de <strong>{workout.exercise_name}</strong>?
        </p>
        <div style={{
          backgroundColor: '#0f130f',
          border: '1px solid #2e3d2e',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#86efac',
          marginBottom: '10px'
        }}>
          <strong>Detalle:</strong> {workout.date} | {workout.sets} series x {workout.reps} reps | {workout.weight_kg} kg
        </div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
          Esta acción no se puede deshacer y borrará el dato en la base de datos SQLite.
        </p>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
