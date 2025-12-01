"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
    const rawPage = Number(options.page);
    const rawLimit = Number(options.limit);
    // Enforce positive integers; defaults: page=1, limit=10; and cap limit to protect the DB
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const MAX_LIMIT = 100;
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), MAX_LIMIT) : 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy && options.sortBy.trim() ? options.sortBy : 'createdAt';
    const normalizedOrder = typeof options.sortOrder === 'string' ? options.sortOrder.toLowerCase() : undefined;
    const sortOrder = normalizedOrder === 'asc' ? 'asc' : 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.paginationHelpers = {
    calculatePagination,
};
