"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const zodValidationHandler_1 = __importDefault(require("../../middleware/zodValidationHandler"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/check-user', auth_controller_1.authController.getUserEmailAndPassword);
router.post('/set-password', auth_controller_1.authController.setPassword);
router.post('/login', (0, zodValidationHandler_1.default)(auth_validation_1.loginValidation.loginUser), auth_controller_1.authController.loginUser);
router.get('/access-token', 
// zodValidationHandler(loginValidation.getAccessToken),
auth_controller_1.authController.getAccessToken);
router.get('/user', (0, checkAuth_1.default)(), auth_controller_1.authController.getLoggedInUser);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
router.post('/validate-otp', auth_controller_1.authController.validateOTPAndGenerateToken);
router.patch('/reset-password', auth_controller_1.authController.resetPassword);
router.post('/resend-otp', auth_controller_1.authController.resendOtp);
router.post('/logout', (0, checkAuth_1.default)(), auth_controller_1.authController.logout);
exports.authRouter = router;
