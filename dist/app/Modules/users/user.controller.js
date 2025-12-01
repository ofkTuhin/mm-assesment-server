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
exports.userController = void 0;
const pagination_1 = require("../../../constants/pagination");
const user_1 = require("../../../constants/user");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const uploadCloudinary_1 = require("../../../shared/uploadCloudinary");
const createUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.createUser(req.body);
    const { phone, email, firstName, lastName } = user;
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'user created successfully',
        statusCode: http_status_1.default.OK,
        data: {
            firstName,
            lastName,
            phone,
            email,
        },
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationField);
    const filterOptions = (0, pick_1.default)(req.query, user_1.userFilterableFields);
    const { users, meta } = yield user_service_1.userService.getAllUsers({
        paginationOptions,
        filterOptions,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.userService.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params || req.user || {};
    const userData = req.body;
    const avatarFile = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    // ✅ file uploaded by Multer
    const productAvatar = yield (0, uploadCloudinary_1.uploadOneCloudinary)(avatarFile);
    const updatedUser = yield user_service_1.userService.updateUser(userId, Object.assign(Object.assign({}, userData), { avatar: (productAvatar === null || productAvatar === void 0 ? void 0 : productAvatar.url) || undefined }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: updatedUser.message,
        data: updatedUser.user,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user || {};
    const result = yield user_service_1.userService.changePassword(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result.user,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params || {};
    const deletedUser = yield user_service_1.userService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: deletedUser.message,
        data: deletedUser.user,
    });
}));
const userSoftDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.userSoftDelete(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
}));
const retainUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.retainUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
}));
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.updateUserStatus(req.params.id, req.body.status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result.user,
    });
}));
exports.userController = {
    createUserController,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    userSoftDelete,
    retainUser,
    updateUserStatus,
    changePassword,
};
