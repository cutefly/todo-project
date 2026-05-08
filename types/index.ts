export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type View = 'all' | 'today' | 'upcoming'

export interface Category {
  id: string
  name: string
  color: string
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  categoryId: string | null
  category: Category | null
  createdAt: string
  updatedAt: string
}
