import { prisma } from '@/lib/prisma'

export class CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    })
  }

  async findItem(userId: string, productId: string) {
    return prisma.cart.findUnique({
      where: { userId_productId: { userId, productId } },
    })
  }

  async addItem(userId: string, productId: string, quantity: number) {
    return prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    })
  }

  async updateQuantity(id: string, quantity: number) {
    return prisma.cart.update({
      where: { id },
      data: { quantity },
    })
  }

  async removeItem(id: string) {
    return prisma.cart.delete({ where: { id } })
  }

  async clear(userId: string) {
    return prisma.cart.deleteMany({ where: { userId } })
  }
}

export const cartRepository = new CartRepository()
