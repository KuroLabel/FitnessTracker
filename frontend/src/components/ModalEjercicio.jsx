import React, { useState, useEffect } from 'react';

const MUSCLE_GROUPS = [
  { value: 'PECHO', label: 'Pecho' },
  { value: 'ESPALDA', label: 'Espalda' },
  { value: 'PIERNAS', label: 'Piernas' },
  { value: 'HOMBROS', label: 'Hombros' },
  { value: 'BRAZOS', label: 'Brazos' },
  { value: 'CORE', label: 'Core / Abdominales' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'OTRO', label: 'Otro' },
];

export default function ModalEjercicio({ isOpen, onClose, onSave, workoutToEdit }) {
  const isEditing = Boolean(workoutToEdit);
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    exercise_name: '',
    muscle_group: 'PECHO',
    date: getTodayString(),
    sets: 4,
    reps: 10,
    weight_kg: 20.0,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (workoutToEdit) {
      setFormData({
        exercise_name: workoutToEdit.exercise_name || '',
        muscle_group: workoutToEdit.muscle_group || 'PECHO',
        date: workoutToEdit.date || getTodayString(),
        sets: workoutToEdit.sets ?? 4,
        reps: workoutToEdit.reps ?? 10,
        weight_kg: workoutToEdit.weight_kg ?? 0,
        notes: workoutToEdit.notes || '',
      });
    } else {
      setFormData({
        exercise_name: '',
        muscle_group: 'PECHO',
        date: getTodayString(),
        sets: 4,
        reps: 10,
        weight_kg: 20.0,
        notes: '',
      });
    }
    setErrorMessage('');
  }, [workoutToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        sets: parseInt(formData.sets, 10),
        reps: parseInt(formData.reps, 10),
        weight_kg: parseFloat(formData.weight_kg),
      };
      await onSave(payload, workoutToEdit?.id);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>
          {isEditing ? '✏️ Editar Ejercicio' : '➕ Nuevo Ejercicio'}
        </h3>

        {errorMessage && (
          <div className="error-box">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Nombre del Ejercicio</label>
          <input
            name="exercise_name"
            type="text"
            placeholder="Ej. Press de Banca Plano"
            value={formData.exercise_name}
            onChange={handleChange}
            required
          />

          <label>Grupo Muscular</label>
          <select
            name="muscle_group"
            value={formData.muscle_group}
            onChange={handleChange}
          >
            {MUSCLE_GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          <label>Fecha</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <label>Series</label>
              <input
                name="sets"
                type="number"
                min="1"
                max="50"
                value={formData.sets}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Reps</label>
              <input
                name="reps"
                type="number"
                min="1"
                max="200"
                value={formData.reps}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Peso (kg)</label>
              <input
                name="weight_kg"
                type="number"
                step="0.5"
                min="0"
                max="500"
                value={formData.weight_kg}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Notas / Sensaciones (opcional)</label>
          <input
            name="notes"
            type="text"
            placeholder="RPE, descansos, etc."
            value={formData.notes}
            onChange={handleChange}
          />

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Registro')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
