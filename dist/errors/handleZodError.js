"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    var _a;
    const errors = error.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: (issue === null || issue === void 0 ? void 0 : issue.message) == 'Required'
                ? `${issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1]} field is required`
                : issue === null || issue === void 0 ? void 0 : issue.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: (errors && (errors === null || errors === void 0 ? void 0 : errors.length) && ((_a = errors === null || errors === void 0 ? void 0 : errors[0]) === null || _a === void 0 ? void 0 : _a.message)) ||
            'Input validation error. Please check your input and try again',
        errorMessages: errors,
    };
};
exports.default = handleZodError;
