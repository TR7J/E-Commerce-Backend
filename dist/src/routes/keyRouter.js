"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyRouter = void 0;
const express_1 = __importDefault(require("express"));
const keyController_1 = require("../controllers/keyController");
exports.keyRouter = express_1.default.Router();
// /api/keys/paypal
exports.keyRouter.get("/paypal", keyController_1.getPaypalClientID);
