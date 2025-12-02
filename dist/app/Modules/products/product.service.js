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
exports.productService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const product_repository_1 = require("./product.repository");
const getAllProducts = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_repository_1.productRepository.findAllProducts(limit);
    return products;
});
const getProductsByCategory = (category, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_repository_1.productRepository.findByCategory(category, limit);
    if (products.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `No products found in category: ${category}`);
    }
    return products;
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_repository_1.productRepository.findProductById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Product with id ${id} not found`);
    }
    return product;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield product_repository_1.productRepository.findAllCategories();
    return categories;
});
exports.productService = {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getAllCategories,
};
