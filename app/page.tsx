'use client'

import { useEffect, useState } from 'react'
import  LoginButton  from '../components/auth/LoginButton'
import  UserProfile  from '../components/auth/UserProfile'
import  TaskListCard  from '../components/lists/TaskListCard'
import  CreateListButton  from '../components/lists/CreateListButton'
import { useAuthStore, useTaskStore } from '../lib/store'
import { markAppAsReady } from '../lib/farcaster'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const { taskLists } = useTaskStore()
  const [isLoading, setIsLoading] = useState(true)

  // Marcar la app como lista cuando se carga
  useEffect(() => {
    const initApp = async () => {
      await markAppAsReady()
      setIsLoading(false)
    }
    
    initApp()
  }, [])

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return (
      <div className="miniapp-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando TaskList...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="miniapp-container">
      <div className="gradient-bg min-h-screen">
        {/* Header */}
        <header className="glass p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-white">TaskList</h1>
            </div>
            {isAuthenticated && <UserProfile />}
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {!isAuthenticated ? (
            /* Landing Page for Non-Authenticated Users */
            <div className="text-center text-white">
              <div className="mb-8 mt-16">
                <h2 className="text-3xl font-bold mb-4">
                  Completa tareas y gana recompensas 🎯
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Crea listas de tareas, compite con otros usuarios y gana NFTs como premio
                </p>
                
                {/* Features */}
                <div className="grid gap-4 mb-8">
                  <div className="glass p-4 rounded-xl">
                    <div className="text-2xl mb-2">🏆</div>
                    <h3 className="font-semibold mb-1">Compite y Gana</h3>
                    <p className="text-sm opacity-80">Sube en el ranking completando tareas</p>
                  </div>
                  
                  <div className="glass p-4 rounded-xl">
                    <div className="text-2xl mb-2">🎨</div>
                    <h3 className="font-semibold mb-1">NFTs Exclusivos</h3>
                    <p className="text-sm opacity-80">Los mejores reciben recompensas únicas</p>
                  </div>
                  
                  <div className="glass p-4 rounded-xl">
                    <div className="text-2xl mb-2">🤝</div>
                    <h3 className="font-semibold mb-1">Comunidad</h3>
                    <p className="text-sm opacity-80">Conecta con otros usuarios de Farcaster</p>
                  </div>
                </div>
                
                <div className="max-w-sm mx-auto">
                  <LoginButton />
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard for Authenticated Users */
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Listas Disponibles</h2>
                  <CreateListButton />
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass p-4 rounded-xl text-white text-center">
                    <div className="text-2xl font-bold">{taskLists.length}</div>
                    <div className="text-sm opacity-80">Listas Activas</div>
                  </div>
                  <div className="glass p-4 rounded-xl text-white text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm opacity-80">NFTs Ganados</div>
                  </div>
                </div>
              </div>

              {/* Task Lists */}
              <div className="space-y-4">
                {taskLists.length === 0 ? (
                  <div className="glass p-8 rounded-xl text-center text-white">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="font-semibold mb-2">No hay listas disponibles</h3>
                    <p className="text-sm opacity-80 mb-4">
                      ¡Sé el primero en crear una lista de tareas!
                    </p>
                    <CreateListButton />
                  </div>
                ) : (
                  taskLists.map((list) => (
                    <TaskListCard key={list.id} list={list} />
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-white text-sm opacity-75">
          <p>Powered by Farcaster MiniApps 🚀</p>
        </footer>
      </div>
    </div>
  )

}




