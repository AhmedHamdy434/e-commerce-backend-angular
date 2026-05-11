import { NextRequest } from 'next/server'
import { categoryService } from '@/services/category.service'
import { createCategorySchema } from '@/validators/category.validator'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const categories = await categoryService.getCategories()
    return successResponse(categories, 'Categories fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await categoryService.createCategory(validatedData)
    return successResponse(category, 'Category created successfully', 201)
  } catch (error) {
    return handleError(error)
  }
}
