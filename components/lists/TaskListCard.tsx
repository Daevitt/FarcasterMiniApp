'use client'

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

interface TaskListCardProps {
  taskList: TaskList
}

export function TaskListCard({ taskList }: TaskListCardProps) {
  const isExpired = new Date() > taskList.endDate
  const timeLeft = Math.ceil((taskList.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const handleClick = () => {
    console.log('Opening task list:', taskList.id)
  }

  return (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryEmoji(taskList.category)}</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {taskList.category}
          </span>
        </div>
        
        {!isExpired ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            {timeLeft}d restantes
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
            Finalizada
          </span>
        )}
      </div>

      <h3 className="font-bold text-lg mb-2">{taskList.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{taskList.description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg">{taskList.totalTasks}</div>
          <div className="text-gray-500">Tareas</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{taskList.participants}</div>
          <div className="text-gray-500">Participantes</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{taskList.maxRewards}</div>
          <div className="text-gray-500">NFT Rewards</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Por: @user{taskList.creatorFid}</span>
          <span className="flex items-center gap-1">
            🏆 {taskList.maxRewards > 1 ? 'Múltiples premios' : 'Premio único'}
          </span>
        </div>
      </div>
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'social': '👥',
    'defi': '💰',
    'gaming': '🎮',
    'creator': '🎨',
    'learning': '📚',
    'fitness': '💪',
    'other': '📋'
  }
  
  return emojis[category.toLowerCase()] || '📋'
}
