// app/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { Category, Priority, Todo, View } from '@/types'
import { TodoList } from '@/components/TodoList'
import { AddTodoForm } from '@/components/AddTodoForm'
import { IconSidebar } from '@/components/IconSidebar'
import { LibraryPanel } from '@/components/LibraryPanel'
import { ProgressBar } from '@/components/ProgressBar'
import { BottomTabBar } from '@/components/BottomTabBar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { EditTodoModal } from '@/components/EditTodoModal'

const PRIORITY_OPTIONS: { value: Priority | null; label: string }[] = [
  { value: null,     label: '전체' },
  { value: 'HIGH',   label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW',    label: '낮음' },
]

const VIEW_LABELS: Record<View, string> = {
  all:      '전체 할 일',
  today:    '오늘 할 일',
  upcoming: '예정 할 일',
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeView, setActiveView] = useState<View>('all')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showMobileLibrary, setShowMobileLibrary] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

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

  const handleEditSave = async (
    id: string,
    data: { title: string; priority: Priority; dueDate: string | null; categoryId: string | null }
  ): Promise<boolean> => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('수정에 실패했습니다'); return false }
    const updated: Todo = await res.json()
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    toast.success('할 일이 수정되었습니다')
    return true
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
    setShowMobileLibrary(false)
  }

  const handleCategoryChange = (id: string | null) => {
    setActiveCategoryId(id)
    setActiveView('all')
    setShowMobileLibrary(false)
  }

  const completedCount = todos.filter((t) => t.completed).length
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null
  const currentTitle = activeCategory?.name ?? VIEW_LABELS[activeView]

  return (
    <div className="flex flex-col h-screen bg-spotify-base">
      {/* Mobile header */}
      <header className="md:hidden bg-spotify-sidebar px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-spotify-green font-black text-lg">✓</span>
        <span className="text-sp-base font-bold text-spotify-text">{currentTitle}</span>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <IconSidebar
          activeView={activeView}
          activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange}
        />

        <LibraryPanel
          categories={categories}
          totalTodos={todos.length}
          activeView={activeView}
          activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <h1 className="text-sp-xl font-bold text-spotify-text mb-3">{currentTitle}</h1>
            <div className="flex gap-2 flex-wrap">
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setPriorityFilter(value)}
                  className={`text-sp-xs px-3 py-1 rounded-pill transition-colors font-bold ${
                    priorityFilter === value
                      ? 'bg-spotify-elevated text-spotify-text'
                      : 'bg-transparent text-spotify-muted border border-spotify-border hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-20 md:pb-4">
            {loading ? (
              <div className="flex justify-center py-16 text-spotify-muted text-sp-sm">
                불러오는 중...
              </div>
            ) : (
              <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingTodo} />
            )}
          </div>
        </main>
      </div>

      <ProgressBar
        activeView={activeView}
        categoryName={activeCategory?.name ?? null}
        total={todos.length}
        completed={completedCount}
        onAdd={() => setShowForm(true)}
      />

      <BottomTabBar
        activeView={activeView}
        activeCategoryId={activeCategoryId}
        onViewChange={handleViewChange}
        onCategoryOpen={() => setShowMobileLibrary(true)}
      />

      {/* Mobile category sheet */}
      {showMobileLibrary && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setShowMobileLibrary(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-spotify-base rounded-t-xl max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-card">
              <span className="text-sp-base font-bold text-spotify-text">내 라이브러리</span>
              <button onClick={() => setShowMobileLibrary(false)} className="text-spotify-muted hover:text-spotify-text text-xl">✕</button>
            </div>
            <div className="overflow-y-auto p-2 pb-6">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors mb-1 ${
                  !activeCategoryId ? 'bg-spotify-elevated' : 'hover:bg-spotify-card'
                }`}
              >
                <div className="w-9 h-9 rounded bg-spotify-card flex items-center justify-center shrink-0 text-base">⊞</div>
                <div className="text-left">
                  <p className="text-sp-sm font-bold text-spotify-text">전체 할 일</p>
                  <p className="text-sp-xs text-spotify-muted">{todos.length}개 항목</p>
                </div>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors mb-1 ${
                    activeCategoryId === cat.id ? 'bg-spotify-elevated' : 'hover:bg-spotify-card'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded shrink-0 flex items-center justify-center text-sp-xs font-bold text-white"
                    style={{ background: cat.color }}
                  >
                    {cat.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sp-sm font-bold text-spotify-text">{cat.name}</p>
                    <p className="text-sp-xs text-spotify-muted">카테고리</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 rounded-circle bg-spotify-green text-black flex items-center justify-center text-2xl font-bold shadow-spotify-heavy z-20"
        onClick={() => setShowForm(true)}
        aria-label="새 할 일 추가"
      >
        +
      </button>

      {showForm && (
        <AddTodoForm
          categories={categories}
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          categories={categories}
          onSave={handleEditSave}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  )
}
