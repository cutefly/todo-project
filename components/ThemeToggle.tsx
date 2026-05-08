'use client'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
