'use client'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

const PRIORITY_COLORS = { HIGH: '#ef4444', MEDIUM: '#d97706', LOW: '#6b7280' }
const PRIORITY_LABELS = { HIGH: '높음', MEDIUM: '중간', LOW: '낮음' }

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return '오늘'
  if (date.toDateString() === tomorrow.toDateString()) return '내일'
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`bg-[#1a1a2e] rounded-lg px-4 py-3 flex items-center gap-3 border-l-[3px] transition-opacity ${
        todo.completed ? 'opacity-50' : ''
      }`}
      style={{ borderColor: todo.completed ? '#374151' : PRIORITY_COLORS[todo.priority] }}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? '완료 취소' : '완료'}
        className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
          todo.completed ? 'bg-gray-600 border-gray-600' : 'border-gray-600 hover:border-violet-400'
        }`}
      >
        {todo.completed && <span className="text-gray-300 text-[10px]">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
          {todo.title}
        </p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className="text-xs" style={{ color: PRIORITY_COLORS[todo.priority] }}>
            ● {PRIORITY_LABELS[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className="text-xs text-gray-500">📅 {formatDate(todo.dueDate)}</span>
          )}
          {todo.category && (
            <span className="text-xs" style={{ color: todo.category.color }}>
              {todo.category.name}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
        className="text-gray-700 hover:text-red-400 text-sm shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
