import { NextRequest } from 'next/server'
import { cartService } from '@/services/cart.service'
import { updateCartSchema } from '@/validators/cart.validator'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params
    const body = await request.json()
    const { quantity } = updateCartSchema.parse(body)

    const cartItem = await cartService.updateQuantity(session.user!.id, id, quantity)
    return successResponse(cartItem, 'Cart quantity updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params
    await cartService.removeFromCart(session.user!.id, id)
    return successResponse(null, 'Item removed from cart')
  } catch (error) {
    return handleError(error)
  }
}
