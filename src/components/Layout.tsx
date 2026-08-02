import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ onLogout }) {
  const location = useLocation();
  const hideSidebar = location.pathname === '/interview';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {!hideSidebar && (
        <>
          {/* Mobile Top Navbar */}
          <header className="md:hidden sticky top-0 z-30 flex justify-between items-center px-6 py-3 bg-surface border-b border-surface-variant/20 shadow-sm">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 -ml-2 text-on-surface hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <Link to="/dashboard" className="text-xl font-headline-md font-extrabold text-primary tracking-tight">CrackIt</Link>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-primary/20">C</div>
          </header>

          {/* Backdrop overlay for mobile menu */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <Sidebar
            onLogout={onLogout}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}
      
      <div className={hideSidebar ? "min-h-screen flex flex-col flex-grow" : "md:ml-64 min-h-screen flex flex-col flex-grow"}>
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


