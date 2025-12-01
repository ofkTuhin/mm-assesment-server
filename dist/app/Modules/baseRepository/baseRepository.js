"use strict";
// base.repository.ts
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
exports.BaseRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class BaseRepository {
    constructor(delegate) {
        this.delegate = delegate;
    }
    create(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.create.call(tx, args);
        });
    }
    createMany(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.createMany.call(tx, args);
        });
    }
    update(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.update.call(tx, args);
        });
    }
    delete(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.delete.call(tx, args);
        });
    }
    findById(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.findUnique.call(tx, args);
        });
    }
    findAll(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.findMany.call(tx, args);
        });
    }
    findManyAndCount(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            const [items, total] = yield Promise.all([
                this.delegate.findMany.call(tx, args),
                this.delegate.count.call(tx, { where: args.where }),
            ]);
            return [items, total];
        });
    }
    softDelete(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.update.call(tx, Object.assign(Object.assign({}, args), { data: Object.assign(Object.assign({}, args.data), { isDeleted: true, deletedAt: new Date(), status: false }) }));
        });
    }
    restore(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.update.call(tx, Object.assign(Object.assign({}, args), { data: Object.assign(Object.assign({}, args.data), { isDeleted: false, deletedAt: null, status: true }) }));
        });
    }
    updateStatus(args_1) {
        return __awaiter(this, arguments, void 0, function* (args, tx = prisma_1.default) {
            return this.delegate.update.call(tx, Object.assign(Object.assign({}, args), { data: Object.assign(Object.assign({}, args.data), { status: args.data.status }) }));
        });
    }
}
exports.BaseRepository = BaseRepository;
