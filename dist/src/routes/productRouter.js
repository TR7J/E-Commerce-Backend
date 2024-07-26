"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const AdminMiddleware_1 = require("../middleware/AdminMiddleware");
const ValidatorsMiddleware_1 = require("../middleware/ValidatorsMiddleware");
const productValidator_1 = require("../validators/productValidator");
exports.productRouter = express_1.default.Router();
// /api/products
exports.productRouter.get("/", productController_1.getProducts);
// /api/products/categories
exports.productRouter.get("/categories", productController_1.getCategories);
// /api/products/slug/:slug
exports.productRouter.get("/slug/:slug", productController_1.getProductBySlug);
// search products route
exports.productRouter.get("/search", productController_1.searchProducts);
// add a review
exports.productRouter.post("/:id/reviews", AuthMiddleware_1.AuthMiddleware, productController_1.addReviewController);
// get products route
exports.productRouter.get("/admin", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, productController_1.getAdminProducts);
exports.productRouter.get("/:id", productController_1.getProductById);
// Post product route
exports.productRouter.post("/", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, (0, ValidatorsMiddleware_1.validateInput)(productValidator_1.createProductSchema), productController_1.createProduct);
// Update product route
exports.productRouter.put("/:id", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, (0, ValidatorsMiddleware_1.validateInput)(productValidator_1.updateProductSchema), productController_1.updateProduct);
// Delete product route
exports.productRouter.delete("/:id", AuthMiddleware_1.AuthMiddleware, AdminMiddleware_1.AdminMiddleware, productController_1.deleteProduct);
exports.default = exports.productRouter;
