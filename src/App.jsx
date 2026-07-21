import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Navigation
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resume from './pages/Resume';
import JobMatch from './pages/JobMatch';
import ProjectIntel from './pages/ProjectIntel';
import InterviewSetup from './pages/InterviewSetup';
import InterviewScreen from './pages/InterviewScreen';
import InterviewReplay from './pages/InterviewReplay';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for direct preview, toggleable via login/logout

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes (No Sidebar/Layout) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

        {/* Authenticated routes (Persistent Sidebar/Layout wrapper) */}
        <Route element={<Layout onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/job-match" element={<JobMatch />} />
          <Route path="/project-intelligence" element={<ProjectIntel />} />
          <Route path="/interview-setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewScreen />} />
          <Route path="/interview-replay/:id" element={<InterviewReplay />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
