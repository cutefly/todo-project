import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@/app/generated/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
