'use client'

import React from 'react'
import { TaskList } from '../../lib/types'

interface TaskListCardProps {
  list: TaskList
  onClick?: () => void
  onDelete?: () => void
}

export default function TaskListCard({ list, onClick, onDelete }: TaskListCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div
        onClick={onClick}
        className="cursor-pointer"
      >
        <h3 className="font-semibold text-lg mb-1">{list.title}</h3>
        {list.description && (
          <p className="text-gray-600 text-sm mb-2">{list.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {list.taskCount} task{list.taskCount !== 1 ? 's' : ''}
        </p>
      </div>

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
