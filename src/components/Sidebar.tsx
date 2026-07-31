import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { name: 'Interview Replay', path: '/interview-replay/1', icon: 'play_circle' },
    { name: 'Mock Setup', path: '/interview-setup', icon: 'tune' },
    { name: 'Project Intel', path: '/project-intelligence', icon: 'neurology' },
    { name: 'Job Match (ATS)', path: '/job-match', icon: 'work' },
    { name: 'Resume Intel', path: '/resume', icon: 'description' },
    { name: 'Reports', path: '/reports', icon: 'analytics' },
    { name: 'Analytics', path: '/analytics', icon: 'equalizer' },
    { name: 'Profile', path: '/profile', icon: 'account_circle' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
      showToast('Logged out successfully.', 'info');
      navigate('/login');
    } catch (err: any) {
      showToast(err.message || 'Logout failed', 'error');
    }
  };

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-surface-variant/30 flex flex-col justify-between p-4 fixed top-0 left-0 h-screen shrink-0 text-left z-40">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold font-headline-md shadow-md">
            C
          </div>
          <div>
            <span className="font-headline-md font-extrabold text-primary text-lg tracking-tight block">CrackIt</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">AI Interview Coach</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-label-md transition-all text-sm ${
                  isActive
                    ? 'bg-primary-fixed/20 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-surface-variant/50 space-y-1">
        <button
          onClick={() => navigate('/interview-setup')}
          className="w-full mb-4 bg-secondary text-on-secondary py-3 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Start Practice</span>
        </button>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showToast('Help Center: Contact support at support@crackit.ai', 'info');
          }}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-xl transition-all text-sm font-label-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
        
        <a
          href="#"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 rounded-xl transition-all text-sm font-label-md focus:outline-none focus:ring-1 focus:ring-error"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Log Out</span>
        </a>
      </div>
    </aside>
  );
}
