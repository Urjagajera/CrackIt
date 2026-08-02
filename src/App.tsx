import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers & Components
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resume from './pages/Resume';
import JobMatch from './pages/JobMatch';
import ProjectIntelligence from './pages/ProjectIntelligence';
import InterviewSetup from './pages/InterviewSetup';
import InterviewScreen from './pages/InterviewScreen';
import InterviewReplay from './pages/InterviewReplay';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ToastProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
            <Route path="/login" element={<ErrorBoundary><Login onLogin={handleLogin} /></ErrorBoundary>} />
            <Route path="/signup" element={<ErrorBoundary><Signup onLogin={handleLogin} /></ErrorBoundary>} />

            {/* Authenticated routes */}
            <Route element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
              <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="/resume" element={<ErrorBoundary><Resume /></ErrorBoundary>} />
              <Route path="/job-match" element={<ErrorBoundary><JobMatch /></ErrorBoundary>} />
              <Route path="/project-intelligence" element={<ErrorBoundary><ProjectIntelligence /></ErrorBoundary>} />
              <Route path="/interview-setup" element={<ErrorBoundary><InterviewSetup /></ErrorBoundary>} />
              <Route path="/interview" element={<ErrorBoundary><InterviewScreen /></ErrorBoundary>} />
              <Route path="/interview-replay/:id" element={<ErrorBoundary><InterviewReplay /></ErrorBoundary>} />
              <Route path="/reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
              <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
              <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ToastProvider>
  );
}
