'use client'

import React from 'react'
import type { TaskList } from '@/lib/types'
import VerifyButton from '@/components/tasks/VerifyButton'

interface TaskListCardProps {
  list: TaskList & {
    tasks?: {
      id: string
      type: 'follow' | 'recast' | 'reply' | 'keyword'
      target: string
      points: number
    }[]
  }
  currentUserFid?: number   // 🔹 el fid del usuario logueado
  onClick?: () => void
  onDelete?: () => void
}

export default function TaskListCard({ list, currentUserFid, onClick, onDelete }: TaskListCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div onClick={onClick} className="cursor-pointer">
        <h3 className="font-semibold text-lg mb-1">{list.title}</h3>
        {list.description && (
          <p className="text-gray-600 text-sm mb-2">{list.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {list.taskCount} task{list.taskCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* 🔹 Listado de tareas con botón de verificación */}
      {list.tasks && list.tasks.length > 0 && (
        <div className="mt-3 space-y-2">
          {list.tasks.map((task) => (
            <div
              key={task.id}
              className="p-2 border rounded bg-gray-50 flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">
                Acción: <strong>{task.type}</strong> — {task.points} pts
              </span>

              {currentUserFid ? (
                <VerifyButton
                  taskId={task.id}
                  actorFid={currentUserFid}
                  taskType={task.type}
                  target={task.target}
                  onVerified={() => {
                    console.log('✅ Acción verificada para task', task.id)
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">Inicia sesión para verificar</span>
              )}
            </div>
          ))}
        </div>
      )}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="mt-2 text-red-500 hover:text-red-700 text-sm transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  )
}
