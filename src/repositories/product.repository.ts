import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ProductFilters } from '@/types/api'

export class ProductRepository {
  async findAll(filters: ProductFilters, skip: number, take: number) {
    const where: Prisma.ProductWhereInput = {}

    if (filters.category) where.category = { slug: filters.category }
    if (filters.brand) where.brand = filters.brand
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice,
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    if (filters.sort === 'price_asc') orderBy = { price: 'asc' }
    if (filters.sort === 'price_desc') orderBy = { price: 'desc' }
    if (filters.sort === 'rating') orderBy = { ratings: 'desc' }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return { items, total }
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data })
  }

  async update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } })
  }
}

export const productRepository = new ProductRepository()
