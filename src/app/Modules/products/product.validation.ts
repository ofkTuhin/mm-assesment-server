import { z } from 'zod'

const getProductsQuery = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform(val => (val ? Number(val) : undefined)),
  }),
})

const getProductsByCategory = z.object({
  params: z.object({
    category: z.string().min(1, 'Category is required'),
  }),
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform(val => (val ? Number(val) : undefined)),
  }),
})

const getProductById = z.object({
  params: z.object({
    id: z.string().transform(val => Number(val)),
  }),
})

export const productValidation = {
  getProductsQuery,
  getProductsByCategory,
  getProductById,
}
