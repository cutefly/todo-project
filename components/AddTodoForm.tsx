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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a2e] rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-100 mb-4">새 할 일</h2>

        <input
          autoFocus
          type="text"
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#0f0f1a] border border-[#2d2d4e] rounded-lg px-4 py-2 text-gray-100 placeholder-gray-600 mb-3 focus:outline-none focus:border-violet-500"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">우선순위</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-[#0f0f1a] border border-[#2d2d4e] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="HIGH">높음</option>
              <option value="MEDIUM">중간</option>
              <option value="LOW">낮음</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">마감일</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0f0f1a] border border-[#2d2d4e] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-[#2d2d4e] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="">없음</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-[#2d2d4e] text-gray-400 hover:text-gray-200 text-sm"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  )
}
