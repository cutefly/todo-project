'use client'
import type { View } from '@/types'

interface BottomTabBarProps {
  activeView: View
  onViewChange: (view: View) => void
}

const TABS: { view: View; label: string; icon: string }[] = [
  { view: 'all', label: '전체', icon: '📋' },
  { view: 'today', label: '오늘', icon: '📅' },
  { view: 'upcoming', label: '예정', icon: '⏰' },
]

export function BottomTabBar({ activeView, onViewChange }: BottomTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-[#2d2d4e] flex justify-around py-2 z-10">
      {TABS.map(({ view, label, icon }) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-base">{icon}</span>
          <span className={`text-xs ${activeView === view ? 'text-violet-400' : 'text-gray-500'}`}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
