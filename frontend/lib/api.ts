import axios from 'axios';
import { Assignment, GeneratedPaper, User } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vedaai_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vedaai_token');
      localStorage.removeItem('vedaai_user');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  },

  verifyOTP: async (data: { email: string; otp: string }): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/verify-otp', data);
    return res.data;
  },

  signin: async (data: { email: string; password: string }): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/signin', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.user;
  },
};

export const assignmentApi = {
  getAll: async (): Promise<Assignment[]> => {
    const res = await api.get('/assignments');
    return res.data.assignments;
  },

  getById: async (id: string): Promise<Assignment> => {
    const res = await api.get(`/assignments/${id}`);
    return res.data.assignment;
  },

  create: async (formData: FormData): Promise<{ assignmentId: string; jobId: string }> => {
    const res = await api.post('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/assignments/${id}`);
  },

  getPaper: async (assignmentId: string): Promise<GeneratedPaper> => {
    const res = await api.get(`/assignments/${assignmentId}/paper`);
    return res.data.paper;
  },
};