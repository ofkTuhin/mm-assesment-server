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
exports.userService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const bcrypt_1 = require("../../../shared/bcrypt");
const user_repository_1 = require("./user.repository");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // const { password, ...userCreateData } = userData
    var _a;
    // Check if user already exists
    const isUserExists = yield user_repository_1.userRepository.findByEmailOrMobileNumber(userData.email, (_a = userData.phoneNumber) !== null && _a !== void 0 ? _a : '');
    if (isUserExists) {
        throw new Error('User already exists with this email or phone');
    }
    if (userData.password) {
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(userData.password);
        userData.password = hashedPassword;
    }
    // Format userMeta into [{ key, value }]
    // ✅ Create user and link branches in one query
    const user = yield user_repository_1.userRepository.create({
        data: Object.assign(Object.assign({}, userData), { role: userData.role }),
    });
    if (!user) {
        throw new Error('Failed to create user');
    }
    return user;
});
const buildUserWhereClause = (filterOptions, companyId, branchIds) => {
    const where = {};
    const { searchTerm, role } = filterOptions;
    if (searchTerm) {
        where.OR = [
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }
    if (role) {
        where.role = role;
    }
    return where;
};
const getAllUsers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ paginationOptions, filterOptions, }) {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const where = buildUserWhereClause(filterOptions);
    const [users, total] = yield user_repository_1.userRepository.findManyAndCount({
        where: Object.assign(Object.assign({}, where), { isDeleted: false }),
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
            role: true,
            company: true,
        },
    });
    const totalPages = Math.ceil(total / limit);
    return {
        users,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.findById({
        where: { id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            status: true,
            role: true,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = userData || {}, { role } = _a, rest = __rest(_a, ["role"]);
    const cleanUserData = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== undefined));
    if (role) {
        cleanUserData.role = role;
    }
    if (cleanUserData.password) {
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(cleanUserData.password);
        cleanUserData.password = hashedPassword;
    }
    const result = yield user_repository_1.userRepository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.update({
            where: { id },
            data: Object.assign({}, cleanUserData),
        });
        if (!user) {
            throw new Error('Failed to update user');
        }
        return tx.user.findUnique({
            where: { id },
        });
    }));
    return {
        user: result,
        message: 'User updated successfully',
    };
});
const changePassword = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = payload;
    const userExists = yield user_repository_1.userRepository.findById({ where: { id } });
    if (!userExists) {
        throw new Error('User not found');
    }
    if (userExists.password && !(yield (0, bcrypt_1.comparePassword)(oldPassword, userExists.password))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is incorrect');
    }
    const hashedPassword = yield (0, bcrypt_1.hashPassword)(newPassword);
    const user = yield user_repository_1.userRepository.update({
        where: { id },
        data: { password: hashedPassword },
    });
    if (!user) {
        throw new Error('Failed to change password');
    }
    return {
        user,
        message: 'Password changed successfully',
    };
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.delete({
        where: { id },
    });
    if (!user) {
        throw new Error('Failed to delete user');
    }
    return {
        user,
        message: 'User deleted successfully',
    };
});
const userSoftDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.softDelete({
        where: { id },
        data: {},
    });
    if (!user)
        throw new ApiError_1.default(400, 'User not found or delete failed');
    return { message: 'User soft-deleted successfully' };
});
const retainUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.restore({
        where: { id },
        data: { isDeleted: false },
    });
    if (!user)
        throw new ApiError_1.default(404, 'User not found or restore failed');
    return { message: 'User restored successfully' };
});
const updateUserStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_repository_1.userRepository.update({
        where: { id },
        data: { status },
    });
    if (!user)
        throw new ApiError_1.default(404, 'User not found or status update failed');
    return { user, message: 'User status updated successfully' };
});
exports.userService = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    userSoftDelete,
    retainUser,
    updateUserStatus,
    changePassword,
};
