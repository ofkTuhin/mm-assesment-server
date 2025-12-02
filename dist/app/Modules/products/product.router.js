"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const zodValidationHandler_1 = __importDefault(require("../../middleware/zodValidationHandler"));
const router = express_1.default.Router();
router.get('/', (0, zodValidationHandler_1.default)(product_validation_1.productValidation.getProductsQuery), product_controller_1.productController.getAllProducts);
router.get('/categories', product_controller_1.productController.getAllCategories);
router.get('/category/:category', (0, zodValidationHandler_1.default)(product_validation_1.productValidation.getProductsByCategory), product_controller_1.productController.getProductsByCategory);
router.get('/:id', (0, zodValidationHandler_1.default)(product_validation_1.productValidation.getProductById), product_controller_1.productController.getProductById);
exports.productRouter = router;
