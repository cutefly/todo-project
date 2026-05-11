# Todo 수정 기능 설계

## 개요

기존 Todo 항목의 제목, 우선순위, 마감일, 카테고리를 모달 UI를 통해 수정하는 기능을 추가한다. 백엔드 `PATCH /api/todos/[id]` 엔드포인트는 이미 모든 필드를 지원하므로 프론트엔드만 구현한다.

## UX 방식

- **트리거:** 각 Todo 행 우측의 ✏ 아이콘 버튼 클릭
- **표시 방식:** 모달 (AddTodoForm과 동일한 overlay 패턴)
- **모바일:** ✏ 버튼을 항상 표시 (스와이프 없음)
- **편집 가능 필드:** 제목, 우선순위, 마감일, 카테고리 (전체)

## 컴포넌트 구조

### `components/EditTodoModal.tsx` (신규)

AddTodoForm과 동일한 모달 레이아웃을 따르되, 기존 Todo 값으로 pre-fill한다.

**Props:**
```ts
interface EditTodoModalProps {
  todo: Todo
  categories: Category[]
  onSave: (id: string, data: { title: string; priority: Priority; dueDate: string | null; categoryId: string | null }) => Promise<boolean>
  onClose: () => void
}
```

**동작:**
1. `todo` prop으로 각 필드 초기값 설정
2. 저장 버튼 클릭 → `onSave` 호출 → 성공 시 `onClose`
3. 취소 버튼 또는 overlay 클릭 → `onClose`
4. 제목이 비어 있으면 저장 버튼 비활성화

**스타일:** AddTodoForm과 동일한 Spotify 디자인 토큰 사용. 모달 제목만 "할 일 수정"으로 변경, 저장 버튼 라벨은 "저장".

### `components/TodoItem.tsx` (수정)

- 행 우측 삭제(✕) 버튼 옆에 ✏ 아이콘 버튼 추가
- `onEdit: (todo: Todo) => void` prop 추가
- ✏ 버튼 클릭 시 `onEdit(todo)` 호출
- 데스크탑/모바일 모두 항상 표시

### `app/page.tsx` (수정)

- `editingTodo: Todo | null` 상태 추가 (초기값 `null`)
- TodoList에 `onEdit` prop 전달 → TodoItem까지 전파
- `editingTodo !== null`이면 `<EditTodoModal>` 렌더링
- `handleEditSave`: PATCH `/api/todos/${id}` 호출 후 성공 시 로컬 todos 상태 업데이트

## 데이터 흐름

```
✏ 클릭 (TodoItem)
  → onEdit(todo) (TodoList → page.tsx)
  → setEditingTodo(todo)
  → EditTodoModal 렌더링 (pre-filled)

저장 클릭 (EditTodoModal)
  → onSave(id, { title, priority, dueDate, categoryId })
  → PATCH /api/todos/${id}
  → 성공: todos 상태 업데이트 + setEditingTodo(null)
  → 실패: 모달 유지, 에러 무시 (서버 에러는 드문 케이스)
```

## API

기존 엔드포인트 그대로 사용. 변경 없음.

```
PATCH /api/todos/:id
Body: { title?, priority?, dueDate?, categoryId? }
Response: 200 { id, title, priority, dueDate, categoryId, ... }
```

## 파일 변경 목록

| 파일 | 변경 유형 |
|------|----------|
| `components/EditTodoModal.tsx` | 신규 생성 |
| `components/TodoItem.tsx` | ✏ 버튼 + `onEdit` prop 추가 |
| `components/TodoList.tsx` | `onEdit` prop 전파 |
| `app/page.tsx` | `editingTodo` 상태, `handleEditSave`, EditTodoModal 렌더링 |

## 테스트

E2E 테스트 (`tests/e2e/todo.spec.ts`):
- Todo 생성 후 ✏ 버튼 클릭 → 모달 열림 확인
- 제목 수정 후 저장 → 목록에 수정된 제목 반영 확인
- 취소 → 모달 닫힘, 변경 없음 확인
- 각 테스트는 생성한 Todo를 `finally`에서 삭제

## 범위 외

- 수정 이력 추적
- 낙관적 업데이트 (성공 후 상태 갱신으로 충분)
- 키보드 단축키 (Enter로 저장 등 — form submit으로 자연스럽게 처리됨)
