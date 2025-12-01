"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../Modules/auth/auth.router");
const user_router_1 = require("../Modules/users/user.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_router_1.userRouter,
    },
    {
        path: '/auth',
        route: auth_router_1.authRouter,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
