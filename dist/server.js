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
const config_1 = __importDefault(require("./config"));
const websocket_1 = require("./shared/websocket");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number(config_1.default.port) || 5000;
        const servers = websocket_1.server.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}`);
        });
        const exitHandler = () => {
            if (servers) {
                servers.close(() => {
                    console.log('Server closed');
                    process.exit(0);
                });
            }
            else {
                process.exit(0);
            }
        };
        const unexpectedErrorHandler = (error) => {
            console.error(error);
            exitHandler();
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        if (process.env.NODE_ENV === 'production') {
            process.on('SIGTERM', () => {
                console.log('SIGTERM received');
                exitHandler();
            });
            process.on('SIGINT', () => {
                console.log('SIGINT received (e.g. Ctrl+C)');
                exitHandler();
            });
        }
    });
}
bootstrap();
