"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const product_service_1 = require("./product.service");
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const result = yield product_service_1.productService.getAllProducts(limit);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Products retrieved successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getProductsByCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const result = yield product_service_1.productService.getProductsByCategory(category, limit);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Products retrieved successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getProductById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const result = yield product_service_1.productService.getProductById(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Product retrieved successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getAllCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getAllCategories();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Categories retrieved successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.productController = {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getAllCategories,
};
