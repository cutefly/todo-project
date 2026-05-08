// components/BottomTabBar.tsx
'use client'
import type { View } from '@/types'

interface BottomTabBarProps {
  activeView: View
  activeCategoryId: string | null
  onViewChange: (view: View) => void
  onCategoryOpen: () => void
}

const TABS: { view: View; label: string; icon: string }[] = [
  { view: 'all',      label: '전체', icon: '⊞' },
  { view: 'today',    label: '오늘', icon: '📅' },
  { view: 'upcoming', label: '예정', icon: '⏰' },
]

export function BottomTabBar({ activeView, activeCategoryId, onViewChange, onCategoryOpen }: BottomTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-spotify-surface border-t border-spotify-card flex justify-around py-2 z-10">
      {TABS.map(({ view, label, icon }) => {
        const active = activeView === view && !activeCategoryId
        return (
          <button key={view} onClick={() => onViewChange(view)} className="flex flex-col items-center gap-1">
            <span className={`text-base ${active ? '' : 'opacity-50'}`}>{icon}</span>
            <span className={`text-sp-xs ${active ? 'text-spotify-green font-bold' : 'text-spotify-muted'}`}>
              {label}
            </span>
          </button>
        )
      })}
      <button onClick={onCategoryOpen} className="flex flex-col items-center gap-1">
        <span className={`text-base ${activeCategoryId ? '' : 'opacity-50'}`}>🏷</span>
        <span className={`text-sp-xs ${activeCategoryId ? 'text-spotify-green font-bold' : 'text-spotify-muted'}`}>
          카테고리
        </span>
      </button>
    </nav>
  )
}
