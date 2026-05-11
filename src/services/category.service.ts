import { categoryRepository } from '@/repositories/category.repository'
import { CreateCategoryInput, UpdateCategoryInput } from '@/validators/category.validator'
import { ApiError } from '@/lib/error-handler'

export class CategoryService {
  async getCategories() {
    return categoryRepository.findAll()
  }

  async getCategory(id: string) {
    const category = await categoryRepository.findById(id)
    if (!category) throw new ApiError(404, 'Category not found')
    return category
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug)
    if (!category) throw new ApiError(404, 'Category not found')
    return category
  }

  async createCategory(data: CreateCategoryInput) {
    return categoryRepository.create(data)
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    await this.getCategory(id)
    return categoryRepository.update(id, data)
  }

  async deleteCategory(id: string) {
    await this.getCategory(id)
    return categoryRepository.delete(id)
  }
}

export const categoryService = new CategoryService()
