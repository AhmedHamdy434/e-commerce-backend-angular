import { NextRequest } from 'next/server'
import { checkoutService } from '@/services/checkout.service'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'

export async function POST() {
  try {
    const session = await getSession()
    const order = await checkoutService.processCheckout(session.user!.id)
    return successResponse(order, 'Checkout successful. Order placed.', 201)
  } catch (error) {
    return handleError(error)
  }
}
