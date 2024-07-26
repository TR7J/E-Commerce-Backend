"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const AdminMiddleware_1 = require("../middleware/AdminMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const uploadFileController_1 = require("../controllers/uploadFileController");
const uploadRouter = express_1.default.Router();
uploadRouter.post("/", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, upload_1.default.single("file"), uploadFileController_1.uploadFileController);
exports.default = uploadRouter;
