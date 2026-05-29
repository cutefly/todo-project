// components/ThemeToggle.tsx
'use client'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      className="w-7 h-7 rounded-circle bg-spotify-elevated flex items-center justify-center text-spotify-muted hover:text-spotify-text transition-colors text-sm"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
