import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discount: z.number().min(0).default(0),
  stockQuantity: z.number().int().min(0).default(0),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  brand: z.string().min(1, 'Brand is required'),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
})

export const updateProductSchema = createProductSchema.partial()

export const productQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v) : 10)),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  maxPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  isFeatured: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
