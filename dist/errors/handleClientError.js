"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleClientError = (error) => {
    var _a, _b, _c, _d, _e, _f;
    let errors = [];
    let message = '';
    let statusCode = 400;
    // console.log(error.code);
    if (error.code === 'P2025') {
        message = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'Record not found!';
        statusCode = http_status_1.default.NOT_FOUND;
        errors = [
            {
                path: ((_b = error.meta) === null || _b === void 0 ? void 0 : _b.target) ? error.meta.target.toString() : '',
                message,
            },
        ];
    }
    else if (error.code === 'P2003') {
        if (error.message.includes('delete()` invocation:')) {
            message = 'Delete failed';
            errors = [
                {
                    path: ((_c = error.meta) === null || _c === void 0 ? void 0 : _c.target) ? error.meta.target.toString() : '',
                    message,
                },
            ];
        }
        else if (error.message.includes('update()')) {
            message = 'Update failed';
            errors = [
                {
                    path: ((_d = error.meta) === null || _d === void 0 ? void 0 : _d.target) ? error.meta.target.toString() : '',
                    message,
                },
            ];
        }
        else if (error.message.includes('create()')) {
            message = 'Create failed. Check your data';
            errors = [
                {
                    path: ((_e = error.meta) === null || _e === void 0 ? void 0 : _e.target) ? error.meta.target.toString() : '',
                    message,
                },
            ];
        }
    }
    else if (error.code === 'P2002') {
        if (error.message.includes('Unique constraint failed')) {
            statusCode = http_status_1.default.CONFLICT;
            message = 'Same data already exists';
            errors = [
                {
                    path: ((_f = error.meta) === null || _f === void 0 ? void 0 : _f.target) ? error.meta.target.toString() : '',
                    message,
                },
            ];
        }
    }
    return {
        statusCode,
        message,
        errorMessages: errors,
    };
};
exports.default = handleClientError;
//"//\nInvalid `prisma.semesterRegistration.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
