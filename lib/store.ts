import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  subscriptionStatus: 'free' | 'premium'
  globalPoints: number
}

interface TaskList {
  id: string
  title: string
  description: string
  category: string
  creatorFid: number
  endDate: Date
  totalTasks: number
  participants: number
  maxRewards: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  logout: () => void
}

interface AppState {
  taskLists: TaskList[]
  currentList: TaskList | null
  addTaskList: (list: TaskList) => void
  setCurrentList: (list: TaskList | null) => void
  updateTaskList: (id: string, updates: Partial<TaskList>) => void
}

// Store de autenticación
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      logout: () => set({ user: null, isAuthenticated: false })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

// Store de la aplicación
export const useAppStore = create<AppState>((set, get) => ({
  taskLists: [],
  currentList: null,
  addTaskList: (list) => set((state) => ({ 
    taskLists: [...state.taskLists, list] 
  })),
  setCurrentList: (list) => set({ currentList: list }),
  updateTaskList: (id, updates) => set((state) => ({
    taskLists: state.taskLists.map(list => 
      list.id === id ? { ...list, ...updates } : list
    )
  }))
}))

// Hook combinado para fácil acceso
export const useStore = () => {
  const auth = useAuthStore()
  const app = useAppStore()
  
  return {
    ...auth,
    ...app
  }
}
