"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
// require('dotenv').config()
const dotenv_defaults_1 = __importDefault(require("dotenv-defaults"));
dotenv_defaults_1.default.config();
// var conString = process.env.url;
const pool = new pg_1.Pool({
    max: 20,
    user: (_a = process.env) === null || _a === void 0 ? void 0 : _a.user,
    host: (_b = process.env) === null || _b === void 0 ? void 0 : _b.host,
    database: (_c = process.env) === null || _c === void 0 ? void 0 : _c.databaseName,
    password: (_d = process.env) === null || _d === void 0 ? void 0 : _d.password,
    port: (_e = process.env) === null || _e === void 0 ? void 0 : _e.port, // The default port for PostgreSQL is 5432
    // connectionString: conString,
    // ssl: true
});
exports.pool = pool;
//# sourceMappingURL=pool.js.map