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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const checkAuth = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let token = '';
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ') &&
            ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== 'undefined') {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken) && ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.accessToken) !== 'undefined') {
            token = (_d = req.cookies) === null || _d === void 0 ? void 0 : _d.accessToken;
        }
        if (!token || token === 'undefined') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'No token provided');
        }
        // ✅ verify handles expiration internally
        const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        if (!verifiedUser || !verifiedUser.userId) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        }
        req.user = verifiedUser;
        // const rolePermission = await prisma.rolePermission.findFirst({
        //   where: {
        //     roleId: verifiedUser.roleId,
        //     permission: {
        //       module: { name: moduleName },
        //       action: action,
        //     },
        //   },
        //   include: { permission: { include: { module: true } } },
        // })
        const isUser = yield prisma_1.default.user.findUnique({
            where: { id: verifiedUser.userId },
        });
        if (!isUser) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found');
        }
        if (role && isUser.role !== role) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden: No access');
        }
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token expired, please login again'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token'));
        }
        console.error('🚀 Auth error:', error);
        next(error);
    }
});
exports.default = checkAuth;
