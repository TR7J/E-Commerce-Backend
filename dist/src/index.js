"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRouter_1 = require("./routes/productRouter");
const seedRouter_1 = require("./routes/seedRouter");
const userRouter_1 = require("./routes/userRouter");
const orderRouter_1 = require("./routes/orderRouter");
const keyRouter_1 = require("./routes/keyRouter");
const uploadRouter_1 = __importDefault(require("./routes/uploadRouter"));
// fetching env variables
dotenv_1.default.config();
// initialize our app
const app = (0, express_1.default)();
exports.app = app;
// setting up cors middleware
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["https://e-commerce-front-uops.onrender.com"],
}));
// middleware for parsing json data
app.use(express_1.default.json());
// middleware for parsing url encoded data
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
// middleware for our routes
app.use("/api/products", productRouter_1.productRouter);
app.use("/api/users", userRouter_1.userRouter);
app.use("/api/orders", orderRouter_1.orderRouter);
app.use("/api/upload", uploadRouter_1.default);
app.use("/api/seed", seedRouter_1.seedRouter);
app.use("/api/key", keyRouter_1.keyRouter);
const PORT = 8000;
// get
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running properly" });
});
//connecting to mongoDb
mongoose_1.default
    .connect(process.env.DATABASE_URI)
    .then(() => {
    console.log("connected to database");
})
    .catch(() => {
    console.log("error while connecting to mongoDB");
});
// starting our server
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
exports.server = server;
