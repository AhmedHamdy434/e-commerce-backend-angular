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

  // Check for Prisma errors using properties to avoid issues with Prisma namespace export in some environments
  if (error && typeof error === 'object' && 'code' in error && typeof (error as any).code === 'string') {
    const prismaError = error as { code: string }
    
    if (prismaError.code === 'P2002') {
      return errorResponse('Unique constraint violation', 409)
    }
    if (prismaError.code === 'P2025') {
      return errorResponse('Record not found', 404)
    }
  }

  return errorResponse('Internal Server Error', 500)
}
