jest.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { GET, POST } from '@/app/api/categories/route'
import { DELETE } from '@/app/api/categories/[id]/route'

beforeEach(() => jest.clearAllMocks())

const makeRequest = (url: string, options?: RequestInit) =>
  new Request(url, options)

describe('GET /api/categories', () => {
  it('returns categories list', async () => {
    const mockCategories = [{ id: '1', name: '업무', color: '#7c3aed' }]
    jest.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(mockCategories)
  })

  it('returns 500 on DB error', async () => {
    jest.mocked(prisma.category.findMany).mockRejectedValue(new Error('DB down'))

    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/categories', () => {
  it('creates a category and returns 201', async () => {
    const newCat = { id: '2', name: '개인', color: '#059669' }
    jest.mocked(prisma.category.create).mockResolvedValue(newCat as any)

    const req = makeRequest('http://localhost/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '개인', color: '#059669' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual(newCat)
  })

  it('returns 400 on invalid color format', async () => {
    const req = makeRequest('http://localhost/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '개인', color: 'red' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/categories/[id]', () => {
  it('deletes category and returns 204', async () => {
    jest.mocked(prisma.category.delete).mockResolvedValue({} as any)

    const req = makeRequest('http://localhost/api/categories/1', { method: 'DELETE' })
    const res = await DELETE(req, { params: { id: '1' } })
    expect(res.status).toBe(204)
  })

  it('returns 500 on DB error', async () => {
    jest.mocked(prisma.category.delete).mockRejectedValue(new Error('not found'))

    const req = makeRequest('http://localhost/api/categories/bad', { method: 'DELETE' })
    const res = await DELETE(req, { params: { id: 'bad' } })
    expect(res.status).toBe(500)
  })
})
