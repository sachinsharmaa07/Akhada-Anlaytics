import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Check, ArrowLeft, Clock, Search, X, ChevronDown, ChevronRight, Dumbbell } from 'lucide-react';
import { createWorkout, getLastWeights } from '../api/api';
import { searchLocalExercises, getMuscleIcon, EQUIPMENT_LABELS, MUSCLE_GROUPS } from '../data/exerciseDb';
import { getExerciseImage } from '../data/exerciseImages';
import { toast } from '../stores/toastStore';
import '../styles/WorkoutLog.css';

const DEFAULT_SET = { reps: 0, weight: 0, unit: 'kg', completed: false, _touched: {} };

/* ─── Exercise search dropdown ─── */
const ExerciseSearch = React.memo(({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const r = searchLocalExercises(query, 50);
    setResults(r);
    setOpen(query.length > 0 || document.activeElement === wrapperRef.current?.querySelector('input'));
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredResults = useMemo(() => {
    if (!muscleFilter) return results.slice(0, 15);
    return results.filter((ex) => ex.muscleGroup === muscleFilter).slice(0, 15);
  }, [results, muscleFilter]);

  const handleSelect = (ex) => {
    onSelect(ex);
    setQuery('');
    setOpen(false);
    setMuscleFilter(null);
  };

  return (
    <div className="ex-search" ref={wrapperRef}>
      <div className="ex-search__input-wrap">
        <Search size={16} className="ex-search__icon" />
        <input
          className="input ex-search__input"
          placeholder="Search exercises… (e.g. Bench Press)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button className="ex-search__clear" onClick={() => { setQuery(''); setMuscleFilter(null); }}>
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="ex-search__panel">
          {/* ── Muscle-group filter pills ── */}
          <div className="ex-search__filters">
            <button
              className={`ex-search__filter-pill ${!muscleFilter ? 'ex-search__filter-pill--active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); setMuscleFilter(null); }}
            >All</button>
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m}
                className={`ex-search__filter-pill ${muscleFilter === m ? 'ex-search__filter-pill--active' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); setMuscleFilter(m); }}
              >
                <img src={getMuscleIcon(m)} alt="" className="ex-search__filter-icon" />
                {m}
              </button>
            ))}
          </div>

          {/* ── Results dropdown ── */}
          {filteredResults.length > 0 ? (
            <ul className="ex-search__dropdown">
              {filteredResults.map((ex, idx) => (
                <li
                  key={ex.name}
                  className="ex-search__item"
                  style={{ animationDelay: `${idx * 25}ms` }}
                  onMouseDown={() => handleSelect(ex)}
                >
                  <img src={getExerciseImage(ex.name) || getMuscleIcon(ex.muscleGroup)} alt="" className={`ex-search__thumb${getExerciseImage(ex.name) ? ' ex-search__thumb--photo' : ''}`} />
                  <div className="ex-search__info">
                    <span className="ex-search__name">{ex.name}</span>
                    <span className="ex-search__meta">
                      <span className="badge badge-cyan badge--xs">{ex.muscleGroup}</span>
                      <span className="ex-search__equip-badge">{EQUIPMENT_LABELS[ex.equipment] || ex.equipment}</span>
                    </span>
                    {ex.secondaryMuscles.length > 0 && (
                      <span className="ex-search__secondary-tags">
                        {ex.secondaryMuscles.map((m) => (
                          <span key={m} className="ex-search__sec-tag">{m}</span>
                        ))}
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} className="ex-search__arrow" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="ex-search__empty">
              <Dumbbell size={20} />
              <span>No exercises found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
ExerciseSearch.displayName = 'ExerciseSearch';

/* ─── Manual add fallback ─── */
const ManualAddForm = React.memo(({ onAdd }) => {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('chest');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), muscleGroup: muscle, secondaryMuscles: [], equipment: 'bodyweight' });
    setName('');
  };

  return (
    <div className="workout-log__manual-row">
      <input className="input" placeholder="Or type exercise name…" value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
      <select className="input" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
        {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <button className="btn btn-ghost btn--sm" onClick={handleAdd}>
        <Plus size={16} /> Add
      </button>
    </div>
  );
});
ManualAddForm.displayName = 'ManualAddForm';

/* ─── Main component ─── */
const WorkoutLog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exercises, setExercises] = useState([]);
  const notesRef = useRef('');
  const startTimeRef = useRef(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showManual, setShowManual] = useState(false);
  const templateLoadedRef = useRef(false);

  /* ── Load template exercises if navigated with template state ── */
  useEffect(() => {
    if (templateLoadedRef.current) return;
    const template = location.state?.template;
    if (template && template.exercises && template.exercises.length > 0) {
      templateLoadedRef.current = true;
      toast.info(`Loading ${template.name} template…`);
      // Add each template exercise sequentially
      template.exercises.forEach((ex, idx) => {
        setTimeout(() => addExercise(ex), idx * 100);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Add exercise from search or manual ── */
  const addExercise = useCallback(async (ex) => {
    const numSets = ex.defaultSets || 3;
    const setsArr = Array.from({ length: numSets }, (_, i) => ({
      setNumber: i + 1,
      ...DEFAULT_SET,
    }));
    const newExercise = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      exerciseId: null,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      secondaryMuscles: ex.secondaryMuscles || [],
      equipment: ex.equipment || 'bodyweight',
      sets: setsArr,
      notes: '',
      loadingWeights: true,
    };

    setExercises((prev) => [...prev, newExercise]);

    // Try to load weights from previous session
    try {
      const data = await getLastWeights(ex.name);
      if (data.sets && data.sets.length > 0) {
        setExercises((prev) =>
          prev.map((e) => {
            if (e.id !== newExercise.id) return e;
            const mergedSets = e.sets.map((s, idx) => {
              const prevSet = data.sets[idx];
              if (prevSet) {
                return {
                  ...s,
                  weight: prevSet.weight || 0,
                  reps: prevSet.reps || 0,
                  _touched: {}, // pre-filled values are not "manually touched"
                };
              }
              const lastPrev = data.sets[data.sets.length - 1];
              return { ...s, weight: lastPrev?.weight || 0, reps: lastPrev?.reps || 0, _touched: {} };
            });
            return { ...e, sets: mergedSets, loadingWeights: false };
          })
        );
        toast.info(`Loaded previous weights for ${ex.name}`);
      } else {
        setExercises((prev) =>
          prev.map((e) => (e.id === newExercise.id ? { ...e, loadingWeights: false } : e))
        );
      }
    } catch {
      setExercises((prev) =>
        prev.map((e) => (e.id === newExercise.id ? { ...e, loadingWeights: false } : e))
      );
    }
  }, []);

  const removeExercise = useCallback((idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const addSet = useCallback((exIdx) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const refSet = ex.sets[0]; // inherit weight+reps from first set
        const newSetNum = ex.sets.length + 1;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              setNumber: newSetNum,
              reps: refSet?.reps || 0,
              weight: refSet?.weight || 0,
              unit: refSet?.unit || 'kg',
              completed: false,
              _touched: {},
            },
          ],
        };
      })
    );
  }, []);

  /* ── Update a set field. Auto-fill weight & reps to all untouched sets ── */
  const updateSet = useCallback((exIdx, setIdx, field, value) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const newSets = ex.sets.map((s, j) => {
          if (j === setIdx) {
            return { ...s, [field]: value, _touched: { ...s._touched, [field]: true } };
          }
          return s;
        });

        // Auto-fill: propagate weight or reps to ALL sets not manually touched for this field
        if ((field === 'weight' || field === 'reps') && value > 0) {
          for (let k = 0; k < newSets.length; k++) {
            if (k !== setIdx && !newSets[k]._touched?.[field]) {
              newSets[k] = { ...newSets[k], [field]: value };
            }
          }
        }

        return { ...ex, sets: newSets };
      })
    );
  }, []);

  const toggleComplete = useCallback((exIdx, setIdx) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, j) =>
            j === setIdx ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  }, []);

  const submitWorkout = useCallback(async () => {
    if (exercises.length === 0) {
      setError('Add at least one exercise');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
      // Strip internal _touched tracking before sending to API
      const cleanExercises = exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map(({ _touched, ...s }) => s),
      }));
      await createWorkout({ exercises: cleanExercises, duration, notes: notesRef.current });
      toast.success('Workout saved!');
      navigate('/workout');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to save workout';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [exercises, navigate]);

  /* ── Elapsed time display ── */
  const [elapsed, setElapsed] = useState('0:00');
  useEffect(() => {
    const iv = setInterval(() => {
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const m = Math.floor(diff / 60);
      const s = String(diff % 60).padStart(2, '0');
      setElapsed(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const totalVolume = useMemo(
    () => exercises.reduce((t, ex) =>
      t + ex.sets.reduce((s, set) => s + (set.completed ? (set.weight || 0) * (set.reps || 0) : 0), 0), 0),
    [exercises]
  );

  return (
    <div className="workout-log page-enter">
      {/* ── Header ── */}
      <div className="workout-log__header">
        <button className="btn btn-ghost btn--sm" onClick={() => navigate('/workout')}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="section-title">Log <span>Workout</span></h1>
        <div className="workout-log__timer">
          <Clock size={16} /> {elapsed}
        </div>
      </div>

      {/* ── Stats bar ── */}
      {exercises.length > 0 && (
        <div className="workout-log__stats">
          <div className="workout-log__stat">
            <span className="workout-log__stat-label">Exercises</span>
            <span className="workout-log__stat-value">{exercises.length}</span>
          </div>
          <div className="workout-log__stat">
            <span className="workout-log__stat-label">Total Volume</span>
            <span className="workout-log__stat-value">{totalVolume.toLocaleString()} kg</span>
          </div>
          <div className="workout-log__stat">
            <span className="workout-log__stat-label">Duration</span>
            <span className="workout-log__stat-value">{elapsed}</span>
          </div>
        </div>
      )}

      {/* ── Exercise search ── */}
      <div className="card workout-log__add-exercise">
        <h3>Add Exercise</h3>
        <ExerciseSearch onSelect={addExercise} />
        <button
          className="btn btn-ghost btn--xs workout-log__manual-toggle"
          onClick={() => setShowManual((v) => !v)}
        >
          <ChevronDown size={14} style={{ transform: showManual ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          {showManual ? 'Hide' : 'Custom exercise'}
        </button>
        {showManual && <ManualAddForm onAdd={(ex) => addExercise(ex)} />}
      </div>

      {/* ── Exercise cards ── */}
      {exercises.map((ex, exIdx) => (
        <div className="card workout-log__exercise-card" key={ex.id}>
          <div className="workout-log__ex-header">
            <img src={getExerciseImage(ex.exerciseName) || getMuscleIcon(ex.muscleGroup)} alt="" className={`workout-log__ex-icon${getExerciseImage(ex.exerciseName) ? ' workout-log__ex-icon--photo' : ''}`} />
            <div className="workout-log__ex-title">
              <span className="workout-log__ex-name">{ex.exerciseName}</span>
              <span className="workout-log__ex-meta">
                <span className="badge badge-cyan badge--xs">{ex.muscleGroup}</span>
                {ex.secondaryMuscles.length > 0 && (
                  <span className="workout-log__ex-secondary">
                    + {ex.secondaryMuscles.join(', ')}
                  </span>
                )}
              </span>
            </div>
            <button className="btn btn-danger btn--sm" onClick={() => removeExercise(exIdx)}>
              <Trash2 size={14} />
            </button>
          </div>

          {ex.loadingWeights && (
            <div className="workout-log__loading-weights">Loading previous weights…</div>
          )}

          <div className="workout-log__sets-table">
            <div className="workout-log__sets-header">
              <span>Set</span><span>Reps</span><span>Weight (kg)</span><span>Done</span>
            </div>
            {ex.sets.map((s, sIdx) => (
              <div className={`workout-log__set-row ${s.completed ? 'workout-log__set-row--done' : ''}`} key={sIdx}>
                <span className="workout-log__set-num">#{s.setNumber}</span>
                <input
                  className="input workout-log__set-input"
                  type="number" min="0"
                  value={s.reps || ''}
                  placeholder="0"
                  onChange={(e) => updateSet(exIdx, sIdx, 'reps', Number(e.target.value))}
                />
                <input
                  className="input workout-log__set-input"
                  type="number" min="0" step="0.5"
                  value={s.weight || ''}
                  placeholder="0"
                  onChange={(e) => updateSet(exIdx, sIdx, 'weight', Number(e.target.value))}
                />
                <button
                  className={`workout-log__check-btn ${s.completed ? 'workout-log__check-btn--done' : ''}`}
                  onClick={() => toggleComplete(exIdx, sIdx)}
                >
                  <Check size={18} />
                </button>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost btn--sm" onClick={() => addSet(exIdx)}>
            <Plus size={14} /> Add Set
          </button>
        </div>
      ))}

      {error && <p style={{ color: 'var(--neon-pink)', fontSize: '0.85rem' }}>{error}</p>}

      <button
        className="btn btn-primary workout-log__submit"
        onClick={submitWorkout}
        disabled={submitting || exercises.length === 0}
      >
        {submitting ? 'Saving...' : 'Complete Workout'}
      </button>
    </div>
  );
};

export default WorkoutLog;
