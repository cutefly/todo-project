'use client'
import type { Category, View } from '@/types'

interface SidebarProps {
  categories: Category[]
  activeView: View
  activeCategoryId: string | null
  onViewChange: (view: View) => void
  onCategoryChange: (id: string | null) => void
  onAddCategory: () => void
}

const VIEW_LABELS: Record<View, string> = {
  all: '📋 전체',
  today: '📅 오늘',
  upcoming: '⏰ 예정',
}

export function Sidebar({
  categories,
  activeView,
  activeCategoryId,
  onViewChange,
  onCategoryChange,
  onAddCategory,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-48 shrink-0 bg-[#13131f] border-r border-[#2d2d4e] p-4 gap-1 overflow-y-auto">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">뷰</p>
      {(['all', 'today', 'upcoming'] as View[]).map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`text-sm text-left px-3 py-2 rounded-md transition-colors ${
            activeView === view && !activeCategoryId
              ? 'bg-indigo-950 text-violet-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {VIEW_LABELS[view]}
        </button>
      ))}

      <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-2">카테고리</p>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`text-sm text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
            activeCategoryId === cat.id
              ? 'bg-indigo-950 text-violet-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
          {cat.name}
        </button>
      ))}
      <button
        onClick={onAddCategory}
        className="text-xs text-gray-600 hover:text-gray-400 px-3 py-1 text-left mt-1"
      >
        + 카테고리 추가
      </button>
    </aside>
  )
}
