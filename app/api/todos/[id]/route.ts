import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateTodoSchema } from '@/lib/validations'
import { Prisma } from '@/app/generated/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const result = updateTodoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { dueDate, ...rest } = result.data
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: { category: true },
    })
    return NextResponse.json(todo)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todo.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
