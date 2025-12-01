"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.authService = exports.sendOTP = exports.resetPassword = exports.setPassword = exports.validateOTPAndGenerateToken = exports.forgotPassword = void 0;
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const bcrypt_1 = require("../../../shared/bcrypt");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const email_1 = require("../../../shared/email");
const generateOtp_1 = require("../../../shared/generateOtp");
const user_repository_1 = require("../users/user.repository");
const auth_repository_1 = require("./auth.repository");
const auth_const_1 = require("./auth.const");
const checkUserEmailAndPassword = (email, isForget) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!user.password || isForget) {
        yield auth_repository_1.authRepository.deleteOtp(email);
        yield (0, exports.sendOTP)(email);
    }
    return {
        isPassword: !!user.password,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber } = payload;
    const user = yield user_repository_1.userRepository.findByEmailOrMobileNumber(email || '', phoneNumber || '', {
        password: true,
        status: true,
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.status === false) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Your account has been disabled');
    }
    if (user.password && !(yield (0, bcrypt_1.comparePassword)(password, user.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password in incorrect');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt.secret, String(config_1.default.jwt.expires_in));
    return {
        message: 'Login successful',
        accessToken,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        role: user.role,
    };
});
const getAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        console.error(err);
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId } = verifiedToken;
    const isUserExist = yield user_repository_1.userRepository.findById({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const jwtPayload = {
        userId: isUserExist.id,
        role: isUserExist.role,
    };
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt.secret, String(config_1.default.jwt.expires_in));
    return {
        accessToken: newAccessToken,
    };
});
const getLoggedInUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            avatar: true,
            email: true,
            role: true,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield (0, exports.sendOTP)(email);
    return user;
});
exports.forgotPassword = forgotPassword;
/**
 * Validates OTP and returns a temporary token for password reset
 * @param email - User's email address
 * @param otp - OTP to validate
 * @returns Temporary JWT token for password reset
 */
const validateOTPAndGenerateToken = (email, otp, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otpData = yield auth_repository_1.authRepository.findOtp(email);
    if (!otpData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'OTP not found');
    }
    // check if otp code is expired
    if (otpData.expiresAt < new Date(Date.now() * 1000 * 60)) {
        throw new ApiError_1.default(http_status_1.default.UNPROCESSABLE_ENTITY, 'OTP is expired or already been used.');
    }
    //   check if otp code is correct
    if (otpData.otp !== otp) {
        throw new ApiError_1.default(http_status_1.default.UNPROCESSABLE_ENTITY, 'Invalid OTP');
    }
    yield auth_repository_1.authRepository.deleteOtp(email);
    if (!process.env.JWT_SECRET) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT secret not configured');
    }
    const token = jwtHelpers_1.jwtHelpers.createToken({
        userId: user.id,
        role: user.role,
        email: user.email,
        purpose: purpose,
    }, config_1.default.jwt.secret, '15m');
    return token;
});
exports.validateOTPAndGenerateToken = validateOTPAndGenerateToken;
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_repository_1.authRepository.findByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield auth_repository_1.authRepository.deleteOtp(email);
    yield (0, exports.sendOTP)(email);
    return {
        message: 'OTP sent successfully',
    };
});
const setPassword = (password, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const { email, purpose } = decoded;
    // Verify this token is specifically for password reset
    if (purpose !== auth_const_1.AUTH_CONSTANTS.SET_PASSWORD_PURPOSE) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token purpose');
    }
    const user = yield user_repository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
    const updatedUser = yield user_repository_1.userRepository.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
    let login;
    if (updatedUser) {
        login = yield loginUser({ email: updatedUser.email, password });
    }
    return login;
});
exports.setPassword = setPassword;
/**
 * Resets user password using temporary token
 * @param password - New password
 * @param confirmPassword - Confirm password
 * @param token - Temporary JWT token from OTP validation
 * @returns User data without password
 */
const resetPassword = (password, confirmPassword, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.JWT_SECRET) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT secret not configured');
        }
        const decoded = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        const { email, purpose } = decoded;
        if (purpose !== auth_const_1.AUTH_CONSTANTS.RESET_PASSWORD_PURPOSE) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token purpose');
        }
        const user = yield user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
        const updatedUser = yield user_repository_1.userRepository.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        return updatedUser;
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token expired');
        }
        throw error;
    }
});
exports.resetPassword = resetPassword;
const sendOTP = (email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, generateOtp_1.generateOTP)();
    const createOtp = yield auth_repository_1.authRepository.createOtp(email, otp);
    if (createOtp) {
        yield (0, email_1.sendOTPEmail)(createOtp.email, createOtp.otp);
    }
    else if (phoneNumber) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Phone number is not supported yet');
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Either email or mobile number is required');
    }
});
exports.sendOTP = sendOTP;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // No server-side token invalidation for stateless JWT, just clear cookies on client
    const user = yield user_repository_1.userRepository.findById({ where: { id: userId } });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return { message: 'Logout successful' };
});
exports.authService = {
    loginUser,
    getAccessToken,
    getLoggedInUser,
    validateOTPAndGenerateToken: exports.validateOTPAndGenerateToken,
    resetPassword: exports.resetPassword,
    forgotPassword: exports.forgotPassword,
    checkUserEmailAndPassword,
    setPassword: exports.setPassword,
    resendOtp,
    logout,
};
