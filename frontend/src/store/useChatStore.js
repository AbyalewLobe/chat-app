import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch users safely
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      // Ensure users is always an array
      const users = Array.isArray(res.data) ? res.data : res.data.users || [];
      set({ users });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch users';
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages safely
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/chat/${userId}`);
      // Ensure messages is always an array
      const messages = Array.isArray(res.data)
        ? res.data
        : res.data.messages || [];
      set({ messages });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch messages';
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const updatedMessages = [...(messages || []), res.data];
      set({ messages: updatedMessages });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to send message';
      console.error('Send message error', error);
      toast.error(errorMessage);
    }
  },

  // Subscribe to incoming messages via socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');

    socket.on('newMessage', (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  // Unsubscribe from socket events
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },

  // Select a user
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
