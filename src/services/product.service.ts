import { productRepository } from '@/repositories/product.repository'
import { ProductFilters } from '@/types/api'
import { CreateProductInput, UpdateProductInput } from '@/validators/product.validator'
import { ApiError } from '@/lib/error-handler'

export class ProductService {
  async getProducts(filters: ProductFilters, page: number, limit: number) {
    const skip = (page - 1) * limit
    return productRepository.findAll(filters, skip, limit)
  }

  async getProduct(id: string) {
    const product = await productRepository.findById(id)
    if (!product) throw new ApiError(404, 'Product not found')
    return product
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug)
    if (!product) throw new ApiError(404, 'Product not found')
    return product
  }

  async createProduct(data: CreateProductInput) {
    return productRepository.create(data)
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    await this.getProduct(id) // Ensure exists
    return productRepository.update(id, data)
  }

  async deleteProduct(id: string) {
    await this.getProduct(id) // Ensure exists
    return productRepository.delete(id)
  }
}

export const productService = new ProductService()
