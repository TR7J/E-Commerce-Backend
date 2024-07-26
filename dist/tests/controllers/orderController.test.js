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
const Order_1 = require("../../src/models/Order");
const mongoose_1 = __importDefault(require("mongoose"));
const orderController_1 = require("../../src/controllers/orderController");
jest.mock("../../src/models/Order");
jest.mock("../../src/models/User");
jest.mock("../../src/models/Product");
describe("Order Controller", () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { _id: new mongoose_1.default.Types.ObjectId() },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });
    describe("getOrders", () => {
        it("should return all orders", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrders = [
                { _id: new mongoose_1.default.Types.ObjectId(), user: { name: "John Doe" } },
            ];
            Order_1.Order.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockOrders),
            });
            yield (0, orderController_1.getOrders)(req, res);
            expect(res.send).toHaveBeenCalledWith(mockOrders);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error fetching orders");
            Order_1.Order.find.mockReturnValue({
                populate: jest.fn().mockRejectedValue(error),
            });
            yield (0, orderController_1.getOrders)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "Error fetching orders",
                error,
            });
        }));
    });
    describe("getUserOrders", () => {
        it("should return orders of the authenticated user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrders = [{ _id: new mongoose_1.default.Types.ObjectId() }];
            Order_1.Order.find.mockResolvedValue(mockOrders);
            yield (0, orderController_1.getUserOrders)(req, res);
            expect(res.json).toHaveBeenCalledWith(mockOrders);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Server error");
            Order_1.Order.find.mockRejectedValue(error);
            yield (0, orderController_1.getUserOrders)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        }));
    });
    describe("getOrderById", () => {
        it("should return order by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrder = { _id: new mongoose_1.default.Types.ObjectId() };
            Order_1.Order.findById.mockResolvedValue(mockOrder);
            yield (0, orderController_1.getOrderById)(req, res);
            expect(res.json).toHaveBeenCalledWith(mockOrder);
        }));
        it("should return 404 if order not found", () => __awaiter(void 0, void 0, void 0, function* () {
            Order_1.Order.findById.mockResolvedValue(null);
            yield (0, orderController_1.getOrderById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Order Not Found" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Server error");
            Order_1.Order.findById.mockRejectedValue(error);
            yield (0, orderController_1.getOrderById)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        }));
    });
    describe("createOrder", () => {
        it("should create a new order", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body.orderItems = [{ _id: new mongoose_1.default.Types.ObjectId() }];
            const mockOrder = { _id: new mongoose_1.default.Types.ObjectId() };
            Order_1.Order.create.mockResolvedValue(mockOrder);
            yield (0, orderController_1.createOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Order Created",
                order: mockOrder,
            });
        }));
        it("should return 400 if cart is empty", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body.orderItems = [];
            yield (0, orderController_1.createOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Cart is empty" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body.orderItems = [{ _id: new mongoose_1.default.Types.ObjectId() }];
            const error = new Error("Server error");
            Order_1.Order.create.mockRejectedValue(error);
            yield (0, orderController_1.createOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        }));
    });
    describe("updateOrderToPaid", () => {
        it("should update order to paid", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a mock order with all expected properties
            const mockOrder = {
                _id: "66a301f9231a1269eb2cccb2",
                isPaid: true,
                paidAt: new Date(),
                paymentResult: {
                    email_address: "test@example.com",
                    paymentId: "paymentId123",
                    status: "completed",
                    update_time: new Date(),
                },
                save: jest.fn().mockResolvedValue({
                    _id: "66a301f9231a1269eb2cccb2",
                    isPaid: true,
                    paidAt: new Date(),
                    paymentResult: {
                        email_address: "test@example.com",
                        paymentId: "paymentId123",
                        status: "completed",
                        update_time: new Date(),
                    },
                }),
            };
            Order_1.Order.findById.mockResolvedValue(mockOrder);
            // Mock request body
            req.body = {
                id: "paymentId123",
                status: "completed",
                update_time: new Date(),
                email_address: "test@example.com",
            };
            yield (0, orderController_1.updateOrderToPaid)(req, res);
            expect(res.json).toHaveBeenCalledWith({
                order: {
                    _id: "66a301f9231a1269eb2cccb2",
                    isPaid: true,
                    paidAt: expect.any(Date),
                    paymentResult: {
                        email_address: "test@example.com",
                        paymentId: "paymentId123",
                        status: "completed",
                        update_time: expect.any(Date),
                    },
                },
                message: "Order Paid Successfully",
            });
        }));
        it("should return 404 if order not found", () => __awaiter(void 0, void 0, void 0, function* () {
            Order_1.Order.findById.mockResolvedValue(null);
            yield (0, orderController_1.updateOrderToPaid)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Order Not Found" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Server error");
            Order_1.Order.findById.mockRejectedValue(error);
            yield (0, orderController_1.updateOrderToPaid)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        }));
    });
    describe("deleteOrder", () => {
        it("should delete an order", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrder = { _id: new mongoose_1.default.Types.ObjectId() };
            Order_1.Order.findById.mockResolvedValue(mockOrder);
            Order_1.Order.findByIdAndDelete.mockResolvedValue(mockOrder);
            yield (0, orderController_1.deleteOrder)(req, res);
            expect(res.send).toHaveBeenCalledWith({ message: "Order Deleted" });
        }));
        it("should return 404 if order not found", () => __awaiter(void 0, void 0, void 0, function* () {
            Order_1.Order.findById.mockResolvedValue(null);
            yield (0, orderController_1.deleteOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Order Not Found" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error deleting order");
            Order_1.Order.findById.mockRejectedValue(error);
            yield (0, orderController_1.deleteOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "Error deleting order",
            });
        }));
    });
    describe("deliverOrder", () => {
        it("should deliver an order", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrder = { save: jest.fn(), _id: new mongoose_1.default.Types.ObjectId() };
            Order_1.Order.findById.mockResolvedValue(mockOrder);
            yield (0, orderController_1.deliverOrder)(req, res);
            expect(res.send).toHaveBeenCalledWith({ message: "Order Delivered" });
        }));
        it("should return 404 if order not found", () => __awaiter(void 0, void 0, void 0, function* () {
            Order_1.Order.findById.mockResolvedValue(null);
            yield (0, orderController_1.deliverOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Order Not Found" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error delivering order");
            Order_1.Order.findById.mockRejectedValue(error);
            yield (0, orderController_1.deliverOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "Error delivering order",
            });
        }));
    });
});
