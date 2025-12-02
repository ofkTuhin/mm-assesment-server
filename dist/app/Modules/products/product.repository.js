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
exports.productRepository = exports.ProductRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const baseRepository_1 = require("../baseRepository/baseRepository");
class ProductRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(prisma_1.default.product);
    }
    findAllProducts(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.findAll({
                take: limit,
                include: {
                    rating: {
                        select: {
                            rate: true,
                            count: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return products.map((product) => {
                var _a, _b;
                return ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category.name,
                    image: product.image,
                    rating: {
                        rate: ((_a = product.rating) === null || _a === void 0 ? void 0 : _a.rate) || 0,
                        count: ((_b = product.rating) === null || _b === void 0 ? void 0 : _b.count) || 0,
                    },
                });
            });
        });
    }
    findByCategory(category, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.findAll({
                where: {
                    category: {
                        name: {
                            equals: category,
                            mode: 'insensitive',
                        },
                    },
                },
                take: limit,
                include: {
                    rating: {
                        select: {
                            rate: true,
                            count: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return products.map((product) => {
                var _a, _b;
                return ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category.name,
                    image: product.image,
                    rating: {
                        rate: ((_a = product.rating) === null || _a === void 0 ? void 0 : _a.rate) || 0,
                        count: ((_b = product.rating) === null || _b === void 0 ? void 0 : _b.count) || 0,
                    },
                });
            });
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const product = yield this.findById({
                where: { id },
                include: {
                    rating: {
                        select: {
                            rate: true,
                            count: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (!product)
                return null;
            return {
                id: product.id,
                title: product.title,
                price: product.price,
                description: product.description,
                category: product.category.name,
                image: product.image,
                rating: {
                    rate: ((_a = product.rating) === null || _a === void 0 ? void 0 : _a.rate) || 0,
                    count: ((_b = product.rating) === null || _b === void 0 ? void 0 : _b.count) || 0,
                },
            };
        });
    }
    findAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.category.findMany({
                orderBy: {
                    name: 'asc',
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        });
    }
}
exports.ProductRepository = ProductRepository;
exports.productRepository = new ProductRepository();
