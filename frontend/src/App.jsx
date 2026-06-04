import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppDataProvider, useApp } from './context/AppContext';

// Pages & Layout Imports
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectsPage from './pages/ProjectsPage';
import LabNotebookPage from './pages/LabNotebookPage';
import ResourceSharingPage from './pages/ResourceSharingPage';
import CalculatorsPage from './pages/CalculatorsPage';
import ResearchPapersPage from './pages/ResearchPapersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // Scroll to top on path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
        }
      />

      {/* Authenticated Dashboard Core */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
              {activeTab === 'projects' && <ProjectsPage />}
              {activeTab === 'notebook' && <LabNotebookPage />}
              {activeTab === 'resources' && <ResourceSharingPage />}
              {activeTab === 'calculators' && <CalculatorsPage />}
              {activeTab === 'papers' && <ResearchPapersPage />}
              {activeTab === 'analytics' && <AnalyticsPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <Router>
        <AppContent />
      </Router>
    </AppDataProvider>
  );
}
