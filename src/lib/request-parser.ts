import { NextRequest } from 'next/server'
import { imageService } from '@/services/image.service'

interface ParseOptions {
  folder?: string
  numericKeys?: string[]
}

/**
 * Parses the request body. Supports both JSON and multipart/form-data.
 * If the request is multipart/form-data, it automatically uploads any File objects
 * to Cloudinary and replaces them with their uploaded secure URLs.
 * 
 * @param request The incoming NextRequest
 * @param options Configuration options including Cloudinary folder and keys that should be parsed as numbers
 * @returns A parsed object containing all keys and their resolved values/URLs
 */
export async function parseRequestData<T = any>(
  request: NextRequest,
  options?: ParseOptions
): Promise<T> {
  const contentType = request.headers.get('content-type') || ''

  if (!contentType.includes('multipart/form-data')) {
    return request.json()
  }

  const folder = options?.folder || 'ecommerce'
  const numericKeys = options?.numericKeys || []

  const formData = await request.formData()
  const parsedData: any = {}

  // Retrieve all unique keys
  const keys = Array.from(formData.keys())

  for (const key of keys) {
    const values = formData.getAll(key)

    const processedValues = await Promise.all(
      values.map(async (value) => {
        // If the value is a valid uploaded File
        if (value instanceof File && value.size > 0) {
          const arrayBuffer = await value.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const fileUri = `data:${value.type};base64,${buffer.toString('base64')}`
          
          const uploadResult = await imageService.uploadImage(fileUri, folder)
          return uploadResult.url
        }

        // Convert string values
        if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '') return undefined

          // Convert string booleans to actual booleans
          if (trimmed.toLowerCase() === 'true') return true
          if (trimmed.toLowerCase() === 'false') return false

          // Convert to number if the key is specified in numericKeys
          if (numericKeys.includes(key) && !isNaN(Number(trimmed))) {
            return Number(trimmed)
          }
        }

        return value
      })
    )

    // Filter out undefined values to keep the payload clean
    const filteredValues = processedValues.filter((v) => v !== undefined)

    if (filteredValues.length === 0) {
      continue
    }

    // If there is only one value, set it directly. Otherwise, store as an array.
    if (filteredValues.length === 1) {
      parsedData[key] = filteredValues[0]
    } else {
      parsedData[key] = filteredValues
    }
  }

  return parsedData as T
}
