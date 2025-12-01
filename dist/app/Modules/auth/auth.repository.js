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
exports.authRepository = exports.AuthRepository = void 0;
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const baseRepository_1 = require("../baseRepository/baseRepository");
class AuthRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(prisma_1.default.user);
    }
    findByEmail(email_1) {
        return __awaiter(this, arguments, void 0, function* (email, tx = prisma_1.default) {
            return tx.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            });
        });
    }
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.oTP.create({
                data: {
                    email,
                    otp,
                    expiresAt: new Date(Date.now() + Number(config_1.default.otp.expiresIn) * 60 * 1000),
                },
            });
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.oTP.findFirst({
                where: {
                    email,
                },
            });
        });
    }
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.oTP.deleteMany({
                where: { email },
            });
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
