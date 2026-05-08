# Spotify UI 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** DESIGN.md 기반 Spotify 디자인 시스템을 Tailwind 토큰으로 코드화하고, 아이콘 사이드바 + 라이브러리 패널 + 메인 콘텐츠 + 하단 진행 바 레이아웃으로 전면 재설계한다.

**Architecture:** Tailwind `theme.extend`에 Spotify 토큰 등록 → 신규 컴포넌트(IconSidebar, LibraryPanel, ProgressBar) 생성 → 기존 컴포넌트(TodoItem, TodoList, AddTodoForm, BottomTabBar) 스타일 교체 → page.tsx 레이아웃 통합 → E2E 셀렉터 수정.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, TypeScript, Playwright (E2E)

---

### Task 1: Tailwind 디자인 토큰 등록 + 폰트 설정

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: tailwind.config.ts에 Spotify 토큰 추가**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          base:     '#121212',
          surface:  '#181818',
          elevated: '#1f1f1f',
          card:     '#282828',
          green:    '#1ed760',
          muted:    '#b3b3b3',
          border:   '#535353',
          negative: '#f3727f',
          warning:  '#ffa42b',
        },
      },
      borderRadius: {
        pill:      '9999px',
        'pill-lg': '500px',
        circle:    '50%',
      },
      boxShadow: {
        'spotify-heavy':  'rgba(0,0,0,0.5) 0px 8px 24px',
        'spotify-medium': 'rgba(0,0,0,0.3) 0px 8px 8px',
        'spotify-bottom': 'rgba(0,0,0,0.5) 0px -8px 24px',
      },
      fontSize: {
        'sp-xs':   ['10px', { lineHeight: 'normal' }],
        'sp-sm':   ['12px', { lineHeight: '1.5' }],
        'sp-base': ['14px', { lineHeight: 'normal' }],
        'sp-md':   ['16px', { lineHeight: 'normal' }],
        'sp-lg':   ['18px', { lineHeight: '1.3' }],
        'sp-xl':   ['24px', { lineHeight: 'normal' }],
      },
      letterSpacing: {
        'sp-btn': '1.4px',
        'sp-nav': '2px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: layout.tsx — Noto Sans KR 적용, 배경 교체**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MyTodo',
  description: '개인용 할 일 관리 앱',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch{}`,
          }}
        />
      </head>
      <body className={`${notoSansKR.className} bg-spotify-base text-white min-h-screen`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully` (no TypeScript errors)

- [ ] **Step 4: 커밋**

```bash
git add tailwind.config.ts app/layout.tsx
git commit -m "feat: add Spotify design tokens to Tailwind config"
```

---

### Task 2: ThemeToggle 스타일 업데이트

**Files:**
- Modify: `components/ThemeToggle.tsx`

- [ ] **Step 1: Spotify 토큰으로 스타일 교체**

```tsx
// components/ThemeToggle.tsx
'use client'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      className="w-7 h-7 rounded-circle bg-spotify-elevated flex items-center justify-center text-spotify-muted hover:text-white transition-colors text-sm"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/ThemeToggle.tsx
git commit -m "feat: restyle ThemeToggle with Spotify tokens"
```

---

### Task 3: IconSidebar 컴포넌트 생성

**Files:**
- Create: `components/IconSidebar.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
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
    <div className="hidden md:flex flex-col items-center w-[62px] shrink-0 bg-black py-4 gap-0.5">
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
              isActive(view) ? 'text-white font-bold' : 'text-spotify-muted'
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/IconSidebar.tsx
git commit -m "feat: add IconSidebar component"
```

---

### Task 4: LibraryPanel 컴포넌트 생성

**Files:**
- Create: `components/LibraryPanel.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
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
  const isAllActive = activeCategoryId === null

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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/LibraryPanel.tsx
git commit -m "feat: add LibraryPanel component"
```

---

### Task 5: ProgressBar 컴포넌트 생성

**Files:**
- Create: `components/ProgressBar.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
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
        <p className="text-sp-base font-bold text-white truncate">{label}</p>
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/ProgressBar.tsx
git commit -m "feat: add ProgressBar component"
```

---

### Task 6: TodoItem 수정

**Files:**
- Modify: `components/TodoItem.tsx`

- [ ] **Step 1: TodoItem 전체 교체**

```tsx
// components/TodoItem.tsx
'use client'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

const PRIORITY_COLORS = { HIGH: '#f3727f', MEDIUM: '#ffa42b', LOW: '#535353' }
const PRIORITY_LABELS = { HIGH: 'HIGH', MEDIUM: 'MED', LOW: 'LOW' }

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return '오늘'
  if (date.toDateString() === tomorrow.toDateString()) return '내일'
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`grid grid-cols-[20px_1fr_90px_70px_20px] gap-3 px-3 py-2 rounded items-center group hover:bg-spotify-elevated transition-colors ${
        todo.completed ? 'opacity-[0.45]' : ''
      }`}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? '완료 취소' : '완료'}
        className={`w-[14px] h-[14px] rounded-circle border-2 shrink-0 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-spotify-green border-spotify-green'
            : 'border-spotify-border group-hover:border-spotify-green'
        }`}
      >
        {todo.completed && (
          <span className="text-black text-[8px] font-bold leading-none">✓</span>
        )}
      </button>

      <div className="overflow-hidden">
        <p
          className={`text-sp-base font-bold truncate ${
            todo.completed ? 'line-through text-spotify-muted' : 'text-white'
          }`}
        >
          {todo.title}
        </p>
        {todo.category && (
          <p className="text-sp-xs text-spotify-muted truncate">{todo.category.name}</p>
        )}
      </div>

      <span className="text-sp-xs text-spotify-muted text-center">
        {todo.dueDate ? formatDate(todo.dueDate) : '—'}
      </span>

      <span
        className="text-sp-xs text-center font-bold"
        style={{ color: PRIORITY_COLORS[todo.priority] }}
      >
        ● {PRIORITY_LABELS[todo.priority]}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
        className="text-spotify-border hover:text-spotify-negative transition-colors text-xs opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/TodoItem.tsx
git commit -m "feat: restyle TodoItem with Spotify tokens and table layout"
```

---

### Task 7: TodoList 수정

**Files:**
- Modify: `components/TodoList.tsx`

- [ ] **Step 1: TodoList — 헤더 행 추가, Spotify 스타일**

```tsx
// components/TodoList.tsx
import type { Todo } from '@/types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-spotify-muted">
        <p className="text-4xl mb-3">✓</p>
        <p className="text-sp-sm">할 일이 없습니다</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-[20px_1fr_90px_70px_20px] gap-3 px-3 py-2 border-b border-spotify-card mb-1">
        <span className="text-sp-xs text-spotify-muted">#</span>
        <span className="text-sp-xs text-spotify-muted">제목</span>
        <span className="text-sp-xs text-spotify-muted text-center">마감일</span>
        <span className="text-sp-xs text-spotify-muted text-center">우선순위</span>
        <span />
      </div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/TodoList.tsx
git commit -m "feat: add header row to TodoList with Spotify styling"
```

---

### Task 8: AddTodoForm 수정

**Files:**
- Modify: `components/AddTodoForm.tsx`

- [ ] **Step 1: AddTodoForm 전체 교체**

```tsx
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
        <h2 className="text-sp-lg font-bold text-white mb-5">새 할 일</h2>

        <input
          autoFocus
          type="text"
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-spotify-elevated rounded-pill px-5 py-2.5 text-white text-sp-base placeholder-spotify-muted mb-3 focus:outline-none"
          style={{ boxShadow: 'rgb(124,124,124) 0px 0px 0px 1px inset' }}
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="bg-spotify-elevated border border-spotify-border rounded-pill px-4 py-2 text-white text-sp-sm focus:outline-none"
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
                      : 'bg-spotify-elevated border border-spotify-border text-spotify-muted hover:text-white'
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
            className="px-5 py-2 rounded-pill border border-[#7c7c7c] text-white text-sp-sm font-bold uppercase tracking-sp-btn hover:border-white transition-colors"
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: 커밋**

```bash
git add components/AddTodoForm.tsx
git commit -m "feat: restyle AddTodoForm with Spotify pill inputs and category chips"
```

---

### Task 9: BottomTabBar 수정

**Files:**
- Modify: `components/BottomTabBar.tsx`

- [ ] **Step 1: BottomTabBar — 4탭 확장, Spotify 스타일**

```tsx
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: TypeScript 에러 예상 — page.tsx가 아직 구 BottomTabBar 인터페이스를 쓰므로 Task 10에서 수정.

- [ ] **Step 3: 커밋**

```bash
git add components/BottomTabBar.tsx
git commit -m "feat: extend BottomTabBar to 4 tabs with Spotify styling"
```

---

### Task 10: page.tsx 레이아웃 통합 + Sidebar.tsx 삭제

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/Sidebar.tsx`

- [ ] **Step 1: page.tsx 전체 교체**

```tsx
// app/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { Category, Priority, Todo, View } from '@/types'
import { TodoList } from '@/components/TodoList'
import { AddTodoForm } from '@/components/AddTodoForm'
import { IconSidebar } from '@/components/IconSidebar'
import { LibraryPanel } from '@/components/LibraryPanel'
import { ProgressBar } from '@/components/ProgressBar'
import { BottomTabBar } from '@/components/BottomTabBar'
import { ThemeToggle } from '@/components/ThemeToggle'

const PRIORITY_OPTIONS: { value: Priority | null; label: string }[] = [
  { value: null,     label: '전체' },
  { value: 'HIGH',   label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW',    label: '낮음' },
]

const VIEW_LABELS: Record<View, string> = {
  all:      '전체 할 일',
  today:    '오늘 할 일',
  upcoming: '예정 할 일',
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeView, setActiveView] = useState<View>('all')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showMobileLibrary, setShowMobileLibrary] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTodos = useCallback(async () => {
    const params = new URLSearchParams()
    if (activeView !== 'all') params.set('view', activeView)
    if (activeCategoryId) params.set('categoryId', activeCategoryId)
    if (priorityFilter) params.set('priority', priorityFilter)
    const res = await fetch(`/api/todos?${params}`)
    if (!res.ok) { toast.error('할 일을 불러오지 못했습니다'); return }
    setTodos(await res.json())
  }, [activeView, activeCategoryId, priorityFilter])

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    if (!res.ok) return
    setCategories(await res.json())
  }, [])

  useEffect(() => {
    Promise.all([fetchTodos(), fetchCategories()]).finally(() => setLoading(false))
  }, [fetchTodos, fetchCategories])

  const handleAdd = async (data: {
    title: string
    priority: Priority
    dueDate: string | null
    categoryId: string | null
  }): Promise<boolean> => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('할 일을 추가하지 못했습니다'); return false }
    await fetchTodos()
    toast.success('할 일이 추가되었습니다')
    return true
  }

  const handleToggle = async (id: string, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
    if (!res.ok) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)))
      toast.error('업데이트에 실패했습니다')
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('삭제에 실패했습니다'); return }
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const handleAddCategory = async () => {
    const name = prompt('카테고리 이름을 입력하세요')
    if (!name?.trim()) return
    const colors = ['#7c3aed', '#059669', '#d97706', '#ef4444', '#3b82f6']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color }),
    })
    if (!res.ok) { toast.error('카테고리 추가에 실패했습니다'); return }
    const cat = await res.json()
    setCategories((prev) => [...prev, cat])
  }

  const handleViewChange = (view: View) => {
    setActiveView(view)
    setActiveCategoryId(null)
    setShowMobileLibrary(false)
  }

  const handleCategoryChange = (id: string | null) => {
    setActiveCategoryId(id)
    setActiveView('all')
    setShowMobileLibrary(false)
  }

  const completedCount = todos.filter((t) => t.completed).length
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null
  const currentTitle = activeCategory?.name ?? VIEW_LABELS[activeView]

  return (
    <div className="flex flex-col h-screen bg-spotify-base">
      {/* Mobile header */}
      <header className="md:hidden bg-black px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-spotify-green font-black text-lg">✓</span>
        <span className="text-sp-base font-bold text-white">{currentTitle}</span>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <IconSidebar
          activeView={activeView}
          activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange}
        />

        <LibraryPanel
          categories={categories}
          totalTodos={todos.length}
          activeView={activeView}
          activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <h1 className="text-sp-xl font-bold text-white mb-3">{currentTitle}</h1>
            <div className="flex gap-2 flex-wrap">
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setPriorityFilter(value)}
                  className={`text-sp-xs px-3 py-1 rounded-pill transition-colors font-bold ${
                    priorityFilter === value
                      ? 'bg-spotify-elevated text-white'
                      : 'bg-transparent text-spotify-muted border border-spotify-border hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-20 md:pb-4">
            {loading ? (
              <div className="flex justify-center py-16 text-spotify-muted text-sp-sm">
                불러오는 중...
              </div>
            ) : (
              <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
            )}
          </div>
        </main>
      </div>

      <ProgressBar
        activeView={activeView}
        categoryName={activeCategory?.name ?? null}
        total={todos.length}
        completed={completedCount}
        onAdd={() => setShowForm(true)}
      />

      <BottomTabBar
        activeView={activeView}
        activeCategoryId={activeCategoryId}
        onViewChange={handleViewChange}
        onCategoryOpen={() => setShowMobileLibrary(true)}
      />

      {/* Mobile category sheet */}
      {showMobileLibrary && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setShowMobileLibrary(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-spotify-base rounded-t-xl max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-card">
              <span className="text-sp-base font-bold text-white">내 라이브러리</span>
              <button onClick={() => setShowMobileLibrary(false)} className="text-spotify-muted hover:text-white text-xl">✕</button>
            </div>
            <div className="overflow-y-auto p-2 pb-6">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors mb-1 ${
                  !activeCategoryId ? 'bg-spotify-elevated' : 'hover:bg-spotify-card'
                }`}
              >
                <div className="w-9 h-9 rounded bg-spotify-card flex items-center justify-center shrink-0 text-base">⊞</div>
                <div className="text-left">
                  <p className="text-sp-sm font-bold text-white">전체 할 일</p>
                  <p className="text-sp-xs text-spotify-muted">{todos.length}개 항목</p>
                </div>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
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
                  <div className="text-left">
                    <p className="text-sp-sm font-bold text-white">{cat.name}</p>
                    <p className="text-sp-xs text-spotify-muted">카테고리</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 rounded-circle bg-spotify-green text-black flex items-center justify-center text-2xl font-bold shadow-spotify-heavy z-20"
        onClick={() => setShowForm(true)}
        aria-label="새 할 일 추가"
      >
        +
      </button>

      {showForm && (
        <AddTodoForm
          categories={categories}
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Sidebar.tsx 삭제**

```bash
rm components/Sidebar.tsx
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: integrate Spotify layout in page.tsx, remove Sidebar.tsx"
```

---

### Task 11: E2E 테스트 셀렉터 수정

**Files:**
- Modify: `tests/e2e/todo.spec.ts`

변경 이유:
1. `button:has-text("+ 새 할 일")` — 데스크탑 ProgressBar에만 존재, 모바일에선 FAB(`+`)만 있음 → `[aria-label="새 할 일 추가"]` 로 통일
2. `nav button:has-text("오늘") span` 색상 — violet-400(`rgb(167,139,250)`) → Spotify Green(`rgb(30,215,96)`)

- [ ] **Step 1: 현재 테스트 실행하여 실패 항목 확인**

```bash
npm run test:e2e 2>&1 | tail -30
```

Expected: `button:has-text("+ 새 할 일")` 관련 테스트 실패 (모바일 프로젝트)

- [ ] **Step 2: 셀렉터 수정**

```typescript
// tests/e2e/todo.spec.ts
import { test, expect } from '@playwright/test'

test.describe('할 일 추가', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('새 할 일을 추가하면 목록에 표시된다', async ({ page }) => {
    await page.click('[aria-label="새 할 일 추가"]')
    await page.fill('input[placeholder="할 일을 입력하세요"]', 'E2E 테스트 할 일')
    await page.getByRole('button', { name: '추가', exact: true }).click()
    await expect(page.locator('text=E2E 테스트 할 일').first()).toBeVisible()
  })

  test('빈 제목으로는 추가 버튼이 비활성화된다', async ({ page }) => {
    await page.click('[aria-label="새 할 일 추가"]')
    await expect(page.getByRole('button', { name: '추가', exact: true })).toBeDisabled()
  })

  test('취소 버튼을 누르면 모달이 닫힌다', async ({ page }) => {
    await page.click('[aria-label="새 할 일 추가"]')
    await expect(page.locator('form h2')).toBeVisible()
    await page.click('button:has-text("취소")')
    await expect(page.locator('form h2')).not.toBeVisible()
  })
})

test.describe('할 일 완료 토글', () => {
  test('체크박스 클릭 시 완료 상태로 변경된다', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="새 할 일 추가"]')
    await page.fill('input[placeholder="할 일을 입력하세요"]', '완료 테스트')
    await page.getByRole('button', { name: '추가', exact: true }).click()

    const todoItem = page.locator('[aria-label="완료"]').first()
    await todoItem.click()
    const toggledContainer = page.locator('[aria-label="완료 취소"]').first().locator('..')
    await expect(toggledContainer.locator('p').first()).toHaveCSS('text-decoration-line', 'line-through')
  })
})

test.describe('필터링', () => {
  test('높음 우선순위 필터 클릭 시 해당 항목만 표시된다', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="새 할 일 추가"]')
    await page.fill('input[placeholder="할 일을 입력하세요"]', '높음 우선순위 할 일')
    await page.selectOption('select', { value: 'HIGH' })
    await page.getByRole('button', { name: '추가', exact: true }).click()

    await page.click('button:has-text("높음")')
    await expect(page.locator('text=높음 우선순위 할 일').first()).toBeVisible()
  })
})

test.describe('다크/라이트 모드 토글', () => {
  test('테마 토글 버튼 클릭 시 html 클래스가 변경된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.click('[aria-label="테마 전환"]')
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await page.click('[aria-label="테마 전환"]')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})

test.describe('모바일 레이아웃', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('모바일에서 하단 탭 바가 표시된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav:has(button:has-text("전체"))')).toBeVisible()
  })

  test('모바일에서 사이드바가 숨겨진다', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('aside')).not.toBeVisible()
  })

  test('하단 탭 클릭 시 뷰가 전환된다', async ({ page }) => {
    await page.goto('/')
    await page.click('nav button:has-text("오늘")')
    await expect(page.locator('nav button:has-text("오늘") span').last()).toHaveCSS('color', 'rgb(30, 215, 96)')
  })
})
```

- [ ] **Step 3: E2E 테스트 전체 실행**

```bash
npm run test:e2e
```

Expected: `18 passed`

- [ ] **Step 4: 커밋**

```bash
git add tests/e2e/todo.spec.ts
git commit -m "fix: update E2E selectors for Spotify UI redesign"
```

---

## 자가 검토

**스펙 커버리지 확인:**
- ✅ Tailwind 토큰 등록 (Task 1)
- ✅ IconSidebar — 62px 아이콘 바 (Task 3)
- ✅ LibraryPanel — 220px 카테고리 패널 (Task 4)
- ✅ ProgressBar — 하단 진행 바 + 추가 버튼 (Task 5)
- ✅ TodoItem — 원형 체크, 테이블형 행 (Task 6)
- ✅ TodoList — 헤더 행 (Task 7)
- ✅ AddTodoForm — pill 입력, 카테고리 칩 (Task 8)
- ✅ BottomTabBar — 4탭 (Task 9)
- ✅ 모바일 카테고리 시트 (Task 10 page.tsx)
- ✅ 모바일 FAB (Task 10 page.tsx)
- ✅ E2E 셀렉터 (Task 11)
- ✅ Sidebar.tsx 삭제 (Task 10)

**타입 일관성 확인:**
- `LibraryPanel` props: `totalTodos: number` ← page.tsx에서 `todos.length` 전달 ✓
- `ProgressBar` props: `categoryName: string | null` ← page.tsx에서 `activeCategory?.name ?? null` 전달 ✓
- `BottomTabBar` props: `activeCategoryId`, `onCategoryOpen` 추가 ← page.tsx에서 전달 ✓
- `IconSidebar` props: `activeCategoryId` ← page.tsx에서 전달 ✓
