import { NextRequest } from 'next/server'
import { productService } from '@/services/product.service'
import { parseRequestData } from '@/lib/request-parser'
import { productQuerySchema, createProductSchema } from '@/validators/product.validator'
import { successResponse, paginatedResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/auth-helpers'
import { buildPaginationMeta } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const query = productQuerySchema.parse(params)

    const { items, total } = await productService.getProducts(
      query,
      query.page,
      query.limit
    )

    const meta = buildPaginationMeta(total, query.page, query.limit)
    return paginatedResponse(items, meta, 'Products fetched successfully')
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const parsedData = await parseRequestData(request, {
      folder: 'products',
      numericKeys: ['price', 'discount', 'stockQuantity']
    })
    const validatedData = createProductSchema.parse(parsedData)

    const product = await productService.createProduct(validatedData)
    return successResponse(product, 'Product created successfully', 201)
  } catch (error) {
    return handleError(error)
  }
}
