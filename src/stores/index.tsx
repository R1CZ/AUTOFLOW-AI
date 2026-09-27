import { create } from 'zustand';
import type { User, Notification } from '../types';
import * as db from '../lib/database';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; name: string; password: string; companyName: string; industry?: string; country: string; timezone: string; planId: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email, password) => {
    try {
      const result = db.login(email, password);
      if (!result) {
        return { success: false, error: 'Invalid credentials or account suspended.' };
      }
      localStorage.setItem('autoflow_token', result.token);
      set({ user: result.user, token: result.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  },
  
  register: async (data) => {
    try {
      const result = db.register(data);
      if (!result) {
        return { success: false, error: 'Registration is currently unavailable.' };
      }
      localStorage.setItem('autoflow_token', result.token);
      set({ user: result.user, token: result.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },
  
  logout: () => {
    const token = get().token;
    if (token) db.logout(token);
    localStorage.removeItem('autoflow_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  
  restoreSession: () => {
    const token = localStorage.getItem('autoflow_token');
    if (token) {
      const user = db.getSession(token);
      if (user) {
        set({ user, token, isAuthenticated: true, isLoading: false });
        return;
      }
    }
    set({ isLoading: false });
  },
}));

interface AppState {
  notifications: Notification[];
  unreadCount: number;
  systemStatus: 'idle' | 'processing' | 'success' | 'warning' | 'error';
  loadNotifications: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setSystemStatus: (status: 'idle' | 'processing' | 'success' | 'warning' | 'error') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  systemStatus: 'idle',
  
  loadNotifications: () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    const notifications = db.getNotifications(userId);
    const unreadCount = db.getUnreadCount(userId);
    set({ notifications, unreadCount });
  },
  
  markRead: (id) => {
    db.markNotificationRead(id);
    get().loadNotifications();
  },
  
  markAllRead: () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    db.markAllNotificationsRead(userId);
    get().loadNotifications();
  },
  
  setSystemStatus: (status) => set({ systemStatus: status }),
}));
