import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies / sessions
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Response interceptor for clean data extraction and standardized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMsg);
    const normalizedError = new Error(errorMsg);
    normalizedError.status = error.response?.status;
    return Promise.reject(normalizedError);
  }
);

export default api;
