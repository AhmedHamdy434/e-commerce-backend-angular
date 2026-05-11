import { NextResponse } from 'next/server'
import { ApiResponse, PaginatedResponse } from '@/types/api'

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200
) {
  const body: ApiResponse<T> = {
    status: true,
    message,
    data,
  }
  return NextResponse.json(body, { status })
}

export function errorResponse(
  message = 'Error',
  status = 500,
  data: any = null
) {
  const body: ApiResponse = {
    status: false,
    message,
    data,
  }
  return NextResponse.json(body, { status })
}

export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  },
  message = 'Success'
) {
  const body: PaginatedResponse<T> = {
    status: true,
    message,
    data,
    pagination,
  }
  return NextResponse.json(body, { status: 200 })
}
