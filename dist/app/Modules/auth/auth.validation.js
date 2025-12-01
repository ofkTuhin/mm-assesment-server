"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = void 0;
const zod_1 = require("zod");
const loginUser = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email('Email must be a valid email'),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
        phoneNumber: zod_1.z.string().min(10, 'Mobile number must be at least 10 characters').optional(),
    })
        .strict(),
});
exports.loginValidation = {
    loginUser,
};
