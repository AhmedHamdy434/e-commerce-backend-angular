import { orderRepository } from '@/repositories/order.repository'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const session = await getSession()
    const orders = await orderRepository.findByUserId(session.user!.id)
    return successResponse(orders, 'Orders fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}
