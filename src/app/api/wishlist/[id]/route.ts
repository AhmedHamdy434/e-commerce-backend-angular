import { NextRequest } from 'next/server'
import { wishlistService } from '@/services/wishlist.service'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { getSession } from '@/lib/auth-helpers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params
    await wishlistService.removeFromWishlist(session.user!.id, id)
    return successResponse(null, 'Item removed from wishlist')
  } catch (error) {
    return handleError(error)
  }
}
