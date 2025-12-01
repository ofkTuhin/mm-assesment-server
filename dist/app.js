"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const docsDir = path_1.default.join(__dirname, './docs');
// Default swagger configuration
let swaggerModules = [];
// Read all `.swagger.yaml` files inside `src/docs` if directory exists
if (fs_1.default.existsSync(docsDir)) {
    swaggerModules = fs_1.default
        .readdirSync(docsDir)
        .filter(file => file.endsWith('.swagger.yaml'))
        .map(file => yamljs_1.default.load(path_1.default.join(docsDir, file)));
}
const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Combined Swagger docs for all modules',
    },
    paths: swaggerModules.reduce((acc, doc) => (Object.assign(Object.assign({}, acc), doc.paths)), {}),
    components: {
        schemas: swaggerModules.reduce((acc, doc) => { var _a; return (Object.assign(Object.assign({}, acc), (((_a = doc.components) === null || _a === void 0 ? void 0 : _a.schemas) || {}))); }, {}),
    },
    tags: swaggerModules.flatMap(doc => doc.tags || []),
};
const globalErrorhandler_1 = __importDefault(require("./app/middleware/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes/routes"));
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://fibre52-trial.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-token', 'reset-token'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1', routes_1.default);
app.use(globalErrorhandler_1.default);
// Serve Swagger UI and JSON
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
// not found route
app.use((_, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'not found',
        errorMessage: [
            {
                path: '',
                message: 'Api not found',
            },
        ],
    });
});
exports.default = app;
