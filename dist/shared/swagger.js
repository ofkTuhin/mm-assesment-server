"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo API',
            version: '1.0.0',
            description: 'API documentation for the Todo app',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        // components: {
        //   securitySchemes: {
        //     bearerAuth: {
        //       type: "http",
        //       scheme: "bearer",
        //       bearerFormat: "JWT",
        //     },
        //   },
        // },
        // security: [
        //   {
        //     bearerAuth: [],
        //   },
        // ],
    },
    apis: ['./src/**/*.ts'], // Path to the API docs
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
