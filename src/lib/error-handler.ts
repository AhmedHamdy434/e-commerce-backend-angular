import { ZodError } from 'zod'
import { errorResponse } from './api-response'
import { Prisma } from '@prisma/client'

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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse('Unique constraint violation', 409)
    }
    if (error.code === 'P2025') {
      return errorResponse('Record not found', 404)
    }
  }

  return errorResponse('Internal Server Error', 500)
}
