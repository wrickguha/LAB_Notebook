import api from './client';

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
};

export const userApi = {
  getUser: () => api.get('/api/user'),
  updateUser: (updates) => api.patch('/api/user', updates),
};

export const notificationsApi = {
  list: () => api.get('/api/notifications'),
  markRead: () => api.patch('/api/notifications/mark-read'),
};

export const projectsApi = {
  list: () => api.get('/api/projects'),
  create: (projectData) => api.post('/api/projects', projectData),
  toggleMilestone: (projectId, milestoneId) => 
    api.patch(`/api/projects/${projectId}/milestone/${milestoneId}`),
};

export const notebookApi = {
  listFolders: () => api.get('/api/notebook/folders'),
  createFolder: (name) => api.post('/api/notebook/folders', { name }),
  listEntries: (folderId) => {
    const params = folderId ? { folderId } : {};
    return api.get('/api/notebook/entries', { params });
  },
  getEntry: (id) => api.get(`/api/notebook/entries/${id}`),
  createEntry: (entryData) => api.post('/api/notebook/entries', entryData),
  updateEntryContent: (id, { content, title }) => 
    api.patch(`/api/notebook/entries/${id}/content`, { content, title }),
  signEntry: (id) => api.post(`/api/notebook/entries/${id}/sign`),
};

export const resourcesApi = {
  list: () => api.get('/api/resources'),
  create: (resourceData) => api.post('/api/resources', resourceData),
  updatePermission: (resourceId, { targetUser, newLevel }) => 
    api.patch(`/api/resources/${resourceId}/permission`, { targetUser, newLevel }),
};

export const papersApi = {
  list: () => api.get('/api/papers'),
  create: (paperData) => api.post('/api/papers', paperData),
};

export const auditLogsApi = {
  list: (searchQuery) => {
    const params = searchQuery ? { q: searchQuery } : {};
    return api.get('/api/audit-logs', { params });
  },
  create: (logData) => api.post('/api/audit-logs', logData),
};

export const calcHistoryApi = {
  list: () => api.get('/api/calc-history'),
  create: (calcData) => api.post('/api/calc-history', calcData),
};

export const dashboardApi = {
  getSummary: () => api.get('/api/dashboard/summary'),
};
