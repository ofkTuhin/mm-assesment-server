"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, label, printf, prettyPrint } = winston_1.format;
const myFormat = printf(({ level, message, label: customLabel, timestamp: customTimeStamp }) => {
    const date = new Date(customTimeStamp);
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return `${date.toDateString()} ${hour}:${min}:${sec}  [${customLabel}] ${level}: ${message}`;
});
const successlog = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat, prettyPrint()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'success', 'ums-success-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new winston_1.transports.Console(),
    ],
});
const errorlog = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat, prettyPrint()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'error', 'ums-error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new winston_1.transports.Console(),
    ],
});
exports.default = {
    successlog,
    errorlog,
};
