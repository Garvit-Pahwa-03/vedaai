import { create } from 'zustand';
import { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  signup: async (data) => {
    set({ isLoading: true });
    await authApi.signup(data);
    set({ isLoading: false });
  },

  verifyOTP: async (email, otp) => {
    set({ isLoading: true });
    const res = await authApi.verifyOTP({ email, otp });
    localStorage.setItem('vedaai_token', res.token);
    localStorage.setItem('vedaai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user, isAuthenticated: true, isLoading: false });
  },

  signin: async (email, password) => {
    set({ isLoading: true });
    const res = await authApi.signin({ email, password });
    localStorage.setItem('vedaai_token', res.token);
    localStorage.setItem('vedaai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('vedaai_token');
    localStorage.removeItem('vedaai_user');
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/signin';
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('vedaai_token');
    const userStr = localStorage.getItem('vedaai_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
    }
  },
}));