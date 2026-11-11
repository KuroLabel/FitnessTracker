import React from 'react';
import { Activity, Flame, Layers, Award } from 'lucide-react';

export default function StatsBanner({ workouts }) {
  if (!workouts || workouts.length === 0) return null;

  const totalExercises = workouts.length;
  const totalSets = workouts.reduce((acc, w) => acc + (w.sets || 0), 0);
  const totalVolume = workouts.reduce((acc, w) => {
    return acc + (w.sets * w.reps * parseFloat(w.weight_kg || 0));
  }, 0);


  const muscleCounts = {};
  workouts.forEach((w) => {
    muscleCounts[w.muscle_group] = (muscleCounts[w.muscle_group] || 0) + 1;
  });
  let topMuscle = 'N/A';
  let topCount = 0;
  Object.entries(muscleCounts).forEach(([muscle, count]) => {
    if (count > topCount) {
      topCount = count;
      topMuscle = muscle;
    }
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ background: '#dbeafe', color: '#1e40af', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL EJERCICIOS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{totalExercises}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOLUMEN TOTAL</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{totalVolume.toLocaleString('es-CL')} kg</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SERIES TOTALES</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{totalSets}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>MÁS ENTRENADO</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{topMuscle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
