import React from 'react';
import { Calendar, Edit2, Trash2, Hash, Repeat, Weight, FileText } from 'lucide-react';

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  const muscleBadgeClass = `badge badge-${workout.muscle_group.toLowerCase()}`;
  const totalVolume = (workout.sets * workout.reps * parseFloat(workout.weight_kg || 0)).toFixed(1);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span className={muscleBadgeClass}>{workout.muscle_group}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>{workout.date}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          {workout.exercise_name}
        </h3>


        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: '#f8fafc',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '0.85rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>SERIES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{workout.sets}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>REPS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{workout.reps}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>PESO</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
              {parseFloat(workout.weight_kg) > 0 ? `${workout.weight_kg} kg` : 'Corporal'}
            </div>
          </div>
        </div>

        {parseFloat(workout.weight_kg) > 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            <strong>Volumen total:</strong> {totalVolume} kg
          </div>
        )}

        {workout.notes && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.4rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginBottom: '0.75rem',
            background: '#fafafa',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <FileText size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{workout.notes}</span>
          </div>
        )}
      </div>


      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.75rem',
        marginTop: '0.5rem'
      }}>
        <button
          onClick={() => onEdit(workout)}
          className="btn btn-outline btn-sm"
          title="Editar registro"
        >
          <Edit2 size={14} />
          <span>Editar</span>
        </button>

        <button
          onClick={() => onDelete(workout)}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
          title="Eliminar registro"
        >
          <Trash2 size={14} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
