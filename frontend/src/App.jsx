import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppDataProvider, useApp } from "./context/AppContext";

// Pages & Layout Imports
import DashboardLayout from "./components/DashboardLayout";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const LabNotebookPage = lazy(() => import("./pages/LabNotebookPage"));
const ResourceSharingPage = lazy(() => import("./pages/ResourceSharingPage"));
const CalculatorsPage = lazy(() => import("./pages/CalculatorsPage"));
const ResearchPapersPage = lazy(() => import("./pages/ResearchPapersPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LabNotebookEditor = lazy(() => import("./pages/LabNotebook/LabNotebookEditor"));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();

  // Scroll to top on path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-slate-500" role="status">Loading workspace...</div>}>
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Public Auth Page */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        }
      />

      {/* Authenticated Dashboard Core */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              {activeTab === "dashboard" && (
                <DashboardOverview setActiveTab={setActiveTab} />
              )}
              {activeTab === "projects" && <ProjectsPage />}
              {activeTab === "notebook" && <LabNotebookPage />}
              {activeTab === "resources" && <ResourceSharingPage />}
              {activeTab === "calculators" && <CalculatorsPage />}
              {activeTab === "papers" && <ResearchPapersPage />}
              {activeTab === "analytics" && <AnalyticsPage />}
              {activeTab === "settings" && <SettingsPage />}
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/lab-notebook/:projectId"
        element={
          isAuthenticated ? <LabNotebookEditor /> : <Navigate to="/" replace />
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <Router>
          <AppContent />
        </Router>
      </AppDataProvider>
    </QueryClientProvider>
  );
}
