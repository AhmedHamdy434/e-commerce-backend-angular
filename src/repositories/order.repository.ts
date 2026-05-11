import { prisma } from '@/lib/prisma'

export class OrderRepository {
  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })
  }
}

export const orderRepository = new OrderRepository()
