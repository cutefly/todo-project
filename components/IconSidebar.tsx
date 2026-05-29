// components/IconSidebar.tsx
'use client'
import type { View } from '@/types'
import { ThemeToggle } from './ThemeToggle'

interface IconSidebarProps {
  activeView: View
  activeCategoryId: string | null
  onViewChange: (view: View) => void
}

const NAV_ITEMS: { view: View; icon: string; label: string }[] = [
  { view: 'all',      icon: '⊞', label: '전체' },
  { view: 'today',    icon: '📅', label: '오늘' },
  { view: 'upcoming', icon: '⏰', label: '예정' },
]

export function IconSidebar({ activeView, activeCategoryId, onViewChange }: IconSidebarProps) {
  const isActive = (view: View) => activeView === view && !activeCategoryId

  return (
    <div className="hidden md:flex flex-col items-center w-[62px] shrink-0 bg-spotify-sidebar py-4 gap-0.5">
      <span className="text-spotify-green text-lg font-black mb-4">✓</span>

      {NAV_ITEMS.map(({ view, icon, label }) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className="w-full flex flex-col items-center py-2 gap-1"
        >
          <div
            className={`w-7 h-7 rounded-circle flex items-center justify-center text-sm transition-colors ${
              isActive(view) ? 'bg-spotify-elevated' : ''
            }`}
          >
            {icon}
          </div>
          <span
            className={`text-sp-xs transition-colors ${
              isActive(view) ? 'text-spotify-text font-bold' : 'text-spotify-muted'
            }`}
          >
            {label}
          </span>
        </button>
      ))}

      <div className="mt-auto pt-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
