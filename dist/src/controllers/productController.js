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
exports.addReviewController = exports.searchProducts = exports.getProductBySlug = exports.getCategories = exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAdminProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const recordUserActivity_1 = require("./recordUserActivity");
// admin abilities
const getAdminProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        const countProducts = yield Product_1.default.countDocuments();
        res.send({
            products,
            countProducts,
        });
    }
    catch (error) {
        res.status(500).send({ message: "Error fetching products", error });
    }
});
exports.getAdminProducts = getAdminProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield Product_1.default.findById(productId);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching product",
            error: error.message,
        });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = new Product_1.default({
            name: "sample name " + Date.now(),
            slug: "sample-name-" + Date.now(),
            image: "/images/p1.jpg",
            price: 2000,
            category: "sample category",
            brand: "sample brand",
            countInStock: 0,
            rating: 0,
            numberOfReviews: 0,
            description: "sample description",
        });
        const product = yield newProduct.save();
        res.status(201).send({ message: "Product Created", product });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating product", error });
    }
});
exports.createProduct = createProduct;
// Update Product Controller
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        const product = yield Product_1.default.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.price = req.body.price;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            yield product.save();
            res.send({ message: "Product Updated" });
        }
        else {
            res.status(404).send({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error updating product", error: error });
    }
});
exports.updateProduct = updateProduct;
// Delete Product Controller
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        const result = yield Product_1.default.findByIdAndDelete(productId);
        if (result) {
            res.send({ message: "Product Deleted" });
        }
        else {
            res.status(404).send({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error deleting product", error: error });
    }
});
exports.deleteProduct = deleteProduct;
// user abilities/ also admin
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Product_1.default.find().distinct("category");
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategories = getCategories;
const getProductBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const product = yield Product_1.default.findOne({ slug: req.params.slug });
        if (product) {
            // Record the view interaction
            yield (0, recordUserActivity_1.recordInteraction)(userId, product === null || product === void 0 ? void 0 : product._id.toString(), "view");
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Product Not Found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getProductBySlug = getProductBySlug;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query || "";
    const category = req.query.category || "";
    //
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    //
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const queryFilter = query ? { name: { $regex: query, $options: "i" } } : {};
    const categoryFilter = category ? { category } : {};
    //
    const priceFilter = {};
    // Add price filter if minPrice or maxPrice is provided
    if (minPrice !== undefined || maxPrice !== undefined) {
        if (minPrice !== undefined) {
            priceFilter.$gte = minPrice; // Greater than or equal to minPrice
        }
        if (maxPrice !== undefined) {
            priceFilter.$lte = maxPrice; // Less than or equal to maxPrice
        }
    }
    // Combine filters
    const filters = Object.assign(Object.assign(Object.assign({}, queryFilter), categoryFilter), (Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}));
    try {
        const products = yield Product_1.default.find(filters);
        res.send(products);
    }
    catch (error) {
        res.status(500).send({ message: "Error in fetching products" });
    }
});
exports.searchProducts = searchProducts;
//  Add a review to a product
const addReviewController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const productId = req.params.id;
        // Record the rating interaction
        yield (0, recordUserActivity_1.recordInteraction)(userId, productId, "rating");
        // Record the review interaction
        yield (0, recordUserActivity_1.recordInteraction)(userId, productId, "review");
        const product = yield Product_1.default.findById(productId);
        if (product) {
            if (product.reviews.find((x) => x.name === req.user.name)) {
                return res
                    .status(400)
                    .send({ message: "You already submitted a review" });
            }
            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numberOfReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                    product.reviews.length;
            const updatedProduct = yield product.save();
            res.status(201).send({
                message: "Review Created",
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
                numReviews: product.numberOfReviews,
                rating: product.rating,
            });
        }
        else {
            res.status(404).send({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error adding review", error });
    }
});
exports.addReviewController = addReviewController;
