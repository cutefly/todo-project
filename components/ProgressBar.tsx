// components/ProgressBar.tsx
'use client'
import type { View } from '@/types'

const VIEW_LABELS: Record<View, string> = {
  all:      '전체 할 일',
  today:    '오늘 할 일',
  upcoming: '예정 할 일',
}

interface ProgressBarProps {
  activeView: View
  categoryName: string | null
  total: number
  completed: number
  onAdd: () => void
}

export function ProgressBar({ activeView, categoryName, total, completed, onAdd }: ProgressBarProps) {
  const label = categoryName ?? VIEW_LABELS[activeView]
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="hidden md:flex items-center gap-4 bg-spotify-surface border-t border-spotify-card shadow-spotify-bottom px-4 py-3 shrink-0">
      <div className="w-48 shrink-0">
        <p className="text-sp-base font-bold text-spotify-text truncate">{label}</p>
        <p className="text-sp-xs text-spotify-muted">{completed} / {total} 완료</p>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="h-[3px] rounded-full bg-spotify-border overflow-hidden">
          <div
            className="h-full bg-spotify-green rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-sp-xs text-spotify-muted">0%</span>
          <span className="text-sp-xs text-spotify-muted">{percent}%</span>
        </div>
      </div>

      <div className="w-36 shrink-0 flex justify-end">
        <button
          onClick={onAdd}
          aria-label="새 할 일 추가"
          className="bg-spotify-green text-black rounded-pill-lg px-4 py-2 text-sp-xs font-bold uppercase tracking-sp-btn hover:bg-[#1fdf64] transition-colors"
        >
          + 새 할 일
        </button>
      </div>
    </div>
  )
}
