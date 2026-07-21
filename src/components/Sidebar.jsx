import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Interviews',
      path: '/reports',
      icon: 'mic_external_on'
    },
    {
      name: 'Resume Match',
      path: '/resume',
      icon: 'description',
      // Highlight if on either resume or job-match
      checkActive: (path) => path === '/resume' || path === '/job-match'
    },
    {
      name: 'Project Intel',
      path: '/project-intelligence',
      icon: 'psychology'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: 'leaderboard'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings'
    }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-dim flex flex-col p-base space-y-2 z-50 border-r border-surface-variant/30">
      <div className="px-4 py-6 flex flex-col items-center md:items-start mb-4">
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">CrackIt AI</h1>
        <p className="text-on-surface-variant text-label-sm mt-1 uppercase tracking-widest opacity-70">Interview Mentor</p>
      </div>
      
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const active = item.checkActive ? item.checkActive(location.pathname) : isActive(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive: linkActive }) => {
                const isItemActive = item.checkActive ? item.checkActive(location.pathname) : linkActive;
                return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-label-md ${
                  isItemActive
                    ? 'bg-primary-fixed text-on-primary-fixed font-bold translate-x-1'
                    : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
                }`;
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-surface-variant/50 space-y-1">
        <button
          onClick={() => navigate('/interview-setup')}
          className="w-full mb-4 bg-secondary text-on-secondary py-3 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Start Practice</span>
        </button>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('Help Center: You can contact support at support@crackit.ai');
          }}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-xl transition-all text-sm font-label-md"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
        
        <a
          href="#"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 rounded-xl transition-all text-sm font-label-md"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
