import axiosInstance from '../lib/axios';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      // Only log if it's not 401 (unauthorized is expected when logged out)
      if (error.response?.status !== 401) {
        console.error('Error checking auth:', error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');
      console.log('Signup response:', res.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Signup error:', error);
    } finally {
      set({ isSigningUp: false });
      console.log('Signup process completed');
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
      console.log('Login response:', res.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Login error:', error);
    } finally {
      set({ isLoggingIn: false });
      console.log('Login process completed');
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
