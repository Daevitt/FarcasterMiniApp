'use client'

import { useAuthStore } from '@/lib/store'
import { useState } from 'react'

export function UserProfile() {
  const { user, logout } = useAuthStore()
  const [showMenu, setShowMenu] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.pfpUrl && (
          <img
            src={user.pfpUrl}
            alt={user.displayName || user.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="text-left">
          <div className="font-medium text-sm">
            {user.displayName || user.username}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{user.globalPoints} puntos</span>
            {user.subscriptionStatus === 'premium' && (
              <span className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded text-xs font-medium">
                ⭐ Premium
              </span>
            )}
          </div>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-700">
              FID: {user.fid}
            </div>
            <hr className="my-2" />
            <button
              onClick={() => {
                // TODO: Implementar upgrade a premium
                alert('Función próximamente disponible')
                setShowMenu(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              {user.subscriptionStatus === 'free' ? '⬆️ Upgrade a Premium' : '⚙️ Gestionar Suscripción'}
            </button>
            <button
              onClick={() => {
                logout()
                setShowMenu(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}