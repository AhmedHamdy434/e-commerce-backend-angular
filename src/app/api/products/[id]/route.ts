import { NextRequest } from 'next/server'
import { productService } from '@/services/product.service'
import { updateProductSchema } from '@/validators/product.validator'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await productService.getProduct(id)
    return successResponse(product, 'Product fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const product = await productService.updateProduct(id, validatedData)
    return successResponse(product, 'Product updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await productService.deleteProduct(id)
    return successResponse(null, 'Product deleted successfully')
  } catch (error) {
    return handleError(error)
  }
}
