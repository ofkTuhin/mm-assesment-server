"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    var _a, _b;
    const responseData = {
        // statusCode: data.statusCode,
        success: data.success,
        message: (_a = data.message) !== null && _a !== void 0 ? _a : null,
        meta: data.meta,
        data: (_b = data.data) !== null && _b !== void 0 ? _b : null,
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
