import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface PublicNavbarProps {
  className?: string;
}

export default function PublicNavbar({ className = '' }: PublicNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const renderNavLink = (hash: string, label: string) => {
    const commonClasses = "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded";
    if (isLanding) {
      return (
        <a className={commonClasses} href={hash}>
          {label}
        </a>
      );
    }
    return (
      <Link className={commonClasses} to={`/${hash}`}>
        {label}
      </Link>
    );
  };

  return (
    <header className={`z-50 flex justify-between items-center px-6 py-3 rounded-full w-[95%] max-w-container-max bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(65,81,187,0.08)] ${className}`}>
      <div className="flex items-center gap-2">
        <Link to="/" className="text-headline-md font-headline-md font-extrabold text-primary">CrackIt</Link>
      </div>
      
      <nav className="hidden md:flex gap-8 items-center">
        {renderNavLink('#features', 'Features')}
        {renderNavLink('#how-it-works', 'How It Works')}
        {renderNavLink('#faq', 'FAQ')}
      </nav>
      
      <div className="flex items-center gap-4">
        {location.pathname === '/login' && (
          <>
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">New to CrackIt?</span>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-6 py-2.5 bg-primary-fixed text-on-primary-fixed rounded-full font-label-md text-label-md hover:scale-105 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Sign Up
            </button>
          </>
        )}
        
        {location.pathname === '/signup' && (
          <button 
            onClick={() => navigate('/login')} 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-4 py-2 transition-all active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            Login
          </button>
        )}
        
        {isLanding && (
          <>
            <button
              onClick={() => navigate('/login')}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:scale-105 transition-transform active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
