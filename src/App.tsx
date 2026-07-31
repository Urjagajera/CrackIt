import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers & Components
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import ProjectIntel from './pages/ProjectIntel';
import InterviewSetup from './pages/InterviewSetup';
import InterviewScreen from './pages/InterviewScreen';
import InterviewReplay from './pages/InterviewReplay';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-md text-on-surface-variant">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
      <Route path="/login" element={!isAuthenticated ? <ErrorBoundary><Login /></ErrorBoundary> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <ErrorBoundary><Signup /></ErrorBoundary> : <Navigate to="/dashboard" replace />} />

      {/* Authenticated routes */}
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
        <Route path="/resume" element={<ErrorBoundary><Resume /></ErrorBoundary>} />
        <Route path="/job-match" element={<ErrorBoundary><JobMatch /></ErrorBoundary>} />
        <Route path="/project-intelligence" element={<ErrorBoundary><ProjectIntel /></ErrorBoundary>} />
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
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
