// tests/e2e/todo.spec.ts
import { test, expect, type Page } from '@playwright/test'

async function addTodoViaUI(
  page: Page,
  title: string,
  options?: { priority?: string }
): Promise<string> {
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/todos') && res.request().method() === 'POST'
  )
  await page.locator('[aria-label="새 할 일 추가"]:visible').click()
  await page.fill('input[placeholder="할 일을 입력하세요"]', title)
  if (options?.priority) await page.selectOption('select', { value: options.priority })
  await page.getByRole('button', { name: '추가', exact: true }).click()
  const response = await responsePromise
  const { id } = await response.json() as { id: string }
  return id
}

test.describe('할 일 추가', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('새 할 일을 추가하면 목록에 표시된다', async ({ page }) => {
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, 'E2E 테스트 할 일')
      await expect(page.locator('text=E2E 테스트 할 일').first()).toBeVisible()
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })

  test('빈 제목으로는 추가 버튼이 비활성화된다', async ({ page }) => {
    await page.locator('[aria-label="새 할 일 추가"]:visible').click()
    await expect(page.getByRole('button', { name: '추가', exact: true })).toBeDisabled()
  })

  test('취소 버튼을 누르면 모달이 닫힌다', async ({ page }) => {
    await page.locator('[aria-label="새 할 일 추가"]:visible').click()
    await expect(page.locator('form h2')).toBeVisible()
    await page.click('button:has-text("취소")')
    await expect(page.locator('form h2')).not.toBeVisible()
  })
})

test.describe('할 일 완료 토글', () => {
  test('체크박스 클릭 시 완료 상태로 변경된다', async ({ page }) => {
    await page.goto('/')
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, '완료 테스트')

      const todoItem = page.locator('[aria-label="완료"]').first()
      await todoItem.click()
      const toggledContainer = page.locator('[aria-label="완료 취소"]').first().locator('..')
      await expect(toggledContainer.locator('p').first()).toHaveCSS('text-decoration-line', 'line-through')
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })
})

test.describe('필터링', () => {
  test('높음 우선순위 필터 클릭 시 해당 항목만 표시된다', async ({ page }) => {
    await page.goto('/')
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, '높음 우선순위 할 일', { priority: 'HIGH' })

      await page.click('button:has-text("높음")')
      await expect(page.locator('text=높음 우선순위 할 일').first()).toBeVisible()
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })
})

test.describe('다크/라이트 모드 토글', () => {
  test('테마 토글 버튼 클릭 시 html 클래스가 변경된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.locator('[aria-label="테마 전환"]:visible').click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await page.locator('[aria-label="테마 전환"]:visible').click()
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

test.describe('할 일 수정', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('수정 버튼 클릭 시 모달이 열린다', async ({ page }) => {
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, '수정 모달 테스트')
      await page.locator('[aria-label="수정"]:visible').first().click()
      await expect(page.locator('form h2')).toHaveText('할 일 수정')
      await page.click('button:has-text("취소")')
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })

  test('제목을 수정하고 저장하면 목록에 반영된다', async ({ page }) => {
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, '수정 전 제목')
      await page.locator('[aria-label="수정"]:visible').first().click()
      await page.fill('input[placeholder="할 일을 입력하세요"]', '수정 후 제목')
      const patchPromise = page.waitForResponse(
        (res) => res.url().includes('/api/todos') && res.request().method() === 'PATCH'
      )
      await page.getByRole('button', { name: '저장', exact: true }).click()
      await patchPromise
      await expect(page.locator('text=수정 후 제목').first()).toBeVisible()
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })

  test('취소 버튼을 누르면 모달이 닫히고 내용이 변경되지 않는다', async ({ page }) => {
    let todoId: string | undefined
    try {
      todoId = await addTodoViaUI(page, '변경되지 않을 제목')
      await page.locator('[aria-label="수정"]:visible').first().click()
      await page.fill('input[placeholder="할 일을 입력하세요"]', '변경된 제목')
      await page.click('button:has-text("취소")')
      await expect(page.locator('form h2')).not.toBeVisible()
      await expect(page.locator('text=변경되지 않을 제목').first()).toBeVisible()
    } finally {
      if (todoId) await page.request.delete(`/api/todos/${todoId}`)
    }
  })
})
