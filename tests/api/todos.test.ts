jest.mock('@/lib/db', () => ({
  prisma: {
    todo: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { GET, POST } from '@/app/api/todos/route'
import { PATCH, DELETE } from '@/app/api/todos/[id]/route'

beforeEach(() => jest.clearAllMocks())

const makeRequest = (url: string, options?: RequestInit) =>
  new Request(url, options)

const mockTodo = {
  id: 'clx1',
  title: '테스트 할 일',
  completed: false,
  priority: 'MEDIUM',
  dueDate: null,
  categoryId: null,
  category: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('GET /api/todos', () => {
  it('returns todos list', async () => {
    jest.mocked(prisma.todo.findMany).mockResolvedValue([mockTodo] as any)

    const res = await GET(makeRequest('http://localhost/api/todos'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([mockTodo])
  })

  it('passes priority filter to DB query', async () => {
    jest.mocked(prisma.todo.findMany).mockResolvedValue([])

    await GET(makeRequest('http://localhost/api/todos?priority=HIGH'))
    expect(jest.mocked(prisma.todo.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ priority: 'HIGH' }) })
    )
  })

  it('returns 500 on DB error', async () => {
    jest.mocked(prisma.todo.findMany).mockRejectedValue(new Error('DB down'))

    const res = await GET(makeRequest('http://localhost/api/todos'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/todos', () => {
  it('creates todo and returns 201', async () => {
    jest.mocked(prisma.todo.create).mockResolvedValue(mockTodo as any)

    const req = makeRequest('http://localhost/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '테스트 할 일' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('returns 400 when title is empty', async () => {
    const req = makeRequest('http://localhost/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/todos/[id]', () => {
  it('updates todo and returns 200', async () => {
    const updated = { ...mockTodo, completed: true }
    jest.mocked(prisma.todo.update).mockResolvedValue(updated as any)

    const req = makeRequest('http://localhost/api/todos/clx1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })
    const res = await PATCH(req, { params: { id: 'clx1' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.completed).toBe(true)
  })

  it('returns 400 on invalid priority value', async () => {
    const req = makeRequest('http://localhost/api/todos/clx1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: 'INVALID' }),
    })
    const res = await PATCH(req, { params: { id: 'clx1' } })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/todos/[id]', () => {
  it('deletes todo and returns 204', async () => {
    jest.mocked(prisma.todo.delete).mockResolvedValue(mockTodo as any)

    const req = makeRequest('http://localhost/api/todos/clx1', { method: 'DELETE' })
    const res = await DELETE(req, { params: { id: 'clx1' } })
    expect(res.status).toBe(204)
  })
})
