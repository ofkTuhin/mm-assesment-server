"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
/* eslint-disable no-console */
// src/shared/websocket.ts
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(app_1.default);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' }, // adjust for production
});
exports.io = io;
io.on('connection', socket => {
    console.log('User connected:', socket.id);
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });
});
