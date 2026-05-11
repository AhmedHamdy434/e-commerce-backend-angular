import { prisma } from '@/lib/prisma'

export class WishlistRepository {
  async findByUserId(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    })
  }

  async findItem(userId: string, productId: string) {
    return prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    })
  }

  async addItem(userId: string, productId: string) {
    return prisma.wishlist.create({
      data: { userId, productId },
    })
  }

  async removeItem(id: string) {
    return prisma.wishlist.delete({ where: { id } })
  }
}

export const wishlistRepository = new WishlistRepository()
