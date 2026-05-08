import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createTodoSchema } from '@/lib/validations'
import type { Priority } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId') ?? undefined
    const priority = searchParams.get('priority') as Priority | null
    const view = searchParams.get('view')

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(startOfToday.getTime() + 86400000)

    const todos = await prisma.todo.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(priority && { priority }),
        ...(view === 'today' && { dueDate: { gte: startOfToday, lt: endOfToday } }),
        ...(view === 'upcoming' && { dueDate: { gte: endOfToday } }),
      },
      include: { category: true },
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(todos)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createTodoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const todo = await prisma.todo.create({
      data: {
        ...result.data,
        dueDate: result.data.dueDate ? new Date(result.data.dueDate) : null,
      },
      include: { category: true },
    })
    return NextResponse.json(todo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}
