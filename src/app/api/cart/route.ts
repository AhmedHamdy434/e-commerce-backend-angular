import { NextRequest } from 'next/server'
import { cartService } from '@/services/cart.service'
import { addToCartSchema } from '@/validators/cart.validator'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const session = await getSession()
    const cart = await cartService.getCart(session.user!.id)
    return successResponse(cart, 'Cart fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { productId, quantity } = addToCartSchema.parse(body)

    const cartItem = await cartService.addToCart(session.user!.id, productId, quantity)
    return successResponse(cartItem, 'Item added to cart', 201)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE() {
  try {
    const session = await getSession()
    await cartService.clearCart(session.user!.id)
    return successResponse(null, 'Cart cleared successfully')
  } catch (error) {
    return handleError(error)
  }
}
