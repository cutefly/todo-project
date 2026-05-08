import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  dueDate: z.string().datetime().nullable().optional(),
  categoryId: z.string().nullable().optional(),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  categoryId: z.string().nullable().optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})
