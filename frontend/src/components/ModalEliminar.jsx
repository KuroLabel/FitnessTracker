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
        <h3 style={{ marginTop: 0, color: '#c00' }}>Confirmar Eliminación</h3>
        <p>¿Estás seguro de eliminar el registro de <strong>{workout.exercise_name}</strong>?</p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Fecha: {workout.date} | Series: {workout.sets} | Reps: {workout.reps} | Peso: {workout.weight_kg} kg
        </p>
        <div className="modal-footer">
          <button type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="button" onClick={handleConfirm} disabled={loading} style={{ color: '#c00' }}>
            {loading ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
