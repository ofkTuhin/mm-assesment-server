import express from 'express'

import { productController } from './product.controller'
import { productValidation } from './product.validation'
import zodValidationHandler from '@/app/middleware/zodValidationHandler'

const router = express.Router()

router.get(
  '/',
  zodValidationHandler(productValidation.getProductsQuery),
  productController.getAllProducts
)

router.get('/categories', productController.getAllCategories)

router.get(
  '/category/:category',
  zodValidationHandler(productValidation.getProductsByCategory),
  productController.getProductsByCategory
)

router.get(
  '/:id',
  zodValidationHandler(productValidation.getProductById),
  productController.getProductById
)

export const productRouter = router
