import React, { useState, useMemo, useCallback } from 'react';
import './MuscleHeatMap.css';

/* ═══════════════════════════════════════════════════════
   Colour system — green → cyan → magenta spectrum
   ═══════════════════════════════════════════════════════ */
const lerp = (a, b, t) => a + (b - a) * t;

const rgb = (pct) => {
  if (pct <= 0) return { r: 100, g: 150, b: 220, a: 0.05 };
  const t = Math.min(pct, 100) / 100;
  if (t < 0.35) {
    const s = t / 0.35;
    return { r: (lerp(40, 57, s)) | 0, g: (lerp(200, 255, s)) | 0, b: (lerp(80, 20, s)) | 0, a: lerp(0.18, 0.38, s) };
  }
  if (t < 0.65) {
    const s = (t - 0.35) / 0.3;
    return { r: (lerp(57, 0, s)) | 0, g: (lerp(255, 220, s)) | 0, b: (lerp(20, 255, s)) | 0, a: lerp(0.38, 0.6, s) };
  }
  const s = (t - 0.65) / 0.35;
  return { r: (lerp(0, 255, s)) | 0, g: (lerp(220, 45, s)) | 0, b: (lerp(255, 130, s)) | 0, a: lerp(0.6, 0.9, s) };
};

const colorFill = (p) => { const c = rgb(p); return `rgba(${c.r},${c.g},${c.b},${c.a})`; };
const colorGlow = (p) => { const c = rgb(p); return `rgba(${c.r},${c.g},${c.b},0.6)`; };
const colorSolid = (p) => { const c = rgb(p); return `rgb(${c.r},${c.g},${c.b})`; };
const intensityCls = (p) => (p <= 0 ? 'mp--off' : p < 40 ? 'mp--low' : p < 70 ? 'mp--mid' : 'mp--high');

/* ═══════════════════════════════════════════════════════
   Role-based coloring — GymVis-style muscle activation
   ═══════════════════════════════════════════════════════ */
const ROLE_COLORS = {
  target:     { r: 255, g: 45,  b: 149 },
  synergist:  { r: 0,   g: 240, b: 255 },
  stabilizer: { r: 57,  g: 255, b: 20  },
};
const ROLE_OPACITY  = { target: 0.82, synergist: 0.52, stabilizer: 0.35 };
const roleColorFill = (role) => { const c = ROLE_COLORS[role]; return c ? `rgba(${c.r},${c.g},${c.b},${ROLE_OPACITY[role]})` : colorFill(0); };
const roleColorGlow = (role) => { const c = ROLE_COLORS[role]; return c ? `rgba(${c.r},${c.g},${c.b},0.6)` : 'transparent'; };
const roleColorSolid = (role) => { const c = ROLE_COLORS[role]; return c ? `rgb(${c.r},${c.g},${c.b})` : 'rgb(100,150,220)'; };
const ROLE_LABELS = { target: 'TARGET', synergist: 'SYNERGIST', stabilizer: 'STABILIZER' };

/* ═══════════════════════════════════════════════════════
   SVG Definitions — gradients, filters, patterns
   ═══════════════════════════════════════════════════════ */
const Defs = () => (
  <defs>
    {/* Body fill gradient */}
    <linearGradient id="bodyFill" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor="rgba(160,190,255,0.08)" />
      <stop offset="50%" stopColor="rgba(140,170,240,0.05)" />
      <stop offset="100%" stopColor="rgba(120,150,220,0.03)" />
    </linearGradient>

    {/* 3D highlight */}
    <radialGradient id="hl3d" cx="0.42" cy="0.25" r="0.55">
      <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
    </radialGradient>

    {/* Rim lights */}
    <linearGradient id="rimL" x1="0" y1="0.2" x2="1" y2="0.5">
      <stop offset="0%" stopColor="rgba(0,200,255,0.14)" />
      <stop offset="50%" stopColor="rgba(0,200,255,0)" />
    </linearGradient>
    <linearGradient id="rimR" x1="1" y1="0.2" x2="0" y2="0.5">
      <stop offset="0%" stopColor="rgba(0,200,255,0.10)" />
      <stop offset="50%" stopColor="rgba(0,200,255,0)" />
    </linearGradient>

    {/* Scanner platform */}
    <radialGradient id="platGrad" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="rgba(0,180,255,0.16)" />
      <stop offset="50%" stopColor="rgba(0,180,255,0.05)" />
      <stop offset="100%" stopColor="rgba(0,180,255,0)" />
    </radialGradient>

    {/* Scan line */}
    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(0,240,255,0)" />
      <stop offset="40%" stopColor="rgba(0,240,255,0.12)" />
      <stop offset="50%" stopColor="rgba(0,240,255,0.28)" />
      <stop offset="60%" stopColor="rgba(0,240,255,0.12)" />
      <stop offset="100%" stopColor="rgba(0,240,255,0)" />
    </linearGradient>

    {/* Background dot grid */}
    <pattern id="gridDots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="0.4" fill="rgba(0,160,255,0.18)" />
    </pattern>

    {/* Muscle glow */}
    <filter id="mGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
      <feComposite in="b" in2="SourceGraphic" operator="over" />
    </filter>

    {/* Strong glow for high intensity */}
    <filter id="mGlowHi" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
      <feComposite in="SourceGraphic" in2="b" operator="over" />
    </filter>

    {/* Body ambient shadow */}
    <filter id="bodySh" x="-10%" y="-3%" width="120%" height="112%">
      <feDropShadow dx="0" dy="5" stdDeviation="12" floodColor="rgba(0,40,100,0.2)" />
    </filter>

    {/* Inner shadow for depth */}
    <filter id="innerD" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="shadow" />
      <feOffset dx="0" dy="1" />
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feFlood floodColor="rgba(0,0,0,0.25)" />
      <feComposite in2="SourceAlpha" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/* ═══════════════════════════════════════════════════════
   Muscle path (dual-layer: glow background + fill)
   ═══════════════════════════════════════════════════════ */
const MP = React.memo(({ id, d, intensity, role, onHover, hovered, transform }) => {
  const hasRole = !!role;
  const p = hasRole ? (role === 'target' ? 90 : role === 'synergist' ? 55 : 35) : (intensity || 0);
  const f = hasRole ? roleColorFill(role) : colorFill(p);
  const c = hasRole
    ? (role === 'target' ? 'mp--high mp--role-target' : role === 'synergist' ? 'mp--mid mp--role-syn' : 'mp--low mp--role-stab')
    : intensityCls(p);
  const isH = hovered === id;
  const rc = hasRole ? ROLE_COLORS[role] : null;
  const glw = hasRole ? roleColorGlow(role) : colorGlow(p);
  const glowSt = (hasRole || p > 0)
    ? { filter: `drop-shadow(0 0 ${hasRole ? 6 : Math.max(2, Math.round(p / 8))}px ${glw})` }
    : {};

  return (
    <g>
      {/* Glow under-layer for active muscles */}
      {(hasRole || p > 20) && (
        <path
          d={d}
          fill={glw}
          opacity={hasRole ? 0.35 : 0.25}
          filter={hasRole && role === 'target' ? 'url(#mGlowHi)' : 'url(#mGlow)'}
          transform={transform}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <path
        d={d}
        className={`mp ${c}${isH ? ' mp--hov' : ''}`}
        fill={f}
        stroke={hasRole ? `rgba(${rc.r},${rc.g},${rc.b},0.45)` : p > 0 ? `rgba(${rgb(p).r},${rgb(p).g},${rgb(p).b},0.35)` : 'rgba(130,170,230,0.1)'}
        strokeWidth={hasRole ? '0.7' : p > 0 ? '0.6' : '0.35'}
        strokeLinejoin="round"
        style={glowSt}
        transform={transform}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
      />
    </g>
  );
});
MP.displayName = 'MP';

/* ═══════════════════════════════════════════════════════
   Shared elements — platform, scan line, grid
   ═══════════════════════════════════════════════════════ */
const SharedBG = () => (
  <g>
    {/* Background dot grid */}
    <rect x="0" y="0" width="200" height="450" fill="url(#gridDots)" opacity="0.4" />

    {/* Scanner platform */}
    <ellipse cx="100" cy="442" rx="72" ry="8" fill="url(#platGrad)" />
    <ellipse cx="100" cy="442" rx="58" ry="6" fill="none" stroke="rgba(0,180,255,0.1)" strokeWidth="0.4" strokeDasharray="3,3" />
    <ellipse cx="100" cy="442" rx="44" ry="4.5" fill="none" stroke="rgba(0,180,255,0.07)" strokeWidth="0.3" strokeDasharray="2,4" />
    <ellipse cx="100" cy="442" rx="28" ry="3" fill="none" stroke="rgba(0,180,255,0.05)" strokeWidth="0.25" />

    {/* Scan line (animated via CSS) */}
    <rect x="24" y="0" width="152" height="10" fill="url(#scanGrad)" className="mhm__scan-line" rx="5" />
  </g>
);

/* ═══════════════════════════════════════════════════════
   FRONT BODY — anatomically detailed
   ═══════════════════════════════════════════════════════ */
const FrontBody = React.memo(({ data, roles, onHover, hovered }) => {
  const m = (id) => ({ id, intensity: data?.[id] || 0, role: roles?.[id] || null, onHover, hovered });

  return (
    <svg viewBox="0 0 200 450" className="mhm__svg" aria-label="Front body muscles">
      <Defs />
      <SharedBG />

      {/* ── Body silhouette ── */}
      <g className="mhm__body-base" filter="url(#bodySh)">
        {/* Head — smooth oval with defined jaw */}
        <ellipse cx="100" cy="28" rx="17" ry="22" fill="url(#bodyFill)" stroke="rgba(150,185,240,0.12)" strokeWidth="0.6" />
        <path d="M85 40 C89 49, 95 53, 100 53 C105 53, 111 49, 115 40" fill="none" stroke="rgba(150,185,240,0.08)" strokeWidth="0.4" />
        {/* Ears */}
        <ellipse cx="82" cy="28" rx="3" ry="5" fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.3" />
        <ellipse cx="118" cy="28" rx="3" ry="5" fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.3" />

        {/* Neck — tapered trapezoid */}
        <path d="M92 52 C92 55, 90 61, 89 67 L111 67 C110 61, 108 55, 108 52 Z"
              fill="rgba(160,190,255,0.045)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.4" />

        {/* Torso — smooth athletic V-taper */}
        <path d="M70 68 C60 72, 52 82, 48 98 C44 118, 46 146, 50 170 C54 188, 62 198, 74 204 C86 210, 96 210, 100 210 C104 210, 114 210, 126 204 C138 198, 146 188, 150 170 C154 146, 156 118, 152 98 C148 82, 140 72, 130 68 Z"
              fill="url(#bodyFill)" stroke="rgba(150,185,240,0.09)" strokeWidth="0.5" />

        {/* Hip region */}
        <path d="M76 202 C84 212, 94 216, 100 216 C106 216, 116 212, 124 202 L128 224 C118 236, 108 240, 100 240 C92 240, 82 236, 72 224 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />

        {/* Upper arms */}
        <path d="M48 82 C40 88, 34 102, 32 120 C30 138, 32 150, 38 158 L50 158 C52 148, 56 134, 56 118 C56 102, 54 90, 50 82 Z"
              fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />
        <path d="M152 82 C160 88, 166 102, 168 120 C170 138, 168 150, 162 158 L150 158 C148 148, 144 134, 144 118 C144 102, 146 90, 150 82 Z"
              fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />

        {/* Forearms */}
        <path d="M38 158 C34 168, 30 186, 28 204 C26 218, 28 228, 34 232 L44 230 C46 222, 48 206, 48 190 C48 176, 46 166, 44 158 Z"
              fill="rgba(160,190,255,0.035)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.35" />
        <path d="M162 158 C166 168, 170 186, 172 204 C174 218, 172 228, 166 232 L156 230 C154 222, 152 206, 152 190 C152 176, 154 166, 156 158 Z"
              fill="rgba(160,190,255,0.035)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.35" />

        {/* Hands — contoured */}
        <path d="M28 232 C25 234, 22 240, 24 247 C26 252, 30 254, 34 252 C38 248, 39 242, 37 236 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.3" />
        <path d="M172 232 C175 234, 178 240, 176 247 C174 252, 170 254, 166 252 C162 248, 161 242, 163 236 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.3" />

        {/* Upper legs */}
        <path d="M76 222 C70 242, 66 276, 66 306 C66 322, 70 330, 78 334 L90 334 C92 326, 94 316, 94 304 C94 274, 92 246, 90 222 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.4" />
        <path d="M124 222 C130 242, 134 276, 134 306 C134 322, 130 330, 122 334 L110 334 C108 326, 106 316, 106 304 C106 274, 108 246, 110 222 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.4" />

        {/* Lower legs */}
        <path d="M76 338 C70 354, 68 376, 70 402 C72 414, 76 420, 82 422 L88 422 C90 416, 90 404, 88 390 C86 372, 86 356, 84 338 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.35" />
        <path d="M124 338 C130 354, 132 376, 130 402 C128 414, 124 420, 118 422 L112 422 C110 416, 110 404, 112 390 C114 372, 114 356, 116 338 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.35" />

        {/* Feet */}
        <path d="M76 422 C72 424, 66 428, 66 432 C66 435, 72 437, 80 437 C86 437, 90 435, 90 432 C90 428, 86 424, 82 422 Z"
              fill="rgba(160,190,255,0.02)" stroke="rgba(150,185,240,0.04)" strokeWidth="0.3" />
        <path d="M124 422 C128 424, 134 428, 134 432 C134 435, 128 437, 120 437 C114 437, 110 435, 110 432 C110 428, 114 424, 118 422 Z"
              fill="rgba(160,190,255,0.02)" stroke="rgba(150,185,240,0.04)" strokeWidth="0.3" />
      </g>

      {/* 3D highlight */}
      <ellipse cx="95" cy="108" rx="34" ry="55" fill="url(#hl3d)" opacity="0.5" />

      {/* Rim lights */}
      <rect x="28" y="68" width="18" height="170" fill="url(#rimL)" opacity="0.45" rx="9" />
      <rect x="154" y="68" width="18" height="170" fill="url(#rimR)" opacity="0.35" rx="9" />

      {/* ── Anatomical detail lines ── */}
      <g className="mhm__details" opacity="0.14" stroke="rgba(170,200,255,1)" strokeWidth="0.3" fill="none">
        {/* Linea alba */}
        <line x1="100" y1="84" x2="100" y2="196" />
        {/* Tendinous ab intersections */}
        <path d="M91 134 Q100 136, 109 134" />
        <path d="M91 154 Q100 156, 109 154" />
        <path d="M91 174 Q100 176, 109 174" />
        {/* Pec lower borders */}
        <path d="M60 106 C70 116, 86 122, 98 120" />
        <path d="M140 106 C130 116, 114 122, 102 120" />
        {/* V-cut (inguinal crease) */}
        <path d="M78 192 C86 202, 94 208, 100 210" />
        <path d="M122 192 C114 202, 106 208, 100 210" />
        {/* Kneecaps */}
        <ellipse cx="80" cy="332" rx="6" ry="4" />
        <ellipse cx="120" cy="332" rx="6" ry="4" />
        {/* Serratus hints */}
        <path d="M66 112 L76 116" />
        <path d="M66 118 L76 122" />
        <path d="M66 124 L76 128" />
        <path d="M134 112 L124 116" />
        <path d="M134 118 L124 122" />
        <path d="M134 124 L124 128" />
        {/* Collar bones */}
        <path d="M92 70 C86 72, 76 76, 70 80" />
        <path d="M108 70 C114 72, 124 76, 130 80" />
        {/* Elbow creases */}
        <path d="M40 156 Q44 160, 48 156" />
        <path d="M160 156 Q156 160, 152 156" />
        {/* Navel */}
        <circle cx="100" cy="178" r="2" />
      </g>

      {/* ══ MUSCLES ══ */}

      {/* Deltoids */}
      <MP {...m('shoulders')} d="M70 70 C64 72, 54 76, 48 84 C42 92, 40 100, 44 104 C46 106, 50 104, 54 100 C58 94, 64 82, 70 76 Z" />
      <MP {...m('shoulders')} d="M130 70 C136 72, 146 76, 152 84 C158 92, 160 100, 156 104 C154 106, 150 104, 146 100 C142 94, 136 82, 130 76 Z" />

      {/* Pectorals */}
      <MP {...m('chest')} d="M98 84 C92 80, 78 78, 68 82 C60 86, 54 96, 54 106 C54 114, 60 120, 70 124 C80 128, 92 126, 98 122 Z" />
      <MP {...m('chest')} d="M102 84 C108 80, 122 78, 132 82 C140 86, 146 96, 146 106 C146 114, 140 120, 130 124 C120 128, 108 126, 102 122 Z" />

      {/* Biceps */}
      <MP {...m('biceps')} d="M52 98 C48 104, 44 116, 42 130 C40 142, 42 152, 46 156 L52 156 C54 148, 56 138, 56 126 C56 112, 54 104, 52 98 Z" />
      <MP {...m('biceps')} d="M148 98 C152 104, 156 116, 158 130 C160 142, 158 152, 154 156 L148 156 C146 148, 144 138, 144 126 C144 112, 146 104, 148 98 Z" />

      {/* Triceps (front view — lateral strip) */}
      <MP {...m('triceps')} d="M42 96 C36 106, 34 120, 34 136 C34 148, 36 154, 40 158 L44 158 C44 150, 44 136, 44 120 C44 108, 44 100, 42 96 Z" />
      <MP {...m('triceps')} d="M158 96 C164 106, 166 120, 166 136 C166 148, 164 154, 160 158 L156 158 C156 150, 156 136, 156 120 C156 108, 156 100, 158 96 Z" />

      {/* Forearms */}
      <MP {...m('forearms')} d="M42 158 C38 166, 34 180, 32 196 C30 210, 32 222, 36 226 L44 224 C46 216, 48 202, 48 188 C48 174, 46 164, 44 158 Z" />
      <MP {...m('forearms')} d="M158 158 C162 166, 166 180, 168 196 C170 210, 168 222, 164 226 L156 224 C154 216, 152 202, 152 188 C152 174, 154 164, 156 158 Z" />

      {/* Abs — upper */}
      <MP {...m('abs')} d="M91 122 L91 144 C95 146, 98 147, 100 147 C102 147, 105 146, 109 144 L109 122 C106 126, 102 127, 100 127 C98 127, 94 126, 91 122 Z" />
      {/* Abs — middle */}
      <MP {...m('abs')} d="M91 148 L91 170 C95 172, 98 173, 100 173 C102 173, 105 172, 109 170 L109 148 C106 150, 102 151, 100 151 C98 151, 94 150, 91 148 Z" />
      {/* Abs — lower */}
      <MP {...m('abs')} d="M91 174 L91 194 C95 198, 98 199, 100 199 C102 199, 105 198, 109 194 L109 174 C106 176, 102 177, 100 177 C98 177, 94 176, 91 174 Z" />

      {/* Obliques */}
      <MP {...m('obliques')} d="M76 116 C72 132, 68 154, 66 176 C64 190, 68 200, 74 204 L82 198 C84 186, 84 164, 84 148 C84 132, 82 122, 80 116 Z" />
      <MP {...m('obliques')} d="M124 116 C128 132, 132 154, 134 176 C136 190, 132 200, 126 204 L118 198 C116 186, 116 164, 116 148 C116 132, 118 122, 120 116 Z" />

      {/* Quadriceps */}
      <MP {...m('quads')} d="M78 224 C72 242, 68 272, 68 302 C68 318, 72 328, 80 332 L90 332 C92 324, 94 314, 94 300 C94 270, 92 246, 90 226 Z" />
      <MP {...m('quads')} d="M122 224 C128 242, 132 272, 132 302 C132 318, 128 328, 120 332 L110 332 C108 324, 106 314, 106 300 C106 270, 108 246, 110 226 Z" />

      {/* Calves */}
      <MP {...m('calves')} d="M76 340 C72 352, 70 370, 72 396 C74 412, 78 420, 82 422 L88 422 C90 414, 90 402, 88 386 C86 368, 86 354, 84 340 Z" />
      <MP {...m('calves')} d="M124 340 C128 352, 130 370, 128 396 C126 412, 122 420, 118 422 L112 422 C110 414, 110 402, 112 386 C114 368, 114 354, 116 340 Z" />

      {/* Hovered muscle label */}
      {hovered && (
        <g>
          <rect x="50" y="2" width="100" height="14" rx="7" fill="rgba(0,20,40,0.75)" stroke={roles?.[hovered] ? 'rgba(255,255,255,0.25)' : 'rgba(0,180,255,0.3)'} strokeWidth="0.5" />
          <text x="100" y="12" textAnchor="middle" className="mhm__hover-text" fill="rgba(200,225,255,0.95)" fontSize="7" fontWeight="600" letterSpacing="0.8">
            {hovered.toUpperCase()} — {roles?.[hovered] ? ROLE_LABELS[roles[hovered]] : `${data?.[hovered] || 0}%`}
          </text>
        </g>
      )}
    </svg>
  );
});
FrontBody.displayName = 'FrontBody';

/* ═══════════════════════════════════════════════════════
   BACK BODY — anatomically detailed
   ═══════════════════════════════════════════════════════ */
const BackBody = React.memo(({ data, roles, onHover, hovered }) => {
  const m = (id) => ({ id, intensity: data?.[id] || 0, role: roles?.[id] || null, onHover, hovered });

  return (
    <svg viewBox="0 0 200 450" className="mhm__svg" aria-label="Back body muscles">
      <Defs />
      <SharedBG />

      {/* ── Body silhouette (back view) ── */}
      <g className="mhm__body-base" filter="url(#bodySh)">
        {/* Head */}
        <ellipse cx="100" cy="28" rx="17" ry="22" fill="url(#bodyFill)" stroke="rgba(150,185,240,0.12)" strokeWidth="0.6" />
        {/* Ears */}
        <ellipse cx="82" cy="28" rx="3" ry="5" fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.3" />
        <ellipse cx="118" cy="28" rx="3" ry="5" fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.3" />

        {/* Neck */}
        <path d="M92 50 C92 54, 90 60, 89 67 L111 67 C110 60, 108 54, 108 50 Z"
              fill="rgba(160,190,255,0.045)" stroke="rgba(150,185,240,0.08)" strokeWidth="0.4" />

        {/* Torso (same shape as front) */}
        <path d="M70 68 C60 72, 52 82, 48 98 C44 118, 46 146, 50 170 C54 188, 62 198, 74 204 C86 210, 96 210, 100 210 C104 210, 114 210, 126 204 C138 198, 146 188, 150 170 C154 146, 156 118, 152 98 C148 82, 140 72, 130 68 Z"
              fill="url(#bodyFill)" stroke="rgba(150,185,240,0.09)" strokeWidth="0.5" />

        {/* Hip */}
        <path d="M76 202 C84 212, 94 216, 100 216 C106 216, 116 212, 124 202 L128 224 C118 236, 108 240, 100 240 C92 240, 82 236, 72 224 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />

        {/* Upper arms */}
        <path d="M48 82 C40 88, 34 102, 32 120 C30 138, 32 150, 38 158 L50 158 C52 148, 56 134, 56 118 C56 102, 54 90, 50 82 Z"
              fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />
        <path d="M152 82 C160 88, 166 102, 168 120 C170 138, 168 150, 162 158 L150 158 C148 148, 144 134, 144 118 C144 102, 146 90, 150 82 Z"
              fill="rgba(160,190,255,0.04)" stroke="rgba(150,185,240,0.07)" strokeWidth="0.4" />

        {/* Forearms */}
        <path d="M38 158 C34 168, 30 186, 28 204 C26 218, 28 228, 34 232 L44 230 C46 222, 48 206, 48 190 C48 176, 46 166, 44 158 Z"
              fill="rgba(160,190,255,0.035)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.35" />
        <path d="M162 158 C166 168, 170 186, 172 204 C174 218, 172 228, 166 232 L156 230 C154 222, 152 206, 152 190 C152 176, 154 166, 156 158 Z"
              fill="rgba(160,190,255,0.035)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.35" />

        {/* Hands */}
        <path d="M28 232 C25 234, 22 240, 24 247 C26 252, 30 254, 34 252 C38 248, 39 242, 37 236 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.3" />
        <path d="M172 232 C175 234, 178 240, 176 247 C174 252, 170 254, 166 252 C162 248, 161 242, 163 236 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.3" />

        {/* Upper legs */}
        <path d="M76 222 C70 242, 66 276, 66 306 C66 322, 70 330, 78 334 L90 334 C92 326, 94 316, 94 304 C94 274, 92 246, 90 222 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.4" />
        <path d="M124 222 C130 242, 134 276, 134 306 C134 322, 130 330, 122 334 L110 334 C108 326, 106 316, 106 304 C106 274, 108 246, 110 222 Z"
              fill="rgba(160,190,255,0.03)" stroke="rgba(150,185,240,0.06)" strokeWidth="0.4" />

        {/* Lower legs */}
        <path d="M76 338 C70 354, 68 376, 70 402 C72 414, 76 420, 82 422 L88 422 C90 416, 90 404, 88 390 C86 372, 86 356, 84 338 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.35" />
        <path d="M124 338 C130 354, 132 376, 130 402 C128 414, 124 420, 118 422 L112 422 C110 416, 110 404, 112 390 C114 372, 114 356, 116 338 Z"
              fill="rgba(160,190,255,0.025)" stroke="rgba(150,185,240,0.05)" strokeWidth="0.35" />

        {/* Feet */}
        <path d="M76 422 C72 424, 66 428, 66 432 C66 435, 72 437, 80 437 C86 437, 90 435, 90 432 C90 428, 86 424, 82 422 Z"
              fill="rgba(160,190,255,0.02)" stroke="rgba(150,185,240,0.04)" strokeWidth="0.3" />
        <path d="M124 422 C128 424, 134 428, 134 432 C134 435, 128 437, 120 437 C114 437, 110 435, 110 432 C110 428, 114 424, 118 422 Z"
              fill="rgba(160,190,255,0.02)" stroke="rgba(150,185,240,0.04)" strokeWidth="0.3" />
      </g>

      {/* 3D highlight */}
      <ellipse cx="105" cy="110" rx="32" ry="52" fill="url(#hl3d)" opacity="0.4" />

      {/* Rim lights */}
      <rect x="28" y="68" width="18" height="170" fill="url(#rimL)" opacity="0.4" rx="9" />
      <rect x="154" y="68" width="18" height="170" fill="url(#rimR)" opacity="0.3" rx="9" />

      {/* ── Detail lines (back view) ── */}
      <g className="mhm__details" opacity="0.14" stroke="rgba(170,200,255,1)" strokeWidth="0.3" fill="none">
        {/* Spine */}
        <line x1="100" y1="54" x2="100" y2="200" />
        {/* Spine bumps */}
        <circle cx="100" cy="80" r="1" />
        <circle cx="100" cy="96" r="1" />
        <circle cx="100" cy="112" r="1" />
        <circle cx="100" cy="128" r="1" />
        <circle cx="100" cy="144" r="1" />
        <circle cx="100" cy="160" r="1" />
        <circle cx="100" cy="176" r="1" />
        {/* Scapula outlines */}
        <path d="M80 82 C76 90, 76 104, 82 114 L88 108 C86 100, 86 90, 84 82 Z" />
        <path d="M120 82 C124 90, 124 104, 118 114 L112 108 C114 100, 114 90, 116 82 Z" />
        {/* Glute crease */}
        <path d="M80 226 Q100 234, 120 226" />
        {/* Elbow creases */}
        <path d="M40 156 Q44 160, 48 156" />
        <path d="M160 156 Q156 160, 152 156" />
        {/* Back of knee */}
        <path d="M72 332 Q80 338, 88 332" />
        <path d="M128 332 Q120 338, 112 332" />
      </g>

      {/* ══ MUSCLES ══ */}

      {/* Rear Deltoids */}
      <MP {...m('shoulders')} d="M70 70 C64 72, 54 78, 48 86 C42 94, 42 102, 46 106 C48 108, 52 106, 56 100 C60 92, 66 82, 70 76 Z" />
      <MP {...m('shoulders')} d="M130 70 C136 72, 146 78, 152 86 C158 94, 158 102, 154 106 C152 108, 148 106, 144 100 C140 92, 134 82, 130 76 Z" />

      {/* Trapezius (upper back) */}
      <MP {...m('back')} d="M84 68 C90 66, 96 66, 100 66 C104 66, 110 66, 116 68 L114 96 C108 100, 104 100, 100 100 C96 100, 92 100, 86 96 Z" />

      {/* Lats */}
      <MP {...m('back')} d="M76 92 C70 104, 66 126, 66 150 C66 168, 68 178, 76 184 L86 178 C86 162, 86 140, 86 120 C86 106, 82 96, 78 92 Z" />
      <MP {...m('back')} d="M124 92 C130 104, 134 126, 134 150 C134 168, 132 178, 124 184 L114 178 C114 162, 114 140, 114 120 C114 106, 118 96, 122 92 Z" />

      {/* Mid / lower back (erectors) */}
      <MP {...m('back')} d="M86 100 C92 98, 96 98, 100 98 C104 98, 108 98, 114 100 L114 182 C108 186, 104 186, 100 186 C96 186, 92 186, 86 182 Z" />

      {/* Triceps (back view — full) */}
      <MP {...m('triceps')} d="M52 90 C44 98, 38 114, 36 132 C34 148, 36 156, 42 160 L52 160 C54 152, 56 138, 56 122 C56 108, 54 98, 52 92 Z" />
      <MP {...m('triceps')} d="M148 90 C156 98, 162 114, 164 132 C166 148, 164 156, 158 160 L148 160 C146 152, 144 138, 144 122 C144 108, 146 98, 148 92 Z" />

      {/* Forearms (back) */}
      <MP {...m('forearms')} d="M42 160 C38 168, 34 182, 32 198 C30 212, 32 222, 36 226 L44 224 C46 216, 48 202, 48 188 C48 174, 46 164, 44 160 Z" />
      <MP {...m('forearms')} d="M158 160 C162 168, 166 182, 168 198 C170 212, 168 222, 164 226 L156 224 C154 216, 152 202, 152 188 C152 174, 154 164, 156 160 Z" />

      {/* Glutes */}
      <MP {...m('glutes')} d="M76 196 C70 204, 68 216, 70 226 C72 234, 82 238, 92 238 L100 238 L100 200 C90 198, 82 196, 76 196 Z" />
      <MP {...m('glutes')} d="M124 196 C130 204, 132 216, 130 226 C128 234, 118 238, 108 238 L100 238 L100 200 C110 198, 118 196, 124 196 Z" />

      {/* Hamstrings */}
      <MP {...m('hamstrings')} d="M76 238 C70 256, 68 282, 68 310 C70 324, 76 330, 82 332 L90 332 C92 322, 92 306, 92 286 C92 262, 90 246, 88 238 Z" />
      <MP {...m('hamstrings')} d="M124 238 C130 256, 132 282, 132 310 C130 324, 124 330, 118 332 L110 332 C108 322, 108 306, 108 286 C108 262, 110 246, 112 238 Z" />

      {/* Calves (back — prominent gastrocnemius) */}
      <MP {...m('calves')} d="M74 336 C68 346, 66 364, 68 392 C70 408, 76 416, 82 420 L88 420 C92 412, 92 398, 90 384 C88 366, 86 350, 84 336 Z" />
      <MP {...m('calves')} d="M126 336 C132 346, 134 364, 132 392 C130 408, 124 416, 118 420 L112 420 C108 412, 108 398, 110 384 C112 366, 114 350, 116 336 Z" />

      {/* Hovered muscle label */}
      {hovered && (
        <g>
          <rect x="50" y="2" width="100" height="14" rx="7" fill="rgba(0,20,40,0.75)" stroke={roles?.[hovered] ? 'rgba(255,255,255,0.25)' : 'rgba(0,180,255,0.3)'} strokeWidth="0.5" />
          <text x="100" y="12" textAnchor="middle" className="mhm__hover-text" fill="rgba(200,225,255,0.95)" fontSize="7" fontWeight="600" letterSpacing="0.8">
            {hovered.toUpperCase()} — {roles?.[hovered] ? ROLE_LABELS[roles[hovered]] : `${data?.[hovered] || 0}%`}
          </text>
        </g>
      )}
    </svg>
  );
});
BackBody.displayName = 'BackBody';

/* ═══════════════════════════════════════════════════════
   Muscle list
   ═══════════════════════════════════════════════════════ */
const ALL_MUSCLES = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'abs', 'obliques', 'quads', 'hamstrings', 'glutes', 'calves',
];

const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms',
  abs: 'Abs', obliques: 'Obliques', quads: 'Quads',
  hamstrings: 'Hamstrings', glutes: 'Glutes', calves: 'Calves',
};

/* ═══════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════ */
const MuscleHeatMap = React.memo(({ data, roles }) => {
  const [view, setView] = useState('front');
  const [hovered, setHovered] = useState(null);
  const handleHover = useCallback((id) => setHovered(id), []);
  const hasRoles = roles && Object.keys(roles).length > 0;

  const muscles = useMemo(() =>
    ALL_MUSCLES.map(m => {
      const r = roles?.[m] || null;
      const pct = data?.[m] || 0;
      return {
        id: m,
        label: MUSCLE_LABELS[m],
        pct,
        role: r,
        color: r ? roleColorFill(r) : colorFill(pct),
        glowColor: r ? roleColorGlow(r) : colorGlow(pct),
        solidColor: r ? roleColorSolid(r) : colorSolid(pct),
        active: r ? true : pct > 0,
      };
    }),
    [data, roles]
  );

  return (
    <div className="mhm">
      {/* View toggle */}
      <div className="mhm__toggle">
        <button
          className={`mhm__toggle-btn${view === 'front' ? ' mhm__toggle-btn--on' : ''}`}
          onClick={() => setView('front')}
        >
          <span className="mhm__toggle-icon">◉</span> Front
        </button>
        <button
          className={`mhm__toggle-btn${view === 'back' ? ' mhm__toggle-btn--on' : ''}`}
          onClick={() => setView('back')}
        >
          <span className="mhm__toggle-icon">◎</span> Back
        </button>
        <div className={`mhm__toggle-slider ${view === 'back' ? 'mhm__toggle-slider--right' : ''}`} />
      </div>

      {/* Hovered muscle info bar */}
      <div className={`mhm__info-bar${hovered ? ' mhm__info-bar--show' : ''}`}>
        {hovered && (
          <>
            <span className="mhm__info-dot" style={{ background: roles?.[hovered] ? roleColorSolid(roles[hovered]) : colorSolid(data?.[hovered] || 0), boxShadow: `0 0 8px ${roles?.[hovered] ? roleColorGlow(roles[hovered]) : colorGlow(data?.[hovered] || 0)}` }} />
            <span className="mhm__info-name">{MUSCLE_LABELS[hovered] || hovered}</span>
            <span className="mhm__info-pct" style={{ color: roles?.[hovered] ? roleColorSolid(roles[hovered]) : colorSolid(data?.[hovered] || 0) }}>
              {roles?.[hovered] ? ROLE_LABELS[roles[hovered]] : `${data?.[hovered] || 0}%`}
            </span>
          </>
        )}
      </div>

      {/* SVG body */}
      <div className="mhm__body">
        {view === 'front'
          ? <FrontBody data={data} roles={roles} onHover={handleHover} hovered={hovered} />
          : <BackBody data={data} roles={roles} onHover={handleHover} hovered={hovered} />
        }
      </div>

      {/* Intensity legend (heatmap mode) / Role legend (exercise mode) */}
      {hasRoles ? (
        <div className="mhm__role-legend">
          <div className="mhm__role-pill"><span className="mhm__role-dot" style={{ background: '#ff2d95', boxShadow: '0 0 8px rgba(255,45,149,0.4)' }} />Target</div>
          <div className="mhm__role-pill"><span className="mhm__role-dot" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0,240,255,0.4)' }} />Synergist</div>
          <div className="mhm__role-pill"><span className="mhm__role-dot" style={{ background: '#39ff14', boxShadow: '0 0 8px rgba(57,255,20,0.4)' }} />Stabilizer</div>
        </div>
      ) : (
        <div className="mhm__legend">
          <span className="mhm__legend-label">NONE</span>
          <div className="mhm__legend-bar">
            <div className="mhm__legend-fill" />
          </div>
          <span className="mhm__legend-label">MAX</span>
        </div>
      )}

      {/* Muscle grid */}
      <div className="mhm__grid">
        {muscles.map(({ id, label, pct, role, color, glowColor, solidColor, active }) => (
          <div
            className={`mhm__muscle-card${hovered === id ? ' mhm__muscle-card--hover' : ''}${active ? ' mhm__muscle-card--active' : ''}${role ? ` mhm__muscle-card--${role}` : ''}`}
            key={id}
            onMouseEnter={() => handleHover(id)}
            onMouseLeave={() => handleHover(null)}
          >
            <span className="mhm__muscle-dot" style={{ background: active ? solidColor : 'rgba(100,140,200,0.2)', boxShadow: active ? `0 0 6px ${glowColor}` : 'none' }} />
            <span className="mhm__muscle-name">{label}</span>
            {role ? (
              <span className="mhm__muscle-role" style={{ color: solidColor }}>{ROLE_LABELS[role]}</span>
            ) : (
              <>
                <div className="mhm__muscle-bar">
                  <div className="mhm__muscle-bar-fill" style={{ width: `${pct}%`, background: pct > 0 ? `linear-gradient(90deg, ${solidColor}, ${colorSolid(Math.min(pct + 20, 100))})` : 'transparent' }} />
                </div>
                <span className="mhm__muscle-val" style={{ color: pct > 0 ? solidColor : 'var(--text-muted)' }}>{pct}%</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

MuscleHeatMap.displayName = 'MuscleHeatMap';
export default MuscleHeatMap;
