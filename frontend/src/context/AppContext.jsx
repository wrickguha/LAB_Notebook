import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  authApi,
  userApi,
  notificationsApi,
  projectsApi,
  notebookApi,
  resourcesApi,
  papersApi,
  auditLogsApi,
  calcHistoryApi,
} from '../api/endpoints';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppDataProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Simulated Authentication State (kept as local state for dashboard toggling)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('biotech_isAuthenticated') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Central Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const defaultUser = {
    name: 'Dr. Evelyn Thorne',
    role: 'Principal Investigator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    email: 'evelyn.thorne@labnotebook.ai',
    institution: 'Institute of Biomolecular Sciences',
    lab: 'Thorne Genomics Lab',
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────────────────────────

  const { data: user = defaultUser } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getUser,
    enabled: isAuthenticated,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    enabled: isAuthenticated,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
    enabled: isAuthenticated,
  });

  const { data: notebookFolders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: notebookApi.listFolders,
    enabled: isAuthenticated,
  });

  const { data: notebookEntries = [] } = useQuery({
    queryKey: ['entries'],
    queryFn: () => notebookApi.listEntries(),
    enabled: isAuthenticated,
  });

  const { data: sharedResources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: resourcesApi.list,
    enabled: isAuthenticated,
  });

  const { data: researchPapers = [] } = useQuery({
    queryKey: ['papers'],
    queryFn: papersApi.list,
    enabled: isAuthenticated,
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs', searchQuery],
    queryFn: () => auditLogsApi.list(searchQuery),
    enabled: isAuthenticated,
  });

  const { data: calcHistory = [] } = useQuery({
    queryKey: ['calcHistory'],
    queryFn: calcHistoryApi.list,
    enabled: isAuthenticated,
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Mutations & API Functions
  // ─────────────────────────────────────────────────────────────────────────────

  // Auth Operations
  const login = async (credentials) => {
    try {
      await authApi.login(credentials);
      localStorage.setItem('biotech_isAuthenticated', 'true');
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast('Logged in successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('biotech_isAuthenticated');
      setIsAuthenticated(false);
      // Reset react-query cache on logout
      queryClient.clear();
      showToast('Logged out successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // User Profile Updater
  const setUser = async (updates) => {
    try {
      const updated = await userApi.updateUser(updates);
      queryClient.setQueryData(['user'], updated);
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast('Profile settings saved', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Notifications
  const markNotificationsAsRead = async () => {
    try {
      await notificationsApi.markRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Projects
  const addProject = async (newProject) => {
    try {
      await projectsApi.create(newProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast(`Project "${newProject.name}" initialized`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Intercept milestone toggles originating from setProjects call in ProjectsPage.jsx
  const setProjects = async (updatedProjectsOrFn) => {
    const currentProjects = queryClient.getQueryData(['projects']) || [];
    const updatedProjects = typeof updatedProjectsOrFn === 'function' 
      ? updatedProjectsOrFn(currentProjects) 
      : updatedProjectsOrFn;

    let toggledProjectId = null;
    let toggledMilestoneId = null;

    for (const proj of updatedProjects) {
      const originalProj = currentProjects.find(p => p.id === proj.id);
      if (!originalProj) continue;

      for (const ms of proj.milestones) {
        const originalMs = originalProj.milestones.find(m => m.id === ms.id);
        if (originalMs && originalMs.completed !== ms.completed) {
          toggledProjectId = proj.id;
          toggledMilestoneId = ms.id;
          break;
        }
      }
      if (toggledProjectId) break;
    }

    if (toggledProjectId && toggledMilestoneId) {
      try {
        await projectsApi.toggleMilestone(toggledProjectId, toggledMilestoneId);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
        showToast('Milestone status synced with ledger', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Folders
  const addNotebookFolder = async (name) => {
    try {
      await notebookApi.createFolder(name);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Folder "${name}" created`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Entries
  const addNotebookEntry = async (entry) => {
    try {
      const newEntry = await notebookApi.createEntry(entry);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast(`Notebook draft "${entry.title}" created`, 'success');
      return newEntry.id;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateNotebookEntryContent = async (id, newContent) => {
    try {
      await notebookApi.updateEntryContent(id, { content: newContent });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const approveNotebookEntry = async (id) => {
    try {
      await notebookApi.signEntry(id);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('Experiment signed and locked (21 CFR Part 11 Compliant)', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Resources
  const addSharedResource = async (resource) => {
    try {
      await resourcesApi.create(resource);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Shared resource "${resource.name}"`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateResourcePermission = async (id, targetUser, newLevel) => {
    try {
      await resourcesApi.updatePermission(id, { targetUser, newLevel });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Updated ${targetUser} to ${newLevel}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Papers
  const addResearchPaper = async (paper) => {
    try {
      await papersApi.create(paper);
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Paper reference uploaded`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Audit Logs (Write only, reading is managed by query)
  const addAuditLog = async (action, target) => {
    try {
      await auditLogsApi.create({ action, target });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    } catch (err) {
      console.error('Audit logging failed:', err.message);
    }
  };

  // Calculations
  const addCalcHistory = async (calc) => {
    try {
      await calcHistoryApi.create(calc);
      queryClient.invalidateQueries({ queryKey: ['calcHistory'] });
    } catch (err) {
      console.error('Calculation logging failed:', err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        setUser,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationsAsRead,
        projects,
        setProjects,
        addProject,
        notebookFolders,
        addNotebookFolder,
        notebookEntries,
        addNotebookEntry,
        updateNotebookEntryContent,
        approveNotebookEntry,
        sharedResources,
        addSharedResource,
        updateResourcePermission,
        researchPapers,
        addResearchPaper,
        auditLogs,
        addAuditLog,
        calcHistory,
        addCalcHistory,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppContext.Provider>
  );
};
