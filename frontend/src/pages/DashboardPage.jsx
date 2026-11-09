import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import BarraNav from '../components/BarraNav';
import ModalEjercicio from '../components/ModalEjercicio';
import ModalEliminar from '../components/ModalEliminar';

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [workoutToEdit, setWorkoutToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('ALL');

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err.message || 'Error al obtener los entrenamientos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleSaveWorkout = async (payload, id) => {
    if (id) {
      const updated = await api.updateWorkout(id, payload);
      setWorkouts((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      showNotification(`Ejercicio "${updated.exercise_name}" actualizado.`);
    } else {
      const created = await api.createWorkout(payload);
      setWorkouts((prev) => [created, ...prev]);
      showNotification(`Nuevo ejercicio "${created.exercise_name}" agregado.`);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await api.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((item) => item.id !== id));
      showNotification('Registro eliminado correctamente.');
    } catch (err) {
      setError(err.message || 'Error al eliminar el registro.');
    }
  };

  const handleOpenCreateModal = () => {
    setWorkoutToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (workout) => {
    setWorkoutToEdit(workout);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (workout) => {
    setWorkoutToDelete(workout);
    setIsDeleteModalOpen(true);
  };

  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.exercise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMuscle = filterMuscle === 'ALL' || w.muscle_group === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div>
      <BarraNav />

      <div className="container">
        <h2>Progreso Diario de Entrenamientos</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
        </p>

        {successMsg && (
          <div className="success-box">{successMsg}</div>
        )}

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
            <button onClick={fetchWorkouts} style={{ marginLeft: '10px' }}>Reintentar</button>
          </div>
        )}


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
          <div>
            <button onClick={handleOpenCreateModal} style={{ fontWeight: 'bold' }}>
              + Nuevo Ejercicio
            </button>
            <button onClick={fetchWorkouts} style={{ marginLeft: '8px' }}>
              Refrescar
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '180px', margin: 0 }}
            />
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
              style={{ width: '150px', margin: 0 }}
            >
              <option value="ALL">Todos los grupos</option>
              <option value="PECHO">Pecho</option>
              <option value="ESPALDA">Espalda</option>
              <option value="PIERNAS">Piernas</option>
              <option value="HOMBROS">Hombros</option>
              <option value="BRAZOS">Brazos</option>
              <option value="CORE">Core</option>
              <option value="CARDIO">Cardio</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>


        {loading && (
          <p style={{ fontStyle: 'italic', color: '#666' }}>Cargando datos desde la API...</p>
        )}


        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ejercicio</th>
                <th>Grupo</th>
                <th>Series</th>
                <th>Reps</th>
                <th>Peso (kg)</th>
                <th>Notas</th>
                <th style={{ width: '140px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888', padding: '15px' }}>
                    No hay registros de entrenamiento.
                  </td>
                </tr>
              ) : (
                filteredWorkouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.date}</td>
                    <td><strong>{workout.exercise_name}</strong></td>
                    <td>{workout.muscle_group}</td>
                    <td>{workout.sets}</td>
                    <td>{workout.reps}</td>
                    <td>{parseFloat(workout.weight_kg) > 0 ? `${workout.weight_kg} kg` : 'Corporal'}</td>
                    <td style={{ fontSize: '0.85rem', color: '#555' }}>{workout.notes || '-'}</td>
                    <td>
                      <button onClick={() => handleOpenEditModal(workout)} style={{ marginRight: '5px' }}>
                        Editar
                      </button>
                      <button onClick={() => handleOpenDeleteModal(workout)} style={{ color: '#c00' }}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <ModalEjercicio
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveWorkout}
        workoutToEdit={workoutToEdit}
      />

      <ModalEliminar
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteWorkout}
        workout={workoutToDelete}
      />
    </div>
  );
}
