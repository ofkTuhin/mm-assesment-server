import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '@/shared/catchAsync'
import sendResponse from '@/shared/sendResponse'
import { categoryService } from './category.service'

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories()

  sendResponse(res, {
    success: true,
    message: 'Categories retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const categoryController = {
  getAllCategories,
}
