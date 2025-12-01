import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '@/shared/catchAsync'
import sendResponse from '@/shared/sendResponse'
import { productService } from './product.service'

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined

  const result = await productService.getAllProducts(limit)

  sendResponse(res, {
    success: true,
    message: 'Products retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.params
  const limit = req.query.limit ? Number(req.query.limit) : undefined

  const result = await productService.getProductsByCategory(category, limit)

  sendResponse(res, {
    success: true,
    message: 'Products retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const result = await productService.getProductById(id)

  sendResponse(res, {
    success: true,
    message: 'Product retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAllCategories()

  sendResponse(res, {
    success: true,
    message: 'Categories retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const productController = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getAllCategories,
}
