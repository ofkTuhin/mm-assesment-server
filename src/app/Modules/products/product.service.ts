import ApiError from '@/errors/ApiError'
import httpStatus from 'http-status'
import { productRepository } from './product.repository'
import { IProductResponse, ICategory } from './product.interface'

const getAllProducts = async (limit?: number): Promise<IProductResponse[]> => {
  const products = await productRepository.findAllProducts(limit)

  return products
}

const getProductsByCategory = async (
  category: string,
  limit?: number
): Promise<IProductResponse[]> => {
  const products = await productRepository.findByCategory(category, limit)

  if (products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `No products found in category: ${category}`)
  }

  return products
}

const getProductById = async (id: number) => {
  const product = await productRepository.findProductById(id)

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, `Product with id ${id} not found`)
  }

  return product
}

const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await productRepository.findAllCategories()

  return categories
}

export const productService = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getAllCategories,
}
