// components/TodoList.tsx
import type { Todo } from '@/types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-spotify-muted">
        <p className="text-4xl mb-3">✓</p>
        <p className="text-sp-sm">할 일이 없습니다</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-[20px_1fr_90px_70px_24px_24px] gap-3 px-3 py-2 border-b border-spotify-card mb-1">
        <span className="text-sp-xs text-spotify-muted">#</span>
        <span className="text-sp-xs text-spotify-muted">제목</span>
        <span className="text-sp-xs text-spotify-muted text-center">마감일</span>
        <span className="text-sp-xs text-spotify-muted text-center">우선순위</span>
        <span />
        <span />
      </div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}
