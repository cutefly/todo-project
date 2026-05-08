'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { Category, Priority, Todo, View } from '@/types'
import { TodoList } from '@/components/TodoList'
import { AddTodoForm } from '@/components/AddTodoForm'
import { Sidebar } from '@/components/Sidebar'
import { BottomTabBar } from '@/components/BottomTabBar'
import { ThemeToggle } from '@/components/ThemeToggle'

const PRIORITY_OPTIONS: { value: Priority | null; label: string }[] = [
  { value: null, label: '전체' },
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW', label: '낮음' },
]

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeView, setActiveView] = useState<View>('all')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTodos = useCallback(async () => {
    const params = new URLSearchParams()
    if (activeView !== 'all') params.set('view', activeView)
    if (activeCategoryId) params.set('categoryId', activeCategoryId)
    if (priorityFilter) params.set('priority', priorityFilter)

    const res = await fetch(`/api/todos?${params}`)
    if (!res.ok) { toast.error('할 일을 불러오지 못했습니다'); return }
    setTodos(await res.json())
  }, [activeView, activeCategoryId, priorityFilter])

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    if (!res.ok) return
    setCategories(await res.json())
  }, [])

  useEffect(() => {
    Promise.all([fetchTodos(), fetchCategories()]).finally(() => setLoading(false))
  }, [fetchTodos, fetchCategories])

  const handleAdd = async (data: {
    title: string
    priority: Priority
    dueDate: string | null
    categoryId: string | null
  }): Promise<boolean> => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('할 일을 추가하지 못했습니다'); return false }
    await fetchTodos()
    toast.success('할 일이 추가되었습니다')
    return true
  }

  const handleToggle = async (id: string, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
    if (!res.ok) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)))
      toast.error('업데이트에 실패했습니다')
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('삭제에 실패했습니다'); return }
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const handleAddCategory = async () => {
    const name = prompt('카테고리 이름을 입력하세요')
    if (!name?.trim()) return
    const colors = ['#7c3aed', '#059669', '#d97706', '#ef4444', '#3b82f6']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color }),
    })
    if (!res.ok) { toast.error('카테고리 추가에 실패했습니다'); return }
    const cat = await res.json()
    setCategories((prev) => [...prev, cat])
  }

  const handleViewChange = (view: View) => {
    setActiveView(view)
    setActiveCategoryId(null)
  }

  const handleCategoryChange = (id: string | null) => {
    setActiveCategoryId(id)
    setActiveView('all')
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#1a1a2e] border-b border-[#2d2d4e] px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-violet-400 font-bold text-base">✓ MyTodo</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-3 py-1.5 rounded-full transition-colors"
          >
            + 새 할 일
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          activeView={activeView}
          activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />

        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span className="text-xs text-gray-500">우선순위:</span>
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => setPriorityFilter(value)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  priorityFilter === value
                    ? 'bg-indigo-950 text-violet-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-gray-600 text-sm">불러오는 중...</div>
          ) : (
            <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
          )}
        </main>
      </div>

      <BottomTabBar activeView={activeView} onViewChange={handleViewChange} />

      {showForm && (
        <AddTodoForm
          categories={categories}
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
