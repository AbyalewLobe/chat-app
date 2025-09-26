import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  // Stores messages per user
  messagesByUser: {},
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  // Fetch all users
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      const users = Array.isArray(res.data) ? res.data : res.data.users || [];
      set({ users });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch users');
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Fetch messages for a specific user
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/chat/${userId}`);
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [userId]: res.data.messages || [],
        },
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch messages');
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // Send a message to the selected user
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    try {
      let config = {};
      let payload = messageData;

      // Handle FormData for image uploads
      if (messageData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
        if (!messageData.has('text')) {
          messageData.append('text', '');
        }
      } else {
        payload = { text: messageData.text || '' };
      }

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload,
        config
      );

      // Update messages for this user
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [selectedUser._id]: [
            ...(state.messagesByUser[selectedUser._id] || []),
            res.data,
          ],
        },
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to send message'
      );
    }
  },

  // Subscribe to incoming messages via socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');

    socket.on('newMessage', (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [selectedUser._id]: [
            ...(state.messagesByUser[selectedUser._id] || []),
            newMessage,
          ],
        },
      }));
    });
  },

  // Unsubscribe from socket
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },

  // Set the currently selected user and fetch messages if not already loaded
  setSelectedUser: async (user) => {
    set({ selectedUser: user });

    const messagesExist = get().messagesByUser[user._id];
    if (!messagesExist) {
      await get().getMessages(user._id);
    }
  },
}));
