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
exports.sendOTPEmail = exports.sendEmail = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const nodemailer_1 = require("nodemailer");
// Create a transporter using environment variables
const transporter = (0, nodemailer_1.createTransport)({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
/**
 * Sends an email
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Email body
 */
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: `"Vendor Management" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Failed to send email');
    }
});
exports.sendEmail = sendEmail;
/**
 * Sends OTP email
 * @param email - Recipient email address
 * @param otp - OTP to send
 */
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}\nThis OTP will expire in 5 minutes.`;
    yield (0, exports.sendEmail)(email, subject, text);
});
exports.sendOTPEmail = sendOTPEmail;
