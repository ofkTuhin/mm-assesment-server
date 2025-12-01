"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const zodValidationHandler_1 = __importDefault(require("../../middleware/zodValidationHandler"));
const paramsValidation_1 = require("../../../shared/paramsValidation");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const uploadImage_1 = require("../../middleware/uploadImage");
const parseFormData_1 = require("../../middleware/parseFormData");
const router = express_1.default.Router();
router.post('/', 
// checkAuth(),
(0, zodValidationHandler_1.default)(user_validation_1.userValidation.createUserSchema), user_controller_1.userController.createUserController);
router.get('/', 
// checkAuth(),
user_controller_1.userController.getAllUsers);
router.get('/:id', (0, checkAuth_1.default)(), user_controller_1.userController.getUserById);
router.patch('/', (0, checkAuth_1.default)(), uploadImage_1.upload.single('avatar'), parseFormData_1.parseFormDataFields, (0, zodValidationHandler_1.default)(user_validation_1.userValidation.updateUserSchema), user_controller_1.userController.updateUser);
router.patch('/:userId', 
// checkAuth(),
uploadImage_1.upload.single('avatar'), parseFormData_1.parseFormDataFields, (0, zodValidationHandler_1.default)(user_validation_1.userValidation.updateUserSchema), user_controller_1.userController.updateUser);
router.patch('/change-password', (0, checkAuth_1.default)(), user_controller_1.userController.changePassword);
router.delete('/:id', 
// checkAuth(),
(0, zodValidationHandler_1.default)(paramsValidation_1.paramsSchema), user_controller_1.userController.deleteUser);
router.patch('/soft-delete/:id', user_controller_1.userController.userSoftDelete);
router.patch('/retain/:id', user_controller_1.userController.retainUser);
router.patch('/status/:id', user_controller_1.userController.updateUserStatus);
exports.userRouter = router;
