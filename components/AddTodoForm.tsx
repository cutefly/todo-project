// components/AddTodoForm.tsx
'use client'
import { useState } from 'react'
import type { Category, Priority } from '@/types'

interface AddTodoFormProps {
  categories: Category[]
  onAdd: (data: {
    title: string
    priority: Priority
    dueDate: string | null
    categoryId: string | null
  }) => Promise<boolean>
  onClose: () => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'HIGH',   label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW',    label: '낮음' },
]

export function AddTodoForm({ categories, onAdd, onClose }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const success = await onAdd({
      title: title.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      categoryId: categoryId || null,
    })
    setLoading(false)
    if (success) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-spotify-surface rounded-lg p-6 w-full max-w-md shadow-spotify-heavy border border-spotify-card"
      >
        <h2 className="text-sp-lg font-bold text-spotify-text mb-5">새 할 일</h2>

        <input
          autoFocus
          type="text"
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-spotify-elevated rounded-pill px-5 py-2.5 text-spotify-text text-sp-base placeholder-spotify-muted mb-3 focus:outline-none"
          style={{ boxShadow: '0 0 0 1px var(--sp-border) inset' }}
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="bg-spotify-elevated border border-spotify-border rounded-pill px-4 py-2 text-spotify-text text-sp-sm focus:outline-none"
          >
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-spotify-elevated border border-spotify-border rounded-pill px-4 py-2 text-spotify-muted text-sp-sm focus:outline-none"
          />
        </div>

        {categories.length > 0 && (
          <div className="mb-5">
            <p className="text-sp-xs text-spotify-muted uppercase tracking-sp-nav mb-2">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(categoryId === cat.id ? '' : cat.id)}
                  className={`rounded-pill px-3 py-1 text-sp-sm font-bold transition-colors ${
                    categoryId === cat.id
                      ? 'text-white'
                      : 'bg-spotify-elevated border border-spotify-border text-spotify-muted hover:text-spotify-text'
                  }`}
                  style={categoryId === cat.id ? { background: cat.color } : undefined}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-pill border border-spotify-border text-spotify-text text-sp-sm font-bold uppercase tracking-sp-btn hover:border-spotify-text transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="px-6 py-2 rounded-pill-lg bg-spotify-green text-black text-sp-sm font-bold uppercase tracking-sp-btn hover:bg-[#1fdf64] disabled:opacity-50 transition-colors"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  )
}
