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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverOrder = exports.deleteOrder = exports.updateOrderToPaid = exports.createOrder = exports.getOrderById = exports.getUserOrders = exports.getOrders = void 0;
const Order_1 = require("../models/Order");
// admin to get orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.find().populate("user", "name");
        res.send(orders);
    }
    catch (error) {
        res.status(500).send({ message: "Error fetching orders", error });
    }
});
exports.getOrders = getOrders;
// Get orders of the authenticated user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.find({ user: req.user._id });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserOrders = getUserOrders;
// Get order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.Order.findById(req.params.id);
        if (order) {
            res.json(order);
        }
        else {
            res.status(404).json({ message: "Order Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getOrderById = getOrderById;
// Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.orderItems.length === 0) {
            res.status(400).json({ message: "Cart is empty" });
            return;
        }
        const createdOrder = yield Order_1.Order.create({
            orderItems: req.body.orderItems.map((x) => (Object.assign(Object.assign({}, x), { product: x._id }))),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });
        res.status(201).json({ message: "Order Created", order: createdOrder });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.createOrder = createOrder;
// Update order to paid
const updateOrderToPaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = new Date(Date.now());
            order.paymentResult = {
                paymentId: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updatedOrder = yield order.save();
            res.json({ order: updatedOrder, message: "Order Paid Successfully" });
        }
        else {
            res.status(404).json({ message: "Order Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateOrderToPaid = updateOrderToPaid;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.Order.findById(req.params.id);
        if (order) {
            yield Order_1.Order.findByIdAndDelete(req.params.id);
            res.send({ message: "Order Deleted" });
        }
        else {
            res.status(404).send({ message: "Order Not Found" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error deleting order" });
    }
});
exports.deleteOrder = deleteOrder;
const deliverOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = new Date();
            yield order.save();
            res.send({ message: "Order Delivered" });
        }
        else {
            res.status(404).send({ message: "Order Not Found" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error delivering order" });
    }
});
exports.deliverOrder = deliverOrder;
