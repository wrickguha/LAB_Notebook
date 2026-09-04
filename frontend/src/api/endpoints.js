import api from './client';

export const authApi = {
  login: async (credentials) => {
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
    return await api.get('/api/notifications');
  },
  markRead: async () => {
    return await api.post('/api/notifications/mark-read');
  },
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
  toggleMilestone: async (projectId, milestoneId) => {
    return await api.patch(`/api/projects/${projectId}/milestones/${milestoneId}`);
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
