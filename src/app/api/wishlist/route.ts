import { NextRequest } from 'next/server'
import { wishlistService } from '@/services/wishlist.service'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getSession()
    const wishlist = await wishlistService.getWishlist(session.user!.id)
    return successResponse(wishlist, 'Wishlist fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { productId } = z.object({ productId: z.string() }).parse(body)

    const wishlistItem = await wishlistService.addToWishlist(session.user!.id, productId)
    return successResponse(wishlistItem, 'Item added to wishlist', 201)
  } catch (error) {
    return handleError(error)
  }
}
