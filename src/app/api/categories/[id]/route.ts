import { NextRequest } from 'next/server'
import { categoryService } from '@/services/category.service'
import { updateCategorySchema } from '@/validators/category.validator'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await categoryService.getCategory(id)
    return successResponse(category, 'Category fetched successfully')
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
    const validatedData = updateCategorySchema.parse(body)

    const category = await categoryService.updateCategory(id, validatedData)
    return successResponse(category, 'Category updated successfully')
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
    await categoryService.deleteCategory(id)
    return successResponse(null, 'Category deleted successfully')
  } catch (error) {
    return handleError(error)
  }
}
