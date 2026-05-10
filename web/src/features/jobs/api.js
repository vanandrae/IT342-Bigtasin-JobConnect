import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const jobAPI = {
    getAll: () => api.get('/jobs'),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (jobData) => api.post('/jobs', jobData),
    update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    delete: (id) => api.delete(`/jobs/${id}`),
    getEmployerJobs: () => api.get('/jobs/employer/me'),
};
