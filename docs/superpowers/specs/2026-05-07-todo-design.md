# Web To Do 애플리케이션 설계

**날짜:** 2026-05-07  
**상태:** 승인됨

---

## 개요

개인용 웹 기반 To Do 애플리케이션. 마감일, 우선순위, 카테고리를 지원하며 데스크탑과 모바일 모두에서 사용 가능한 반응형 UI를 제공한다.

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Next.js 14 (App Router) |
| ORM | Prisma |
| 데이터베이스 | PostgreSQL |
| 스타일링 | Tailwind CSS (`darkMode: 'class'`) |
| 테스트 | Jest (API 단위) + Playwright (E2E) |

---

## 기능 요구사항

- 할 일 추가, 완료 토글, 수정, 삭제
- 마감일 설정 (선택)
- 우선순위 설정: 높음 / 중간 / 낮음
- 카테고리 생성 및 할 일에 카테고리 지정
- 뷰 필터: 전체 / 오늘 / 예정
- 우선순위별 필터링
- 다크 모드 기본, 라이트 모드 토글
- 반응형 레이아웃 (데스크탑 사이드바 / 모바일 하단 탭)

---

## 데이터 모델

```prisma
model Todo {
  id          String     @id @default(cuid())
  title       String
  completed   Boolean    @default(false)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Category {
  id    String  @id @default(cuid())
  name  String  @unique
  color String  // 예: "#7c3aed"
  todos Todo[]
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}
```

---

## 프로젝트 구조

```
todo-project/
├── app/
│   ├── api/
│   │   ├── todos/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/route.ts     # PATCH, DELETE
│   │   └── categories/
│   │       ├── route.ts          # GET, POST
│   │       └── [id]/route.ts     # DELETE
│   ├── layout.tsx                # ThemeProvider 포함
│   └── page.tsx                  # 메인 화면
├── components/
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── AddTodoForm.tsx
│   ├── Sidebar.tsx
│   ├── BottomTabBar.tsx          # 모바일 전용
│   └── ThemeToggle.tsx
├── prisma/
│   └── schema.prisma
├── lib/
│   └── db.ts                     # Prisma 클라이언트 싱글톤
├── tests/
│   ├── api/                      # Jest 단위 테스트
│   └── e2e/                      # Playwright E2E 테스트
└── .env.local                    # DATABASE_URL
```

---

## API 설계

### Todo

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/todos` | 목록 조회 (쿼리: `category`, `priority`, `completed`) |
| POST | `/api/todos` | 새 할 일 생성 |
| PATCH | `/api/todos/[id]` | 수정 (완료 토글, 제목, 우선순위, 마감일, 카테고리) |
| DELETE | `/api/todos/[id]` | 삭제 |

### Category

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/categories` | 새 카테고리 생성 |
| DELETE | `/api/categories/[id]` | 카테고리 삭제 |

**요청 예시 (POST /api/todos)**
```json
{
  "title": "프레젠테이션 준비",
  "priority": "HIGH",
  "dueDate": "2026-05-07T00:00:00.000Z",
  "categoryId": "clx..."
}
```

**응답:** `201 Created` + 생성된 Todo 객체

---

## UI / UX

### 반응형 전략

- **데스크탑 (md: 768px 이상):** 왼쪽 사이드바로 뷰/카테고리 탐색
- **모바일 (768px 미만):** 사이드바 숨김, 하단 탭 바 + 오른쪽 하단 플로팅 + 버튼

### 테마

- 기본: 다크 모드 (`#0f0f1a` 배경, `#a78bfa` 포인트)
- 토글: 라이트 모드 전환 (`localStorage`에 선호 저장)
- Tailwind `dark:` 클래스로 구현

### 우선순위 색상

| 우선순위 | 색상 |
|----------|------|
| 높음 | `#ef4444` (빨강) |
| 중간 | `#d97706` (주황) |
| 낮음 | `#6b7280` (회색) |

---

## 에러 처리

- Zod로 API 입력값 검증 — 잘못된 요청은 `400` 반환
- 서버 에러는 `500` 반환
- 프론트엔드: 토스트 알림으로 에러 표시
- 완료 토글에 낙관적 업데이트(Optimistic Update) 적용, 실패 시 롤백

---

## 테스트 전략

### Jest (API 단위 테스트)
- 각 엔드포인트 성공/실패 케이스 검증
- 테스트 DB: SQLite (속도 우선)

### Playwright (E2E 테스트)
- 할 일 추가 → 목록 표시 확인
- 완료 토글 → UI 상태 변경 확인
- 마감일/우선순위 설정 → 필터링 동작 확인
- 다크/라이트 모드 토글 확인
- 모바일 뷰포트(375px)에서 하단 탭 동작 확인

---

## 범위 외 (이번 구현에 포함하지 않음)

- 사용자 인증/로그인 (개인용이므로 불필요)
- 반복 일정
- 푸시 알림
- 캘린더 연동
- 서브태스크
