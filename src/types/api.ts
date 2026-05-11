export interface ApiResponse<T = unknown> {
  status: boolean
  message: string
  data: T | null
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  isFeatured?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
}
