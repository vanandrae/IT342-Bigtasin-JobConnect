import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH APIs ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// ==================== JOB APIs ====================
export const jobAPI = {
  // Public / Job Seeker endpoints
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  search: (params) => api.get('/jobs/search', { params }),

  // Employer endpoints
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/jobs/employer/me'),
};

// ==================== APPLICATION APIs ====================
export const applicationAPI = {
  // For job seekers
  apply: (jobId) => api.post(`/applications?jobId=${jobId}`),
  getUserApplications: () => api.get('/applications/user/me'),
  withdraw: (applicationId) => api.delete(`/applications/${applicationId}`),

  // For employers
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (applicationId, status) =>
    api.patch(`/applications/${applicationId}/status`, { status }),
};

// ==================== FAVORITE APIs ====================
export const favoriteAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (jobId) => api.post(`/favorites/${jobId}`),
  removeFavorite: (jobId) => api.delete(`/favorites/${jobId}`),
  checkFavorite: (jobId) => api.get(`/favorites/check/${jobId}`),
};

// ==================== PROFILE APIs ====================
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;