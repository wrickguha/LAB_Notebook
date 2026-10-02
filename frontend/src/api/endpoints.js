import api from './client';

export const authApi = {
  login: async (credentials) => {
    await api.get('/api/csrf-cookie');
    if (credentials.signup) {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        full_name: credentials.name,
        role: credentials.role || 'Principal Investigator',
        institution: credentials.institution || '',
        lab: credentials.lab || '',
      };
      return await api.post('/api/auth/signup', payload);
    } else {
      const payload = {
        email: credentials.email,
        password: credentials.password
      };
      return await api.post('/api/auth/signin', payload);
    }
  },
  logout: async () => {
    return await api.post('/api/auth/logout');
  },
};

export const userApi = {
  getUser: async () => {
    return await api.get('/api/auth/me');
  },
  updateUser: async (updates) => {
    return await api.put('/api/users/me', updates);
  },
};

export const notificationsApi = {
  list: async () => {
    const response = await api.get('/api/notifications');
    return response.items ?? [];
  },

  markRead: async () => {
    return await api.post('/api/notifications/mark-read');
  },

  markOneRead: async (id) => {
    return await api.post(`/api/notifications/${id}/read`);
  },
};

export const calendarApi = {
  list: async () => {
    return await api.get('/api/calendar/events');
  },

  create: async (event) => {
    return await api.post('/api/calendar/events', event);
  },

  update: async (id, event) => {
    return await api.put(`/api/calendar/events/${id}`, event);
  },

  remove: async (id) => {
    return await api.delete(`/api/calendar/events/${id}`);
  },
};

export const quoteApi = {
  get: async () => api.get('/api/daily-quote'),
  new: async () => api.post('/api/daily-quote/new'),
};

export const projectsApi = {
  list: async () => {
    return await api.get('/api/projects');
  },
  create: async (projectData) => {
    return await api.post('/api/projects', projectData);
  },
  update: async (projectId, projectData) => {
    return await api.put(`/api/projects/${projectId}`, projectData);
  },
  saveContent: async (projectId, content) => {
    return await api.post(`/api/projects/${projectId}/save-content`, { content });
  },
  toggleMilestone: async (projectId, milestoneId) => {
    return await api.patch(
      `/api/projects/${projectId}/milestones/${milestoneId}/toggleMilestone`
    );
  },
  delete: async (projectId) => {
    return await api.delete(`/api/projects/${projectId}`);
  },
};

export const notebookApi = {
  listFolders: async () => {
    return await api.get('/api/notebook/folders');
  },
  createFolder: async (name) => {
    return await api.post('/api/notebook/folders', { name });
  },
  listEntries: async (folderId) => {
    const url = folderId ? `/api/notebook/entries?folderId=${folderId}` : '/api/notebook/entries';
    return await api.get(url);
  },
  getEntry: async (id) => {
    return await api.get(`/api/notebook/entries/${id}`);
  },
  createEntry: async (entryData) => {
    return await api.post('/api/notebook/entries', entryData);
  },
  updateEntryContent: async (id, { content, title }) => {
    return await api.put(`/api/notebook/entries/${id}`, { content, title });
  },
  autoSaveEntry: async (id, document) => {
    return await api.post(`/api/notebook/entries/${id}/auto-save`, document);
  },
  signEntry: async (id) => {
    return await api.post(`/api/notebook/entries/${id}/sign`);
  },
};

export const resourcesApi = {
  list: async () => {
    return await api.get('/api/resources');
  },
  create: async (resourceData) => {
    return await api.post('/api/resources', resourceData);
  },
  updatePermission: async (resourceId, { targetUser, newLevel }) => {
    return await api.patch(`/api/resources/${resourceId}/permission`, { targetUser, newLevel });
  },
};

export const papersApi = {
  list: async () => {
    return await api.get('/api/papers');
  },
  create: async (paperData) => {
    return await api.post('/api/papers', paperData);
  },
  delete: async (paperId) => {
    return await api.delete(`/api/papers/${paperId}`);
  },
};

export const auditLogsApi = {
  list: async (searchQuery) => {
    const url = searchQuery ? `/api/audit-logs?search=${encodeURIComponent(searchQuery)}` : '/api/audit-logs';
    return await api.get(url);
  },
  create: async (logData) => {
    return await api.post('/api/audit-logs', logData);
  },
};

export const calcHistoryApi = {
  list: async () => {
    return await api.get('/api/calculators/history');
  },
  create: async (calcData) => {
    return await api.post('/api/calculators/history', calcData);
  },
};

export const dashboardApi = {
  getSummary: async () => {
    return await api.get('/api/dashboard/summary');
  },
};
