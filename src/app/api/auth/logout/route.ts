import { NextResponse } from 'next/server'
import { successResponse } from '@/lib/api-response'
import { handleError } from '@/lib/error-handler'

export async function POST() {
  try {
    // For stateless JWT, logout is primarily handled by the client 
    // by removing the token. This endpoint can be used to clear 
    // any server-side cookies if they were used.
    
    const response = successResponse(null, 'Logged out successfully')
    
    // Clear the session cookie if it exists (for NextAuth compatibility or future use)
    response.cookies.set('authjs.session-token', '', { expires: new Date(0) })
    response.cookies.set('next-auth.session-token', '', { expires: new Date(0) })
    
    return response
  } catch (error) {
    return handleError(error)
  }
}
