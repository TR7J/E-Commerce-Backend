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
const Product_1 = __importDefault(require("../../src/models/Product"));
const productController = __importStar(require("../../src/controllers/productController"));
const recordUserActivity_1 = require("../../src/controllers/recordUserActivity");
jest.mock("../../src/models/Product");
jest.mock("../../src/controllers/recordUserActivity");
describe("Product Controller Unit Tests", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    test("getAdminProducts should return all products and count", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            send: jest.fn(),
        };
        Product_1.default.find.mockResolvedValue([{ name: "Product1" }]);
        Product_1.default.countDocuments.mockResolvedValue(1);
        yield productController.getAdminProducts(req, res);
        expect(res.send).toHaveBeenCalledWith({
            products: [{ name: "Product1" }],
            countProducts: 1,
        });
    }));
    test("getProductById should return product by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { id: "1" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        Product_1.default.findById.mockResolvedValue({ name: "Product1" });
        yield productController.getProductById(req, res);
        expect(res.json).toHaveBeenCalledWith({ name: "Product1" });
    }));
    test("createProduct should create a new product", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const newProduct = new Product_1.default({
            name: "sample name",
            slug: "sample-name",
            image: "/images/p1.jpg",
            price: 2000,
            category: "sample category",
            brand: "sample brand",
            countInStock: 0,
            rating: 0,
            numberOfReviews: 0,
            description: "sample description",
        });
        Product_1.default.prototype.save.mockResolvedValue(newProduct);
        yield productController.createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            message: "Product Created",
            product: newProduct,
        });
    }));
    test("updateProduct should update an existing product", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            params: { id: "1" },
            body: { name: "Updated Product" },
        };
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        Product_1.default.findById.mockResolvedValue({
            name: "Old Product",
            save: jest.fn().mockResolvedValue({ name: "Updated Product" }),
        });
        yield productController.updateProduct(req, res);
        expect(res.send).toHaveBeenCalledWith({ message: "Product Updated" });
    }));
    test("deleteProduct should delete an existing product", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { id: "1" } };
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        Product_1.default.findByIdAndDelete.mockResolvedValue({
            name: "Product to delete",
        });
        yield productController.deleteProduct(req, res);
        expect(res.send).toHaveBeenCalledWith({ message: "Product Deleted" });
    }));
    test("searchProducts should return filtered products", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            query: { query: "Product", minPrice: "10", maxPrice: "100" },
        };
        const res = {
            send: jest.fn(),
        };
        Product_1.default.find.mockResolvedValue([
            { name: "Filtered Product" },
        ]);
        yield productController.searchProducts(req, res);
        expect(res.send).toHaveBeenCalledWith([{ name: "Filtered Product" }]);
    }));
    test("addReviewController should add a review to a product", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            params: { id: "1" },
            user: { _id: "user1", name: "User1" },
            body: { rating: 5, comment: "Great product!" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        recordUserActivity_1.recordInteraction.mockResolvedValue(null);
        Product_1.default.findById.mockResolvedValue({
            reviews: [],
            numberOfReviews: 0,
            rating: 0,
            save: jest.fn().mockResolvedValue({
                reviews: [
                    {
                        name: "User1",
                        rating: 5,
                        comment: "Great product!",
                    },
                ],
                numberOfReviews: 1,
                rating: 5,
            }),
        });
        yield productController.addReviewController(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            message: "Review Created",
            review: {
                name: "User1",
                rating: 5,
                comment: "Great product!",
            },
            numReviews: 1,
            rating: 5,
        });
    }));
});
