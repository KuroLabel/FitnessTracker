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
        <div className="page-header" style={{ marginBottom: '18px' }}>
          <h2>Progreso Diario de Entrenamientos</h2>
          <p>Gestión de ejercicios puro enfasis 6.5</p>
        </div>

        {successMsg && (
          <div className="success-box">{successMsg}</div>
        )}

        {error && (
          <div className="error-box">
            <span><strong>Error:</strong> {error}</span>
            <button className="btn-secondary" onClick={fetchWorkouts} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              Reintentar
            </button>
          </div>
        )}


        <div className="toolbar">
          <div className="toolbar-group">
            <button className="btn-primary" onClick={handleOpenCreateModal}>
              + Nuevo Ejercicio
            </button>
            <button className="btn-secondary" onClick={fetchWorkouts}>
              Refrescar
            </button>
          </div>

          <div className="toolbar-group">
            <input
              type="text"
              placeholder="Buscar ejercicio o nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '200px' }}
            />
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
              style={{ width: '160px' }}
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
          <p style={{ fontStyle: 'italic', color: '#64748b', padding: '20px 0', textAlign: 'center' }}>
            Cargando datos desde la API REST...
          </p>
        )}


        {!loading && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ejercicio</th>
                  <th>Grupo</th>
                  <th>Series</th>
                  <th>Reps</th>
                  <th>Peso</th>
                  <th>Notas</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No se encontraron registros de entrenamiento.
                    </td>
                  </tr>
                ) : (
                  filteredWorkouts.map((workout) => (
                    <tr key={workout.id}>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{workout.date}</td>
                      <td><strong>{workout.exercise_name}</strong></td>
                      <td>
                        <span className={`badge badge-${(workout.muscle_group || 'otro').toLowerCase()}`}>
                          {workout.muscle_group}
                        </span>
                      </td>
                      <td>{workout.sets}</td>
                      <td>{workout.reps}</td>
                      <td>
                        <strong>{parseFloat(workout.weight_kg) > 0 ? `${workout.weight_kg} kg` : 'Corporal'}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{workout.notes || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="action-btn action-edit"
                          onClick={() => handleOpenEditModal(workout)}
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn action-delete"
                          onClick={() => handleOpenDeleteModal(workout)}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
