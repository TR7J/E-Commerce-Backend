"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const AdminMiddleware_1 = require("../middleware/AdminMiddleware");
const orderRouter = express_1.default.Router();
exports.orderRouter = orderRouter;
orderRouter.get("/mine", AuthMiddleware_1.AuthMiddleware, orderController_1.getUserOrders);
orderRouter.get("/:id", AuthMiddleware_1.AuthMiddleware, orderController_1.getOrderById);
orderRouter.get("/", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, orderController_1.getOrders);
orderRouter.post("/", AuthMiddleware_1.AuthMiddleware, orderController_1.createOrder);
orderRouter.put("/:id/pay", AuthMiddleware_1.AuthMiddleware, orderController_1.updateOrderToPaid);
orderRouter.put("/:id/deliver", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, orderController_1.deliverOrder);
orderRouter.delete("/:id", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, orderController_1.deleteOrder);
