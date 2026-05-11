import { ZodError } from 'zod'
import { errorResponse } from './api-response'

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleError(error: unknown) {
  console.error('[API ERROR]:', error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((e) => e.message).join(', ')
    return errorResponse(message, 400, error.flatten().fieldErrors)
  }

  // Handle PostgreSQL error codes (Neon/pg)
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as { code: string }
    
    if (pgError.code === '23505') { // Unique violation
      return errorResponse('Record already exists (unique constraint violation)', 409)
    }
    if (pgError.code === '23503') { // Foreign key violation
      return errorResponse('Reference error (foreign key violation)', 400)
    }
  }

  return errorResponse('Internal Server Error', 500)
}
