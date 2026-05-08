import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createCategorySchema } from '@/lib/validations'
import { Prisma } from '@/app/generated/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const category = await prisma.category.create({ data: result.data })
    return NextResponse.json(category, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: '이미 존재하는 카테고리 이름입니다' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
