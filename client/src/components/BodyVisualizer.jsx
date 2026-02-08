import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, Eye, EyeOff, X, Crosshair, Target, Shield, Plus } from 'lucide-react';
import MuscleHeatMap from './MuscleHeatMap';
import { searchLocalExercises } from '../data/exerciseDb';
import cbumImg from '../images/cbum.png';
import './BodyVisualizer.css';

/* ═══════════════════════════════════════════════════════
   GymVis-style Muscle Activation Visualizer
   — Role-based exercise → muscle coloring
   ═══════════════════════════════════════════════════════ */

const FOCUS_MODES = [
  { key: 'all',       label: 'All',       icon: Crosshair },
  { key: 'target',    label: 'Target',    icon: Target },
  { key: 'synergist', label: 'Synergist', icon: Shield },
];

const ROLE_META = {
  target:    { color: '#ff2d95', label: 'Target',    desc: 'Primary muscles worked' },
  synergist: { color: '#00f0ff', label: 'Synergist', desc: 'Supporting muscles' },
};

/* ── Build role map from exercises ── */
const buildRoles = (exercises, focusMode) => {
  const map = {};
  exercises.forEach(ex => {
    if (ex._hidden) return;
    const mg = ex.muscleGroup;
    if (mg && (focusMode === 'all' || focusMode === 'target')) {
      map[mg] = 'target';
    }
    (ex.secondaryMuscles || []).forEach(m => {
      if (focusMode === 'all' || focusMode === 'synergist') {
        if (!map[m] || map[m] !== 'target') {
          map[m] = 'synergist';
        }
      }
    });
  });
  return map;
};

const BodyVisualizer = React.memo(({ exercises = [] }) => {
  const [activeExercises, setActiveExercises] = useState([]);
  const [focusMode, setFocusMode] = useState('all');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const searchRef = useRef(null);

  /* Sync exercises from parent */
  useEffect(() => {
    setActiveExercises(prev => {
      const names = new Set(prev.map(e => e.name));
      const incoming = exercises
        .filter(e => !names.has(e.name))
        .map(e => ({ ...e, _hidden: false }));
      return incoming.length > 0 ? [...prev, ...incoming] : prev;
    });
  }, [exercises]);

  /* Close search on outside click */
  useEffect(() => {
    if (!showSearch) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSearch]);

  /* Role map */
  const roles = useMemo(() => buildRoles(activeExercises, focusMode), [activeExercises, focusMode]);

  /* Search results */
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return searchLocalExercises(search, 8).filter(
      ex => !activeExercises.find(a => a.name === ex.name)
    );
  }, [search, activeExercises]);

  const addExercise = useCallback((ex) => {
    setActiveExercises(prev => {
      if (prev.find(e => e.name === ex.name)) return prev;
      return [...prev, { ...ex, _hidden: false }];
    });
    setSearch('');
  }, []);

  const toggleVisibility = useCallback((name) => {
    setActiveExercises(prev => prev.map(e =>
      e.name === name ? { ...e, _hidden: !e._hidden } : e
    ));
  }, []);

  const removeExercise = useCallback((name) => {
    setActiveExercises(prev => prev.filter(e => e.name !== name));
  }, []);

  /* Stats */
  const visibleCount = activeExercises.filter(e => !e._hidden).length;
  const muscleCount = Object.keys(roles).length;
  const roleCounts = useMemo(() => {
    const c = { target: 0, synergist: 0 };
    Object.values(roles).forEach(r => { if (c[r] !== undefined) c[r]++; });
    return c;
  }, [roles]);

  return (
    <div className="body-vis">
      {/* ── Header ── */}
      <div className="body-vis__header">
        <div>
          <h3 className="body-vis__title">
            <Crosshair size={18} /> Muscle Activation
          </h3>
          <p className="body-vis__subtitle">
            {visibleCount} exercise{visibleCount !== 1 ? 's' : ''} active · {muscleCount} muscle{muscleCount !== 1 ? 's' : ''} targeted
          </p>
        </div>
        <button
          className={`body-vis__model-toggle${showModel ? ' body-vis__model-toggle--on' : ''}`}
          onClick={() => setShowModel(v => !v)}
          title="Toggle physique reference"
        >
          {showModel ? '◉ Model' : '○ Model'}
        </button>
      </div>

      {/* ── Focus mode radio ── */}
      <div className="body-vis__focus">
        {FOCUS_MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`body-vis__focus-btn${focusMode === key ? ' body-vis__focus-btn--on' : ''}`}
            onClick={() => setFocusMode(key)}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── Role legend ── */}
      <div className="body-vis__legend">
        {Object.entries(ROLE_META).map(([key, { color, label, desc }]) => (
          <div key={key} className="body-vis__legend-item" title={desc}>
            <span className="body-vis__legend-dot" style={{ background: color, boxShadow: `0 0 8px ${color}55` }} />
            <span className="body-vis__legend-label">{label}</span>
            <span className="body-vis__legend-count" style={{ color }}>{roleCounts[key] || 0}</span>
          </div>
        ))}
      </div>

      {/* ── Exercise chips ── */}
      <div className="body-vis__chips">
        {activeExercises.map(ex => (
          <div key={ex.name} className={`body-vis__chip${ex._hidden ? ' body-vis__chip--hidden' : ''}`}>
            <span className="body-vis__chip-dot" style={{ background: ex._hidden ? 'rgba(100,140,200,0.2)' : '#ff2d95' }} />
            <span className="body-vis__chip-name">{ex.name}</span>
            <button className="body-vis__chip-btn" onClick={() => toggleVisibility(ex.name)} title={ex._hidden ? 'Show' : 'Hide'}>
              {ex._hidden ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button className="body-vis__chip-btn body-vis__chip-btn--close" onClick={() => removeExercise(ex.name)} title="Remove">
              <X size={12} />
            </button>
          </div>
        ))}
        <button className="body-vis__chip body-vis__chip--add" onClick={() => setShowSearch(v => !v)}>
          <Plus size={13} /> Add
        </button>
      </div>

      {/* ── Exercise search ── */}
      {showSearch && (
        <div className="body-vis__search" ref={searchRef}>
          <div className="body-vis__search-box">
            <Search size={14} className="body-vis__search-icon" />
            <input
              className="body-vis__search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises…"
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div className="body-vis__search-results">
              {searchResults.map(ex => (
                <button key={ex.name} className="body-vis__search-item" onClick={() => addExercise(ex)}>
                  <span className="body-vis__search-name">{ex.name}</span>
                  <span className="badge badge-cyan">{ex.muscleGroup}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Body visualization ── */}
      <div className={`body-vis__body${showModel ? ' body-vis__body--model' : ''}`}>
        {showModel && (
          <img src={cbumImg} alt="" className="body-vis__model-img" draggable={false} />
        )}
        <div className="body-vis__svg-wrap">
          <MuscleHeatMap roles={roles} />
        </div>
      </div>
    </div>
  );
});

BodyVisualizer.displayName = 'BodyVisualizer';
export default BodyVisualizer;
