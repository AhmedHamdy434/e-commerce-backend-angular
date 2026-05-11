import { NextRequest } from 'next/server'
import { registerSchema } from '@/validators/auth.validator'
import { userRepository } from '@/repositories/user.repository'
import { successResponse } from '@/lib/api-response'
import { handleError, ApiError } from '@/lib/error-handler'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const existingUser = await userRepository.findByEmail(validatedData.email)
    if (existingUser) {
      throw new ApiError(409, 'Email already registered')
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const user = await userRepository.create({
      ...validatedData,
      password: hashedPassword,
    })

    return successResponse(user, 'User registered successfully', 201)
  } catch (error) {
    return handleError(error)
  }
}
