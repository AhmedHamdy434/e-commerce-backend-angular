import { PaginationParams } from '@/types/api'

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)),
  }
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  const skip = (page - 1) * limit

  return {
    total,
    totalPages,
    page,
    limit,
    skip,
  }
}
