import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ onLogout }) {
  const location = useLocation();
  const hideSidebar = location.pathname === '/interview';

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {!hideSidebar && <Sidebar onLogout={onLogout} />}
      <div className={hideSidebar ? "min-h-screen flex flex-col" : "md:ml-64 min-h-screen flex flex-col"}>
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

