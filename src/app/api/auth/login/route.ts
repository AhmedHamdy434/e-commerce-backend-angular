import { NextRequest } from 'next/server'
import { loginSchema } from '@/validators/auth.validator'
import { userRepository } from '@/repositories/user.repository'
import { successResponse } from '@/lib/api-response'
import { handleError, ApiError } from '@/lib/error-handler'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const user = await userRepository.findByEmail(validatedData.email)
    if (!user) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const passwordsMatch = await bcrypt.compare(validatedData.password, user.password)
    if (!passwordsMatch) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: (user as any).role,
    })

    // Remove password from user object
    const { password, ...userWithoutPassword } = user as any

    return successResponse(
      { user: userWithoutPassword, token },
      'Logged in successfully'
    )
  } catch (error) {
    return handleError(error)
  }
}
