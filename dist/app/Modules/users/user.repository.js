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
exports.userRepository = exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const baseRepository_1 = require("../baseRepository/baseRepository");
const defaultSelect = {
    id: true,
    email: true,
    password: false,
    firstName: true,
    lastName: true,
    role: true,
    phoneNumber: true,
    status: true,
};
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(prisma_1.default.user);
    }
    // custom method
    findByEmailOrMobileNumber(email, phoneNumber, select) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.findFirst({
                where: { OR: [{ email }, { phoneNumber }] },
                select: Object.assign(Object.assign({}, defaultSelect), select),
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.findUnique({
                where: { email },
                select: Object.assign(Object.assign({}, defaultSelect), { password: true }),
            });
        });
    }
    findManyAndCount(args) {
        const _super = Object.create(null, {
            findManyAndCount: { get: () => super.findManyAndCount }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.findManyAndCount.call(this, args);
        });
    }
    transaction(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.$transaction(fn);
        });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
