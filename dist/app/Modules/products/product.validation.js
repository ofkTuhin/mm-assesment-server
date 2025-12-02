"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const getProductsQuery = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z
            .string()
            .optional()
            .transform(val => (val ? Number(val) : undefined)),
    }),
});
const getProductsByCategory = zod_1.z.object({
    params: zod_1.z.object({
        category: zod_1.z.string().min(1, 'Category is required'),
    }),
    query: zod_1.z.object({
        limit: zod_1.z
            .string()
            .optional()
            .transform(val => (val ? Number(val) : undefined)),
    }),
});
const getProductById = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().transform(val => Number(val)),
    }),
});
exports.productValidation = {
    getProductsQuery,
    getProductsByCategory,
    getProductById,
};
