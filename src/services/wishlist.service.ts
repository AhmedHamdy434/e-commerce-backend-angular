import { wishlistRepository } from '@/repositories/wishlist.repository'
import { productRepository } from '@/repositories/product.repository'
import { ApiError } from '@/lib/error-handler'

export class WishlistService {
  async getWishlist(userId: string) {
    return wishlistRepository.findByUserId(userId)
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await productRepository.findById(productId)
    if (!product) throw new ApiError(404, 'Product not found')

    const existing = await wishlistRepository.findItem(userId, productId)
    if (existing) return existing

    return wishlistRepository.addItem(userId, productId)
  }

  async removeFromWishlist(userId: string, wishlistItemId: string) {
    const items = await wishlistRepository.findByUserId(userId)
    const item = items.find((i) => i.id === wishlistItemId)
    if (!item) throw new ApiError(404, 'Wishlist item not found')

    return wishlistRepository.removeItem(wishlistItemId)
  }
}

export const wishlistService = new WishlistService()
