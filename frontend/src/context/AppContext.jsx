import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  calendarApi,
  quoteApi,
  dashboardApi,
} from '../api/endpoints';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppDataProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // The session cookie is authoritative; this flag only restores the protected shell while /me loads.
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('biotech_isAuthenticated') === 'true';
  });
  const [themePreference, setThemePreferenceState] = useState(() => {
    const savedTheme = localStorage.getItem('inveniq_theme_preference');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const [sessionTimeoutMinutes, setSessionTimeoutMinutesState] = useState(30);
  const logoutRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Central Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const { data: user, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getUser,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themePreference === 'dark');
    document.documentElement.style.colorScheme = themePreference;
    localStorage.setItem('inveniq_theme_preference', themePreference);
  }, [themePreference]);

  useEffect(() => {
    const savedPreference = user?.theme_preference;
    if (isAuthenticated && (savedPreference === 'light' || savedPreference === 'dark')) {
      setThemePreferenceState(savedPreference);
    }
  }, [isAuthenticated, user?.theme_preference]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const storedTimeout = Number(localStorage.getItem(`inveniq_session_timeout_${user.id}`));
      if ([15, 30, 60].includes(storedTimeout)) {
        setSessionTimeoutMinutesState(storedTimeout);
      }
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && userError?.status === 401) {
      localStorage.removeItem('biotech_isAuthenticated');
      setIsAuthenticated(false);
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient, userError]);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: calendarEvents = [] } = useQuery({
  queryKey: ['calendarEvents'],
  queryFn: calendarApi.list,
  enabled: isAuthenticated,
});

  const { data: dailyQuote } = useQuery({
    queryKey: ['dailyQuote'],
    queryFn: quoteApi.get,
    enabled: isAuthenticated,
  });

  const { data: dashboardSummary = {}, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
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
      showToast('Logged out successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      localStorage.removeItem('biotech_isAuthenticated');
      setIsAuthenticated(false);
      queryClient.clear();
    }
  };

  logoutRef.current = logout;

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let inactivityTimer;
    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(
        () => void logoutRef.current?.(),
        sessionTimeoutMinutes * 60 * 1000
      );
    };
    const activityEvents = ['pointerdown', 'keydown', 'touchstart'];

    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      window.clearTimeout(inactivityTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetInactivityTimer));
    };
  }, [isAuthenticated, sessionTimeoutMinutes]);

  const setSessionTimeoutMinutes = (value) => {
    const minutes = Number(value);
    if (![15, 30, 60].includes(minutes)) return;

    setSessionTimeoutMinutesState(minutes);
    if (user?.id) {
      localStorage.setItem(`inveniq_session_timeout_${user.id}`, String(minutes));
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

  const setThemePreference = async (preference) => {
    if (preference !== 'light' && preference !== 'dark') return;
    const previousPreference = themePreference;
    setThemePreferenceState(preference);

    if (!isAuthenticated) return;

    try {
      const updated = await userApi.updateUser({ theme_preference: preference });
      queryClient.setQueryData(['user'], updated);
    } catch (err) {
      setThemePreferenceState(previousPreference);
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

  const markNotificationAsRead = async (id) => {
    try {
      await notificationsApi.markOneRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };


  const createCalendarEvent = async (event) => {
    await calendarApi.create(event);
    queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
  };

  const updateCalendarEvent = async (id, event) => {
    await calendarApi.update(id, event);
    queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
  };

  const deleteCalendarEvent = async (id) => {
    await calendarApi.remove(id);
    queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
  };

  const getNewQuote = async () => {
    const quote = await quoteApi.new();
    queryClient.setQueryData(['dailyQuote'], quote);
  };

  // Projects
  const addProject = async (newProject) => {
    try {
      await projectsApi.create(newProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast(`Project "${newProject.name}" initialized`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      await projectsApi.update(id, projectData);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast(`Project "${projectData.name || 'Project'}" updated successfully`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const saveProjectContent = async (id, content) => {
    const result = await projectsApi.saveContent(id, content);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    return result;
  };

  const deleteProject = async (id, name) => {
    try {
      await projectsApi.delete(id);
      await addAuditLog('Deleted project', name || `Project #${id}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      showToast(`Project "${name || 'Project'}" deleted successfully`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
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
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
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
      const folder = await notebookApi.createFolder(name);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Folder "${name}" created`, 'success');
      return folder.id;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Entries
  const addNotebookEntry = async (entry) => {
    try {
      const newEntry = await notebookApi.createEntry(entry);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast(`Notebook draft "${entry.title}" created`, 'success');
      return newEntry.id;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateNotebookEntryContent = async (id, newContent, title) => {
    try {
      await notebookApi.updateEntryContent(id, { content: newContent, title });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const autoSaveNotebookEntry = async (id, document) => {
    const result = await notebookApi.autoSaveEntry(id, document);
    queryClient.setQueryData(['entries'], (entries = []) => entries.map((entry) => (
      entry.id === id
        ? {
            ...entry,
            content: document.content ?? entry.content,
            contentJson: document.content_json ?? entry.contentJson,
            title: document.title ?? entry.title,
            updatedAt: result.updated_at,
          }
        : entry
    )));
    return result;
  };

  const approveNotebookEntry = async (id) => {
    try {
      await notebookApi.signEntry(id);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('Notebook entry signed and locked', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Resources
  const addSharedResource = async (resource) => {
    try {
      await resourcesApi.create(resource);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      showToast(`Paper reference uploaded`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteResearchPaper = async (id, title) => {
    try {
      await papersApi.delete(id);
      await addAuditLog('Deleted paper reference', title || `Paper #${id}`);
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      showToast(`Paper "${title || 'Paper'}" removed from library`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
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
        themePreference,
        setThemePreference,
        sessionTimeoutMinutes,
        setSessionTimeoutMinutes,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationsAsRead,
        markNotificationAsRead,
        calendarEvents,
        createCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        dailyQuote,
        getNewQuote,
        dashboardSummary,
        dashboardLoading,
        projects,
        setProjects,
        addProject,
        updateProject,
        saveProjectContent,
        deleteProject,
        notebookFolders,
        addNotebookFolder,
        notebookEntries,
        addNotebookEntry,
        updateNotebookEntryContent,
        autoSaveNotebookEntry,
        approveNotebookEntry,
        sharedResources,
        addSharedResource,
        updateResourcePermission,
        researchPapers,
        addResearchPaper,
        deleteResearchPaper,
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
