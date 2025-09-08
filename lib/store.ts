'use client'

import { create } from 'zustand'

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

interface TaskList {
  id: string;
  title: string;
  description: string;
  taskCount: number;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface TaskState {
  taskLists: TaskList[];
  addTaskList: (list: Omit<TaskList, 'id' | 'createdAt'>) => void;
  removeTaskList: (id: string) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: (userData: User) => set({ user: userData }),
  logout: () => set({ user: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Task Store
export const useTaskStore = create<TaskState>((set, get) => ({
  taskLists: [],
  addTaskList: (list) => {
    const newList: TaskList = {
      ...list,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    set({ taskLists: [...get().taskLists, newList] });
  },
  removeTaskList: (id) => 
    set({ taskLists: get().taskLists.filter(list => list.id !== id) }),
}));
