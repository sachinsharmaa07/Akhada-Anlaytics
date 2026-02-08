import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Dumbbell, ChevronRight, ChevronDown, Zap, Bookmark, X, Search, Star, Edit3, Trash2, Save, FileText } from 'lucide-react';
import useWorkoutStore from '../stores/workoutStore';
import { getWorkouts, getPersonalRecords } from '../api/api';
import BodyVisualizer from '../components/BodyVisualizer';
import { WorkoutSkeleton } from '../components/Skeleton.jsx';
import WORKOUT_TEMPLATES from '../data/workoutTemplates';
import LEGEND_TEMPLATES, { LEGEND_ATHLETES } from '../data/legendTemplates';
import { searchLocalExercises } from '../data/exerciseDb';
import { getExerciseImage } from '../data/exerciseImages';
import '../styles/Workout.css';

/* ═══════════════════════════════════════════════════════
   Custom Templates — localStorage persistence
   ═══════════════════════════════════════════════════════ */
const STORAGE_KEY = 'akhada_custom_templates';
const loadCustomTemplates = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const saveCustomTemplates = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

/* ═══════════════════════════════════════════════════════
   Create / Edit Template Modal
   ═══════════════════════════════════════════════════════ */
const TemplateCreator = ({ onClose, onSave, initial }) => {
  const [name, setName] = useState(initial?.name || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [exercises, setExercises] = useState(initial?.exercises || []);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    return searchLocalExercises(search, 10).filter(r => !exercises.find(e => e.name === r.name));
  }, [search, exercises]);

  useEffect(() => {
    if (!showSearch) return;
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) { setShowSearch(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showSearch]);

  const addExercise = (ex) => {
    setExercises(prev => [...prev, { name: ex.name, muscleGroup: ex.muscleGroup, secondaryMuscles: ex.secondaryMuscles || [], equipment: ex.equipment || 'other', defaultSets: 3, reps: '8–12' }]);
    setSearch('');
  };

  const removeExercise = (idx) => setExercises(prev => prev.filter((_, i) => i !== idx));

  const updateReps = (idx, reps) => setExercises(prev => prev.map((e, i) => i === idx ? { ...e, reps } : e));
  const updateSets = (idx, defaultSets) => setExercises(prev => prev.map((e, i) => i === idx ? { ...e, defaultSets: Number(defaultSets) || 3 } : e));

  const handleSave = () => {
    if (!name.trim()) return;
    if (exercises.length === 0) return;
    onSave({
      id: initial?.id || `custom-${Date.now()}`,
      name: name.trim(),
      notes: notes.trim(),
      exercises,
      createdAt: initial?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="tpl-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tpl-modal">
        <div className="tpl-modal__header">
          <h2 className="tpl-modal__title"><FileText size={18} /> {initial ? 'Edit Template' : 'Create Template'}</h2>
          <button className="tpl-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="tpl-modal__body">
          {/* Name */}
          <div className="tpl-modal__field">
            <label className="tpl-modal__label">Template Name</label>
            <input className="input tpl-modal__input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My Push Day" maxLength={60} />
          </div>

          {/* Notes */}
          <div className="tpl-modal__field">
            <label className="tpl-modal__label">Notes (optional)</label>
            <textarea className="input tpl-modal__textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Rest times, cues, warm-up instructions…" rows={3} maxLength={500} />
          </div>

          {/* Exercises */}
          <div className="tpl-modal__field">
            <label className="tpl-modal__label">Exercises ({exercises.length})</label>
            {exercises.length > 0 && (
              <div className="tpl-modal__ex-list">
                {exercises.map((ex, idx) => (
                  <div key={`${ex.name}-${idx}`} className="tpl-modal__ex-row">
                    {getExerciseImage(ex.name) && <img src={getExerciseImage(ex.name)} alt="" className="tpl-modal__ex-thumb" />}
                    <span className="tpl-modal__ex-num">{idx + 1}</span>
                    <span className="tpl-modal__ex-name">{ex.name}</span>
                    <input className="tpl-modal__ex-sets" type="number" value={ex.defaultSets} onChange={e => updateSets(idx, e.target.value)} min={1} max={10} title="Sets" />
                    <span className="tpl-modal__ex-x">×</span>
                    <input className="tpl-modal__ex-reps" value={ex.reps || ''} onChange={e => updateReps(idx, e.target.value)} placeholder="Reps" title="Reps" />
                    <button className="tpl-modal__ex-del" onClick={() => removeExercise(idx)}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Add exercise */}
            <div className="tpl-modal__add" ref={searchRef}>
              {showSearch ? (
                <>
                  <div className="tpl-modal__search-box">
                    <Search size={14} />
                    <input className="tpl-modal__search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exercises…" autoFocus />
                  </div>
                  {results.length > 0 && (
                    <div className="tpl-modal__search-results">
                      {results.map(r => (
                        <button key={r.name} className="tpl-modal__search-item" onMouseDown={() => addExercise(r)}>
                          {getExerciseImage(r.name) && <img src={getExerciseImage(r.name)} alt="" className="tpl-modal__search-thumb" />}
                          <span>{r.name}</span>
                          <span className="badge badge-cyan badge--xs">{r.muscleGroup}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button className="tpl-modal__add-btn" onClick={() => setShowSearch(true)}>
                  <Plus size={14} /> Add Exercise
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="tpl-modal__footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || exercises.length === 0}>
            <Save size={14} /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Legend Template Detail Card (expandable)
   ═══════════════════════════════════════════════════════ */
const LegendDetail = ({ template, onStart }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`legend-detail${open ? ' legend-detail--open' : ''}`} style={{ '--accent': template.accent }}>
      <button className="legend-detail__header" onClick={() => setOpen(v => !v)}>
        <span className="legend-detail__name">{template.name}</span>
        <span className="legend-detail__count">{template.exercises.length} exercises</span>
        <ChevronDown size={16} className={`legend-detail__chevron${open ? ' legend-detail__chevron--open' : ''}`} />
      </button>
      {open && (
        <div className="legend-detail__body">
          <p className="legend-detail__philosophy">{template.philosophy}</p>

          {template.warmup && (
            <div className="legend-detail__section">
              <span className="legend-detail__section-label">🔥 Warm-Up</span>
              <p className="legend-detail__section-text">{template.warmup}</p>
            </div>
          )}

          <div className="legend-detail__exercises">
            {template.exercises.map((ex, i) => (
              <div key={ex.name} className="legend-detail__ex">
                {getExerciseImage(ex.name) ? (
                  <img src={getExerciseImage(ex.name)} alt="" className="legend-detail__ex-img" />
                ) : (
                  <span className="legend-detail__ex-num">{i + 1}</span>
                )}
                <span className="legend-detail__ex-name">{ex.name}</span>
                <span className="legend-detail__ex-rx">{ex.defaultSets}×{ex.reps}</span>
              </div>
            ))}
          </div>

          {template.notes && template.notes.length > 0 && (
            <div className="legend-detail__section">
              <span className="legend-detail__section-label">📝 Notes</span>
              <ul className="legend-detail__notes">
                {template.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}

          <button className="btn btn-primary btn--sm legend-detail__start" onClick={() => onStart(template)}>
            <Zap size={14} /> Start This Workout
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Main Workout Page
   ═══════════════════════════════════════════════════════ */
const Workout = () => {
  const navigate = useNavigate();
  const { workouts, setWorkouts, personalRecords, setPersonalRecords } = useWorkoutStore();
  const [activeTab, setActiveTab] = useState('workouts');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [expandedLegend, setExpandedLegend] = useState(null);
  const [customTemplates, setCustomTemplates] = useState(() => loadCustomTemplates());
  const [showCreator, setShowCreator] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [workoutData, prData] = await Promise.all([
          getWorkouts(1, 10),
          getPersonalRecords()
        ]);
        if (cancelled) return;
        setWorkouts(workoutData.workouts || []);
        setPersonalRecords(prData.records || []);
      } catch (e) { if (!cancelled) console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [setWorkouts, setPersonalRecords]);

  const visExercises = useMemo(() => {
    const seen = new Map();
    (workouts || []).forEach((w) => {
      (w.exercises || []).forEach((ex, idx) => {
        const id = ex.exerciseId?._id || ex.exerciseId || `${ex.exerciseName || 'ex'}-${idx}`;
        if (!seen.has(id)) {
          seen.set(id, {
            id,
            name: ex.exerciseId?.name || ex.exerciseName || 'Exercise',
            muscleGroup: ex.exerciseId?.muscleGroup || ex.muscleGroup,
            secondaryMuscles: ex.exerciseId?.secondaryMuscles || ex.secondaryMuscles || [],
          });
        }
      });
    });
    return Array.from(seen.values());
  }, [workouts]);

  /* ── Custom template CRUD ── */
  const handleSaveCustom = useCallback((tpl) => {
    setCustomTemplates(prev => {
      const exists = prev.findIndex(t => t.id === tpl.id);
      const next = exists >= 0 ? prev.map((t, i) => i === exists ? tpl : t) : [...prev, tpl];
      saveCustomTemplates(next);
      return next;
    });
    setShowCreator(false);
    setEditingTemplate(null);
  }, []);

  const handleDeleteCustom = useCallback((id) => {
    setCustomTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      saveCustomTemplates(next);
      return next;
    });
  }, []);

  const startTemplate = useCallback((tpl) => {
    navigate('/workout/log', { state: { template: tpl } });
  }, [navigate]);

  if (loading) return <WorkoutSkeleton />;

  const renderWorkouts = () => (
    <div>
      {workouts.length === 0 ? (
        <div className="workout__empty">No workouts yet. Start your first session!</div>
      ) : (
        workouts.map(workout => {
          const isOpen = expanded[workout._id] || false;
          return (
            <div key={workout._id} className="card workout-card">
              <div className="workout-card__header">
                <div>
                  <div className="workout-card__date">
                    {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="workout-card__meta">
                    <span className="workout-card__meta-item"><Dumbbell size={14} /> {workout.exercises.length} exercises</span>
                    <span className="workout-card__meta-item">{Math.round(workout.totalVolume).toLocaleString()} kg volume</span>
                    {workout.duration && <span className="workout-card__meta-item">{workout.duration} min</span>}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn--sm"
                  onClick={() => setExpanded(prev => ({ ...prev, [workout._id]: !isOpen }))}
                >
                  View <ChevronRight size={16} />
                </button>
              </div>
              {isOpen && (
                <div className="workout-card__exercises">
                  {workout.exercises.map((ex, idx) => {
                    const name = ex.exerciseId?.name || ex.exerciseName || 'Exercise';
                    const muscle = ex.exerciseId?.muscleGroup || ex.muscleGroup || '';
                    return (
                      <div className="workout-card__exercise-row" key={`${workout._id}-${idx}`}>
                        <span>{name}</span>
                        <span className="badge badge-cyan">{muscle}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderPRs = () => (
    <div className="workout__prs">
      {personalRecords.length === 0 ? (
        <div className="workout__empty">No records yet. Start training!</div>
      ) : (
        personalRecords.map((pr, idx) => (
          <div key={`${pr.exerciseId}-${idx}`} className="pr-card">
            <div className="pr-card__header">
              <span className="pr-card__name">{pr.exerciseName || pr.exerciseId?.name || 'Exercise'}</span>
              <Trophy size={20} className="pr-card__trophy" />
            </div>
            <span className="badge badge-orange">{pr.recordType}</span>
            <div className="pr-card__value">{Math.round(pr.value).toLocaleString()}</div>
            {pr.previousValue > 0 && <div className="pr-card__prev">Previous: {Math.round(pr.previousValue)}</div>}
            <div className="pr-card__date">{new Date(pr.date).toLocaleDateString()}</div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="workout page-enter">
      <div className="workout__header">
        <h1 className="section-title">Workout <span>Hub</span></h1>
        <button className="btn btn-primary" onClick={() => navigate('/workout/log')}>
          <Plus size={18} /> New Workout
        </button>
      </div>

      {visExercises.length > 0 && (
        <div className="workout__visualization card">
          <BodyVisualizer exercises={visExercises} />
        </div>
      )}

      {/* ═══ LEGENDARY ATHLETE TEMPLATES ═══ */}
      <div className="workout__legends">
        <h3 className="section-title" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
          <Star size={16} /> Train Like <span>The Legends</span>
        </h3>

        <div className="legend-grid">
          {LEGEND_ATHLETES.map(athlete => {
            const isOpen = expandedLegend === athlete.id;
            const templates = LEGEND_TEMPLATES.filter(t => t.legendId === athlete.id);
            return (
              <div key={athlete.id} className={`legend-card${isOpen ? ' legend-card--open' : ''}`} style={{ '--legend-accent': athlete.accent }}>
                <button className="legend-card__header" onClick={() => setExpandedLegend(isOpen ? null : athlete.id)}>
                  <div className="legend-card__avatar-wrap">
                    <img src={athlete.image} alt={athlete.name} className="legend-card__avatar" />
                    <span className="legend-card__emoji">{athlete.emoji}</span>
                  </div>
                  <div className="legend-card__info">
                    <span className="legend-card__name">{athlete.name}</span>
                    <span className="legend-card__tag">{athlete.tag}</span>
                    <span className="legend-card__tagline">{athlete.tagline}</span>
                  </div>
                  <ChevronDown size={18} className={`legend-card__chevron${isOpen ? ' legend-card__chevron--open' : ''}`} />
                </button>

                {isOpen && (
                  <div className="legend-card__body">
                    {templates.map(tpl => (
                      <LegendDetail key={tpl.id} template={tpl} onStart={startTemplate} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ CUSTOM TEMPLATES ═══ */}
      <div className="workout__custom-templates">
        <div className="workout__custom-header">
          <h3 className="section-title" style={{ fontSize: '0.95rem' }}>
            <Bookmark size={16} /> My <span>Templates</span>
          </h3>
          <button className="btn btn-secondary btn--sm" onClick={() => { setEditingTemplate(null); setShowCreator(true); }}>
            <Plus size={14} /> Create
          </button>
        </div>

        {customTemplates.length > 0 ? (
          <div className="custom-tpl-grid">
            {customTemplates.map(tpl => (
              <div key={tpl.id} className="custom-tpl-card">
                <div className="custom-tpl-card__header">
                  <FileText size={16} className="custom-tpl-card__icon" />
                  <span className="custom-tpl-card__name">{tpl.name}</span>
                </div>
                <span className="custom-tpl-card__count">{tpl.exercises.length} exercises</span>
                {tpl.notes && <p className="custom-tpl-card__notes">{tpl.notes}</p>}
                <div className="custom-tpl-card__exercises">
                  {tpl.exercises.slice(0, 4).map((ex, i) => (
                    <span key={i} className="custom-tpl-card__ex">{ex.name}</span>
                  ))}
                  {tpl.exercises.length > 4 && <span className="custom-tpl-card__ex custom-tpl-card__ex--more">+{tpl.exercises.length - 4} more</span>}
                </div>
                <div className="custom-tpl-card__actions">
                  <button className="btn btn-primary btn--sm" onClick={() => startTemplate(tpl)}>
                    <Zap size={13} /> Start
                  </button>
                  <button className="btn btn-ghost btn--sm" onClick={() => { setEditingTemplate(tpl); setShowCreator(true); }}>
                    <Edit3 size={13} />
                  </button>
                  <button className="btn btn-ghost btn--sm custom-tpl-card__del" onClick={() => handleDeleteCustom(tpl.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="workout__empty" style={{ padding: '1rem' }}>
            No custom templates yet. Create your first one!
          </div>
        )}
      </div>

      {/* ═══ QUICK-START TEMPLATES ═══ */}
      <div className="workout__templates">
        <h3 className="section-title" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)' }}>
          <Zap size={16} /> Quick <span>Templates</span>
        </h3>
        <div className="workout__template-grid">
          {WORKOUT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className="workout__template-card"
              style={{ '--tpl-color': tpl.color }}
              onClick={() => navigate('/workout/log', { state: { template: tpl } })}
            >
              <span className="workout__template-emoji">{tpl.emoji}</span>
              <span className="workout__template-name">{tpl.name}</span>
              <span className="workout__template-desc">{tpl.description}</span>
              <span className="workout__template-count">{tpl.exercises.length} exercises</span>
            </button>
          ))}
        </div>
      </div>

      <div className="workout__tabs">
        <button className={`workout__tab ${activeTab === 'workouts' ? 'workout__tab--active' : ''}`}
          onClick={() => setActiveTab('workouts')}>My Workouts</button>
        <button className={`workout__tab ${activeTab === 'prs' ? 'workout__tab--active' : ''}`}
          onClick={() => setActiveTab('prs')}>Personal Records</button>
      </div>

      {activeTab === 'workouts' ? renderWorkouts() : renderPRs()}

      {/* ═══ TEMPLATE CREATOR MODAL ═══ */}
      {showCreator && (
        <TemplateCreator
          onClose={() => { setShowCreator(false); setEditingTemplate(null); }}
          onSave={handleSaveCustom}
          initial={editingTemplate}
        />
      )}
    </div>
  );
};

export default Workout;
