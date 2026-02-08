import React, { useEffect, useState } from 'react';
import './MacroRing.css';

const MacroRing = React.memo(({ label, current, goal, color, size = 120, isMain = false }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOffset(offset), 100);
    return () => clearTimeout(timer);
  }, [offset]);

  return (
    <div className="macro-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          transform="rotate(-90 50 50)"
          className="macro-ring__progress"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x="50" y="46" textAnchor="middle" className="macro-ring__value" fontSize={isMain ? '11' : '10'}>
          {Math.round(current)}
        </text>
        <text x="50" y="57" textAnchor="middle" className="macro-ring__label" fontSize="6">
          {label}
        </text>
        <text x="50" y="66" textAnchor="middle" className="macro-ring__goal" fontSize="5">
          / {goal}{label === 'Calories' ? ' kcal' : 'g'}
        </text>
      </svg>
    </div>
  );
});

MacroRing.displayName = 'MacroRing';

export default MacroRing;
