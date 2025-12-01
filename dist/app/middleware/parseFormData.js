"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormDataFields = void 0;
const parseFormDataFields = (req, res, next) => {
    if (req.body && typeof req.body.data === 'string') {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (_a) {
            return res.status(400).json({ error: 'Invalid JSON in user Data' });
        }
    }
    next();
};
exports.parseFormDataFields = parseFormDataFields;
