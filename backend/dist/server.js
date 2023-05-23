"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require('dotenv').config();
const dotenv_defaults_1 = __importDefault(require("dotenv-defaults"));
dotenv_defaults_1.default.config();
const Model_1 = __importDefault(require("./Model"));
console.log("dotenv = ", process.env.port);
const PORT = process.env.port || 8000;
const express_1 = __importStar(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use((0, cors_1.default)(corsOption));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)());
// db.sequelize.sync({ alter: true }).then(() => {    //drop table if exists
//     console.log("db has been sync")
// })
Model_1.default.sequelize.sync().then(() => {
    console.log("db has been sync");
});
// app.use(express.static(path.join(__dirname, "..", "..", "frontend", "build")));
// app.get("/*", (_, res) => {
//   res.sendFile(path.join(__dirname,"..","..", "frontend", "build", "index.html"));
// });
try {
    app.listen(PORT, () => {
        console.log("Server listening on Port", PORT);
    });
}
catch (err) {
    console.error("Error in server setup:", err);
}
//# sourceMappingURL=server.js.map