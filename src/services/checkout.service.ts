import { prisma } from '@/lib/prisma'
import { cartRepository } from '@/repositories/cart.repository'
import { ApiError } from '@/lib/error-handler'

export class CheckoutService {
  async processCheckout(userId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Get user's cart
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { product: true },
      })

      if (cartItems.length === 0) {
        throw new ApiError(400, 'Cart is empty')
      }

      // 2. Validate stock & calculate total
      let totalAmount = 0
      for (const item of cartItems) {
        if (item.quantity > item.product.stockQuantity) {
          throw new ApiError(
            400,
            `Insufficient stock for product: ${item.product.name}`
          )
        }
        totalAmount += (item.product.price - item.product.discount) * item.quantity
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price - item.product.discount,
            })),
          },
        },
        include: { items: true },
      })

      // 4. Update stock & Clear cart
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        })
      }

      await tx.cart.deleteMany({ where: { userId } })

      return order
    })
  }
}

export const checkoutService = new CheckoutService()
