import axiosInstance from '../lib/axios';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/api/auth/check');

      set({ authUser: res.data });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {},
}));
