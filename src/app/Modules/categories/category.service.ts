import { categoryRepository } from './category.repository'
import { ICategoryResponse } from './category.interface'

const getAllCategories = async (): Promise<ICategoryResponse> => {
  const categories = await categoryRepository.findAllCategories()

  return {
    total: categories.length,
    categories,
  }
}

export const categoryService = {
  getAllCategories,
}
