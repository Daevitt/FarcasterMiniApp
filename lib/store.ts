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
  isAuthenticated: boolean; // ← Añadir esta línea
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
  isAuthenticated: false, // ← Añadir esta línea
  login: (userData: User) => set({ user: userData, isAuthenticated: true }), // ← Actualizar
  logout: () => set({ user: null, isAuthenticated: false }), // ← Actualizar
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

// Alias para compatibilidad
export const useAppStore = useAuthStore;
