// components/LibraryPanel.tsx
'use client'
import type { Category, View } from '@/types'

interface LibraryPanelProps {
  categories: Category[]
  totalTodos: number
  activeView: View
  activeCategoryId: string | null
  onViewChange: (view: View) => void
  onCategoryChange: (id: string | null) => void
  onAddCategory: () => void
}

export function LibraryPanel({
  categories,
  totalTodos,
  activeView,
  activeCategoryId,
  onViewChange,
  onCategoryChange,
  onAddCategory,
}: LibraryPanelProps) {
  const isAllActive = activeCategoryId === null && activeView === 'all'

  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-spotify-base overflow-hidden border-r border-spotify-card">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sp-base font-bold text-white">내 라이브러리</span>
        <button
          onClick={onAddCategory}
          aria-label="카테고리 추가"
          className="text-spotify-muted hover:text-white transition-colors text-xl leading-none"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {/* 전체 할 일 */}
        <button
          onClick={() => { onCategoryChange(null); onViewChange('all') }}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors mb-1 ${
            isAllActive ? 'bg-spotify-elevated' : 'hover:bg-spotify-card'
          }`}
        >
          <div className="w-9 h-9 rounded bg-spotify-card flex items-center justify-center shrink-0 text-base">
            ⊞
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sp-sm font-bold text-white truncate">전체 할 일</p>
            <p className="text-sp-xs text-spotify-muted">{totalTodos}개 항목</p>
          </div>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
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
            <div className="text-left overflow-hidden">
              <p className="text-sp-sm font-bold text-white truncate">{cat.name}</p>
              <p className="text-sp-xs text-spotify-muted">카테고리</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
