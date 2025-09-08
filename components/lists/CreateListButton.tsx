'use client'

import { useState } from 'react'
import { useAuthStore, useAppStore } from '@/lib/store'

export function CreateListButton() {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const { addTaskList } = useAppStore()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social',
    duration: 7, // días
    maxRewards: 3
  })

  const categories = [
    { value: 'social', label: '👥 Social' },
    { value: 'defi', label: '💰 DeFi' },
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'creator', label: '🎨 Creator' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'fitness', label: '💪 Fitness' },
    { value: 'other', label: '📋 Other' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      // Simular creación de lista (en el futuro será API call)
      const newList = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        creatorFid: user.fid,
        endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
        totalTasks: 0,
        participants: 0,
        maxRewards: formData.maxRewards
      }

      addTaskList(newList)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'social',
        duration: 7,
        maxRewards: 3
      })
      
      setShowModal(false)
      
    } catch (error) {
      console.error('Error creating list:', error)
      alert('Error al crear la lista')
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar límites para usuarios gratuitos
  const canCreateList = () => {
    if (user?.subscriptionStatus === 'premium') return true
    
    // TODO: Implementar lógica de límites reales
    // Por ahora permitir crear hasta 2 listas para usuarios gratuitos
    return true
  }

  if (!canCreateList()) {
    return (
      <button
        onClick={() => alert('Actualiza a Premium para crear más listas')}
        className="btn-secondary text-sm"
      >
        ⬆️ Upgrade para crear más
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-primary text-sm"
      >
        ➕ Nueva Lista
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Crear Nueva Lista</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título de la Lista *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Reto de Crecimiento en Farcaster"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe qué tipo de tareas incluirá tu lista..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duración (días)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 día</option>
                    <option value={3}>3 días</option>
                    <option value={7}>7 días</option>
                    {user?.subscriptionStatus === 'premium' && (
                      <>
                        <option value={14}>14 días</option>
                        <option value={30}>30 días</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    NFT Rewards
                  </label>
                  <select
                    value={formData.maxRewards}
                    onChange={(e) => setFormData({...formData, maxRewards: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>Top 1</option>
                    <option value={3}>Top 3</option>
                    {user?.subscriptionStatus === 'premium' && (
                      <>
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {user?.subscriptionStatus === 'free' && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p className="text-blue-800">
                    <strong>Plan Gratuito:</strong> Máximo 4 días de duración y 3 NFT rewards.
                    <button className="underline ml-1">Upgrade a Premium</button>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 disabled:opacity-50"
                  disabled={isLoading || !formData.title.trim()}
                >
                  {isLoading ? 'Creando...' : 'Crear Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}