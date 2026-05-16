// components/TodoItem.tsx
'use client'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

const PRIORITY_COLORS = { HIGH: '#f3727f', MEDIUM: '#ffa42b', LOW: '#535353' }
const PRIORITY_LABELS = { HIGH: 'HIGH', MEDIUM: 'MED', LOW: 'LOW' }

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return '오늘'
  if (date.toDateString() === tomorrow.toDateString()) return '내일'
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <div
      className={`grid grid-cols-[20px_1fr_90px_70px_24px_24px] gap-3 px-3 py-2 rounded items-center group hover:bg-spotify-elevated transition-colors ${
        todo.completed ? 'opacity-[0.45]' : ''
      }`}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? '완료 취소' : '완료'}
        className={`w-[14px] h-[14px] rounded-circle border-2 shrink-0 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-spotify-green border-spotify-green'
            : 'border-spotify-border group-hover:border-spotify-green'
        }`}
      >
        {todo.completed && (
          <span className="text-black text-[8px] font-bold leading-none">✓</span>
        )}
      </button>

      <div className="overflow-hidden">
        <p
          className={`text-sp-base font-bold truncate ${
            todo.completed ? 'line-through text-spotify-muted' : 'text-spotify-text'
          }`}
        >
          {todo.title}
        </p>
        {todo.category && (
          <p className="text-sp-xs text-spotify-muted truncate">{todo.category.name}</p>
        )}
      </div>

      <span className="text-sp-xs text-spotify-muted text-center">
        {todo.dueDate ? formatDate(todo.dueDate) : '—'}
      </span>

      <span
        className="text-sp-xs text-center font-bold"
        style={{ color: PRIORITY_COLORS[todo.priority] }}
      >
        ● {PRIORITY_LABELS[todo.priority]}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
        className="text-spotify-border hover:text-spotify-negative transition-colors text-xs opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>

      <button
        onClick={() => onEdit(todo)}
        aria-label="수정"
        className="text-spotify-border hover:text-spotify-green transition-colors text-xs"
      >
        ✏
      </button>
    </div>
  )
}
