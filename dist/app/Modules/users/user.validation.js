"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.updateUserSchema = exports.createUserSchema = void 0;
const prisma_1 = require("../../../../generated/prisma");
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z
            .string()
            .min(2, 'First Name must be at least 2 characters')
            .max(50, 'First Name must be between 2 and 50 characters')
            .optional(),
        lastName: zod_1.z
            .string()
            .min(2, 'Last Name must be at least 2 characters')
            .max(50, 'Last Name must be between 2 and 50 characters')
            .optional(),
        email: zod_1.z.string().email('Email must be a valid email'),
        password: zod_1.z.string().optional(),
        phoneNumber: zod_1.z
            .string()
            .regex(/^(\+\d{1,4}\s?)?(\d{1,4}[-.\s]?)?\(?\d{1,6}\)?[-.\s]?\d{1,9}([-.\s]?\d{1,5})?$/, 'Phone number must be a valid number')
            .optional(),
        company: zod_1.z.string().optional(),
        avatar: zod_1.z.string().url('Avatar must be a valid URL').optional(),
        registrationStatus: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(prisma_1.UserRole).default('HQ'),
        status: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        createdBy: zod_1.z.string().uuid().optional(),
    })
        .strict(),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email().optional(),
        firstName: zod_1.z
            .string()
            .min(2, 'First Name must be at least 2 characters')
            .max(50, 'First Name must be between 2 and 50 characters')
            .optional(),
        lastName: zod_1.z
            .string()
            .min(2, 'Last Name must be at least 2 characters')
            .max(50, 'Last Name must be between 2 and 50 characters')
            .optional(),
        phoneNumber: zod_1.z
            .string()
            .regex(/^(\+\d{1,4}\s?)?(\d{1,4}[-.\s]?)?\(?\d{1,6}\)?[-.\s]?\d{1,9}([-.\s]?\d{1,5})?$/, 'Phone number must be a valid number')
            .optional(),
        password: zod_1.z.string().optional(),
        company: zod_1.z.string().optional(),
        avatar: zod_1.z.string().url('Avatar must be a valid URL').optional(),
        registrationStatus: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(prisma_1.UserRole).optional(),
        status: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    })
        .strict(),
});
exports.userValidation = {
    createUserSchema: exports.createUserSchema,
    updateUserSchema: exports.updateUserSchema,
};
