import { auth } from './auth'
import { ApiError } from './error-handler'
import { headers } from 'next/headers'
import { verifyToken } from './jwt'

export async function getSession() {
  // 1. Try NextAuth session
  const session = await auth()
  if (session?.user) {
    return session as unknown as {
      user: {
        id: string
        role: string
        email: string
        name: string
      }
    }
  }

  // 2. Try manual JWT from Authorization header
  const authHeader = (await headers()).get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    if (payload) {
      return {
        user: {
          id: payload.id as string,
          role: payload.role as string,
          email: payload.email as string,
          name: payload.name as string,
        }
      }
    }
  }

  throw new ApiError(401, 'Unauthorized')
}

export async function requireAdmin() {
  const session = await getSession()
  const role = (session.user as any).role?.toString().trim().toUpperCase()
  
  if (role !== 'ADMIN') {
    throw new ApiError(403, 'Forbidden: Admin access required')
  }
  return session
}
