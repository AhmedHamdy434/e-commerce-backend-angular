import { cartRepository } from '@/repositories/cart.repository'
import { productRepository } from '@/repositories/product.repository'
import { ApiError } from '@/lib/error-handler'

export class CartService {
  async getCart(userId: string) {
    return cartRepository.findByUserId(userId)
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId)
    if (!product) throw new ApiError(404, 'Product not found')

    // Check stock
    const existingItem = await cartRepository.findItem(userId, productId)
    const newQuantity = (existingItem?.quantity || 0) + quantity

    if (newQuantity > product.stockQuantity) {
      throw new ApiError(400, 'Insufficient stock')
    }

    return cartRepository.addItem(userId, productId, quantity)
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const cartItems = await cartRepository.findByUserId(userId)
    const item = cartItems.find((i) => i.id === cartItemId)

    if (!item) throw new ApiError(404, 'Cart item not found')

    if (quantity > item.product.stockQuantity) {
      throw new ApiError(400, 'Insufficient stock')
    }

    return cartRepository.updateQuantity(cartItemId, quantity)
  }

  async removeFromCart(userId: string, cartItemId: string) {
    // Check ownership
    const cartItems = await cartRepository.findByUserId(userId)
    const item = cartItems.find((i) => i.id === cartItemId)
    if (!item) throw new ApiError(404, 'Cart item not found')

    return cartRepository.removeItem(cartItemId)
  }

  async clearCart(userId: string) {
    return cartRepository.clear(userId)
  }
}

export const cartService = new CartService()
