import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
