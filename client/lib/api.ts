import axios from 'axios';

const API_BASE_URL ='http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me/profile');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/auth');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/auth/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: { name?: string; email?: string }) => {
    const response = await api.put(`/auth/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/auth/${id}`);
    return response.data;
  },
};

// Form API
export const formAPI = {
  createForm: async (data: {
    title: string;
    questions: Array<{
      questionText: string;
      type: 'text' | 'multiple-choice';
      options?: string[];
    }>;
  }) => {
    const response = await api.post('/forms', data);
    return response.data;
  },

  getAllForms: async () => {
    const response = await api.get('/forms');
    return response.data;
  },

  getFormById: async (formId: string) => {
    const response = await api.get(`/forms/${formId}`);
    return response.data;
  },

  submitResponse: async (formId: string, data: {
    answers: Array<{
      questionIndex: number;
      answer: string;
    }>;
  }) => {
    const response = await api.post(`/forms/${formId}/responses`, data);
    return response.data;
  },

  getFormResponses: async (formId: string) => {
    const response = await api.get(`/forms/${formId}/responses`);
    return response.data;
  },

  getFormSummary: async (formId: string) => {
    const response = await api.get(`/forms/${formId}/summary`);
    return response.data;
  },

  exportFormResponses: async (formId: string) => {
    const response = await api.get(`/forms/${formId}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api; 