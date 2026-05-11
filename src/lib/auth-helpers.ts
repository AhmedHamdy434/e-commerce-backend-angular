import { auth } from './auth'
import { ApiError } from './error-handler'

export async function getSession() {
  const session = await auth()
  if (!session?.user?.id) throw new ApiError(401, 'Unauthorized')
  return session as unknown as {
    user: {
      id: string
      role: string
      email: string
      name: string
    }
  }
}

export async function requireAdmin() {
  const session = await getSession()
  if ((session.user as any).role !== 'ADMIN') {
    throw new ApiError(403, 'Forbidden: Admin access required')
  }
  return session
}
