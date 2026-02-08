import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Apple, Dumbbell, BarChart2, User } from 'lucide-react';
import './Navbar.css';

const Navbar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/nutrition', icon: Apple, label: 'Nutrition' },
    { to: '/workout', icon: Dumbbell, label: 'Workout' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {links.map(link => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <button
              key={link.to}
              className={'navbar__item' + (active ? ' navbar__item--active' : '')}
              onClick={() => navigate(link.to)}
            >
              <span className="navbar__icon-wrap">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {active && <span className="navbar__active-dot" />}
              </span>
              <span className="navbar__label">{link.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
