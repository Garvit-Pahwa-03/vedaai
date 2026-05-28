import axios from 'axios';
import { Assignment, GeneratedPaper, QuestionType } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

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