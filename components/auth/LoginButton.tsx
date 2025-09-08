'use client'

import { useState } from 'react'
import { signInWithFarcaster } from '@/lib/farcaster'
import { useAuthStore } from '@/lib/store'

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setAuthenticated } = useAuthStore()

  const handleLogin = async () => {
    setIsLoading(true)
    
    try {
      const result = await signInWithFarcaster()
      
      if (result.isAuthenticated && result.user) {
        setUser({
          ...result.user,
          subscriptionStatus: 'free',
          globalPoints: 0
        })
        setAuthenticated(true)
      } else {
        console.error('Login failed:', result.error)
        alert('Error al iniciar sesión: ' + result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Error inesperado al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Conectando...
        </>
      ) : (
        <>
          <span>🎯</span>
          Conectar con Farcaster
        </>
      )}
    </button>
  )
}
