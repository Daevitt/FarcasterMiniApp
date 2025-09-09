'use client'
import { create } from 'zustand'

export interface User {
  fid: number;
  username: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface TaskList {
  id: string;
  title: string;
  description?: string;
  taskCount: number;
  createdAt: string; // ISO string for easier serialization
  ownerFid?: number;
  // campos adicionales: pricePerDayUSD, durationDays, nftLinks[], maxWinners, isPublic, subscriptionRequired, etc.
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface TaskState {
  taskLists: TaskList[];
  addTaskList: (list: Omit<TaskList, 'id' | 'createdAt'>) => void;
  removeTaskList: (id: string) => void;
  updateTaskList: (id: string, patch: Partial<TaskList>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useTaskStore = create<TaskState>((set, get) => ({
  taskLists: [],
  addTaskList: (list) => {
    const newList: TaskList = {
      ...list,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set({ taskLists: [...get().taskLists, newList] });
  },
  removeTaskList: (id) => set({ taskLists: get().taskLists.filter(l => l.id !== id) }),
  updateTaskList: (id, patch) => set({ taskLists: get().taskLists.map(l => l.id === id ? { ...l, ...patch } : l) }),
}));

export const useAppStore = useAuthStore;
