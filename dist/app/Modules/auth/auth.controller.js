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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
// update semester
const getUserEmailAndPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isForget } = req.body;
    const result = yield auth_service_1.authService.checkUserEmailAndPassword(email, isForget);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User email and password checked successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserData = req.body;
    const result = yield auth_service_1.authService.loginUser(loginUserData);
    const { accessToken } = result, others = __rest(result, ["accessToken"]);
    const isProd = process.env.NODE_ENV === 'production';
    const accessTokenCookieOptions = {
        // secure: true,
        // httpOnly: true,
        // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
        // expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        // sameSite: 'none' as const,
        httpOnly: true,
        secure: isProd, // ❗ false on localhost, true on Vercel
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: '/',
    };
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Login successfully!',
        data: others,
    });
}));
const getAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.authService.getAccessToken(refreshToken);
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    };
    res.cookie('accessToken', result.accessToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully !',
    });
}));
const getLoggedInUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user || {};
    const user = yield auth_service_1.authService.getLoggedInUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'user retrieved successfully',
        statusCode: http_status_1.default.OK,
        data: user,
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.authService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'OTP sent successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const validateOTPAndGenerateToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, purpose } = req.body;
    const result = yield auth_service_1.authService.validateOTPAndGenerateToken(email, otp, purpose);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'OTP validated successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const setPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const token = req.headers['set-token'].split(' ')[1];
    const result = yield auth_service_1.authService.setPassword(password, token);
    const { accessToken } = result, others = __rest(result, ["accessToken"]);
    const accessTokenCookieOptions = {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: 'none',
    };
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Password set successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const resendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.authService.resendOtp(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'OTP resent successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['reset-token'];
    const token = authHeader.split(' ')[1];
    if (!authHeader || !token) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or missing authorization header');
    }
    const { password, confirmPassword } = req.body;
    const result = yield auth_service_1.authService.resetPassword(password, confirmPassword, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Password reset successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user || {};
    res.clearCookie('accessToken');
    const result = yield auth_service_1.authService.logout(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
}));
exports.authController = {
    getUserEmailAndPassword,
    loginUser,
    getAccessToken,
    getLoggedInUser,
    forgotPassword,
    validateOTPAndGenerateToken,
    resetPassword,
    setPassword,
    resendOtp,
    logout,
};
