# Spotify UI 리디자인 스펙

**날짜:** 2026-05-08
**상태:** 승인됨
**참조:** `DESIGN.md` (Spotify 디자인 시스템 정의)

---

## 개요

기존 Todo 앱의 UI를 Spotify 웹 앱 레이아웃과 디자인 언어로 전면 재설계한다. `DESIGN.md`에 정의된 색상·타이포·컴포넌트 규칙을 Tailwind 테마 토큰으로 코드화하고, Spotify C 레이아웃(아이콘 사이드바 + 라이브러리 패널 + 메인 콘텐츠 + 하단 진행 바)을 적용한다.

---

## 디자인 시스템 — Tailwind 토큰 매핑

`DESIGN.md`의 값을 `tailwind.config.ts`의 `theme.extend`에 등록한다.

### 색상 (`colors.spotify`)

| 토큰 | 값 | 역할 |
|------|----|------|
| `spotify-base` | `#121212` | 최심층 배경 (페이지) |
| `spotify-surface` | `#181818` | 카드, 하단 바, 라이브러리 패널 상단 |
| `spotify-elevated` | `#1f1f1f` | 호버 행, 버튼 배경, 아이콘 버튼 |
| `spotify-card` | `#282828` | 행 호버 강조, 카테고리 카드 배경 |
| `spotify-green` | `#1ed760` | 브랜드 액센트 — CTA 버튼, 완료 체크, 진행 바 |
| `spotify-muted` | `#b3b3b3` | 비활성 텍스트, 레이블, 부제목 |
| `spotify-border` | `#535353` | 서브 보더, 비활성 outlined 버튼 |
| `spotify-negative` | `#f3727f` | 에러, HIGH 우선순위 색상 |
| `spotify-warning` | `#ffa42b` | 경고, MEDIUM 우선순위 색상 |

### 보더 반경 (`borderRadius`)

| 토큰 | 값 | 용도 |
|------|----|------|
| `pill` | `9999px` | 필터 칩, 소형 버튼, 카테고리 칩 |
| `pill-lg` | `500px` | 대형 CTA 버튼, 모달 추가 버튼 |
| `circle` | `50%` | 체크박스, 아이콘 버튼, FAB |

### 그림자 (`boxShadow`)

| 토큰 | 값 | 용도 |
|------|----|------|
| `spotify-heavy` | `rgba(0,0,0,0.5) 0px 8px 24px` | 모달, FAB |
| `spotify-medium` | `rgba(0,0,0,0.3) 0px 8px 8px` | 드롭다운, 호버 카드 |
| `spotify-bottom` | `rgba(0,0,0,0.5) 0px -8px 24px` | 하단 진행 바 |

### 폰트 크기 (`fontSize`)

| 토큰 | 크기 | 용도 |
|------|----|------|
| `sp-xs` | `10px` | 뱃지, 미세 레이블 |
| `sp-sm` | `12px` | 부제목, 메타 |
| `sp-base` | `14px` | 본문, 버튼 레이블 |
| `sp-md` | `16px` | 강조 본문 |
| `sp-lg` | `18px` | 섹션 헤딩 |
| `sp-xl` | `24px` | 페이지 타이틀 |

### 자간 (`letterSpacing`)

| 토큰 | 값 | 용도 |
|------|----|------|
| `sp-btn` | `1.4px` | 버튼 uppercase 레이블 |
| `sp-nav` | `2px` | 내비게이션 섹션 레이블 |

---

## 레이아웃 구조

### 데스크탑 (md: 768px 이상)

```
┌──────┬───────────────────┬──────────────────────────┐
│ Icon │  Library Panel    │    Main Content          │
│  Bar │  (220px)          │    (flex-1)              │
│(62px)│                   │                          │
│      │  내 라이브러리     │  [페이지 타이틀]          │
│  ✓   │  ─────────────    │  [우선순위 필터 칩]       │
│  ⊞   │  [전체 할 일 카드]│  ─────────────────────   │
│  📅  │  [업무 카드]      │  # │ 제목 │ 마감 │ 우선순위│
│  ⏰  │  [개인 카드]      │  ─────────────────────   │
│      │  [학습 카드]      │  ○  할 일 행들...         │
│  ☾   │  [+ 추가]         │                          │
├──────┴───────────────────┴──────────────────────────┤
│   ProgressBar: [뷰 타이틀 + 완료 수] [====──] [+추가]│
└─────────────────────────────────────────────────────┘
```

### 모바일 (768px 미만)

```
┌─────────────────────────┐
│ ✓  │  전체 할 일  │  ☾  │  ← 상단 바
├─────────────────────────┤
│ [ALL][HIGH][MED][LOW]   │  ← 가로 스크롤 필터 칩
├─────────────────────────┤
│  할 일 목록              │
│  (전체 높이 활용)         │
│                    [+]  │  ← FAB (초록 원형)
├─────────────────────────┤
│  ⊞전체  📅오늘  ⏰예정  🏷카테│  ← 하단 탭 바
└─────────────────────────┘
```

---

## 컴포넌트 상세

### IconSidebar (신규)

- 너비: `62px` 고정, 배경 `#000`
- 최상단: 초록 로고 `✓` (`text-spotify-green`, 18px bold)
- 뷰 버튼 3개: 각 아이콘(28px 원형) + 텍스트 레이블
  - 활성: `bg-spotify-elevated` 원형 배경 + `text-white font-bold`
  - 비활성: 배경 없음 + `text-spotify-muted`
- 하단: 테마 토글 버튼 (28px 원형, `bg-spotify-elevated`)

### LibraryPanel (신규)

- 너비: `220px` 고정, 배경 `#121212`
- 헤더: "내 라이브러리" (14px bold white) + `+` 버튼 (카테고리 추가)
- 필터 칩 행: `rounded-pill`, `bg-spotify-elevated`
- 카테고리 카드 (Spotify 플레이리스트 스타일):
  - 36×36px 컬러 사각형 썸네일 (카테고리 색, `rounded`)
  - 카테고리 이름 (12px bold white) + "카테고리 · N개" (10px muted)
  - 활성: `bg-spotify-elevated`; 호버: `bg-spotify-card`
- "전체 할 일" 항목을 목록 최상단에 고정

### TodoItem (수정)

테이블형 그리드 행 (`grid-cols-[20px_1fr_90px_70px_20px]`):

| 컬럼 | 내용 |
|------|------|
| 체크박스 | `rounded-circle`, 기본: `border-2 border-spotify-border`; 호버: `border-spotify-green`; 완료: `bg-spotify-green` |
| 제목 + 카테고리 | 제목 14px bold white; 카테고리명 10px muted; 완료 시 `line-through opacity-[0.45]` |
| 마감일 | 10px muted; 완료 시 `—` |
| 우선순위 | `● HIGH` `#f3727f` / `● MED` `#ffa42b` / `● LOW` `#535353` |
| 삭제 버튼 | 기본 `text-spotify-border`; 호버 `text-spotify-negative` |

행 배경:
- 기본: 투명
- 호버: `bg-spotify-elevated`
- 완료: 투명 + `opacity-[0.45]` (Tailwind arbitrary value)

### TodoList (수정)

- 목록 상단에 헤더 행 추가 (`border-b border-spotify-card`)
- 컬럼 레이블: `#` / 제목 / 마감일 / 우선순위 — `text-spotify-muted text-sp-xs`

### AddTodoForm (수정)

- 배경: `bg-spotify-surface`, 그림자: `shadow-spotify-heavy`, 보더: `border border-spotify-card`
- 제목 입력: `bg-spotify-elevated rounded-pill-lg`, inset shadow (`rgb(124,124,124) 0px 0px 0px 1px inset`)
- 우선순위 select + 마감일 input: `border border-spotify-border rounded-pill`
- 카테고리: pill 칩 토글 선택 (`rounded-pill bg-spotify-elevated`; 선택 시 카테고리 색)
- 취소 버튼: `border border-[#7c7c7c] rounded-pill text-white uppercase tracking-sp-btn`
- 추가 버튼: `bg-spotify-green text-black rounded-pill-lg uppercase tracking-sp-btn font-bold`

### ProgressBar (신규)

- 배경: `bg-spotify-surface`, 상단 보더: `border-t border-spotify-card`, 그림자: `shadow-spotify-bottom`
- 좌측 (200px): 현재 뷰 이름 (14px bold white) + "N / M 완료" (10px muted)
- 중앙: 진행 바 트랙 (`bg-[#535353]` 3px h) + 진행 fill (`bg-spotify-green`)
- 우측: `+ 추가` 버튼 (`bg-spotify-green rounded-pill-lg text-black uppercase tracking-sp-btn`)
- 모바일에서는 숨김 (`hidden md:flex`)

### BottomTabBar (수정)

- 탭 4개로 확장: 전체(`⊞`) · 오늘(`📅`) · 예정(`⏰`) · 카테고리(`🏷`)
- 활성: `text-spotify-green font-bold`; 비활성: `text-spotify-muted`
- 카테고리 탭 클릭 시: LibraryPanel을 모바일 풀스크린 시트로 표시

---

## 타이포그래피

Spotify 폰트는 상용이므로 `globals.css`에 fallback 스택 적용:

```css
body {
  font-family: 'CircularSp', 'Helvetica Neue', Helvetica, Arial,
    'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans KR',
    Meiryo, sans-serif;
}
```

Noto Sans KR을 한국어 fallback으로 추가한다 (`next/font/google` 사용).

버튼 레이블: `uppercase tracking-sp-btn font-bold` (DESIGN.md §3 Button Uppercase 규칙)

---

## 반응형 전략

| 화면 | 아이콘 바 | 라이브러리 패널 | 진행 바 | 탭 바 | 추가 트리거 |
|------|---------|--------------|--------|------|-----------|
| 데스크탑 (≥768px) | 표시 | 표시 | 표시 | 숨김 | ProgressBar 추가 버튼 |
| 모바일 (<768px) | 숨김 | 숨김 (카테고리 탭으로 접근) | 숨김 | 표시 | FAB |

---

## 변경 파일 목록

| 파일 | 유형 | 주요 변경 |
|------|------|---------|
| `tailwind.config.ts` | 수정 | Spotify 토큰 추가 |
| `app/globals.css` | 수정 | 폰트 패밀리, 기본 배경 |
| `app/layout.tsx` | 수정 | Noto Sans KR 폰트 추가 |
| `app/page.tsx` | 수정 | 3-패널 레이아웃 + ProgressBar 조합 |
| `components/IconSidebar.tsx` | 신규 | 아이콘 뷰 내비게이션 바 |
| `components/LibraryPanel.tsx` | 신규 | 카테고리 라이브러리 패널 |
| `components/ProgressBar.tsx` | 신규 | 하단 완료율 진행 바 |
| `components/Sidebar.tsx` | 삭제 | IconSidebar + LibraryPanel로 대체 |
| `components/TodoItem.tsx` | 수정 | 원형 체크, 테이블형 행 |
| `components/TodoList.tsx` | 수정 | 헤더 행 추가 |
| `components/AddTodoForm.tsx` | 수정 | pill 입력, 카테고리 칩 선택 |
| `components/BottomTabBar.tsx` | 수정 | 4탭 + 카테고리 탭 |
| `components/ThemeToggle.tsx` | 이동 | IconSidebar 내부로 통합 |

---

## 범위 외

- 라이트 모드 스타일 변경 (DESIGN.md는 다크 전용 — 토글 동작만 유지)
- 할 일 수정(인라인 edit) 기능
- 드래그 앤 드롭 정렬
- 애니메이션 / 트랜지션 (기본 `transition-colors`만 적용)
