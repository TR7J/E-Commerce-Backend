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
exports.getRecommendations = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const isValidObjectId = (id) => {
    return mongoose_1.Types.ObjectId.isValid(id) && new mongoose_1.Types.ObjectId(id).toString() === id;
};
const getRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId).populate("interactions.productId");
    if (!user) {
        throw new Error("User not found");
    }
    // Collect products interacted by the user
    const interactedProducts = user.interactions
        .map((interaction) => interaction.productId.toString())
        .filter(isValidObjectId); // Ensure only valid ObjectId strings
    // Find other users with similar interactions
    const similarUsers = yield User_1.default.find({
        "interactions.productId": {
            $in: interactedProducts.map((id) => new mongoose_1.Types.ObjectId(id)),
        },
        _id: { $ne: userId },
    }).populate("interactions.productId");
    // Aggregate recommended products from similar users
    const recommendedProducts = {};
    similarUsers.forEach((similarUser) => {
        similarUser.interactions.forEach((interaction) => {
            const productIdStr = interaction.productId.toString();
            if (isValidObjectId(productIdStr) &&
                !interactedProducts.includes(productIdStr)) {
                recommendedProducts[productIdStr] =
                    (recommendedProducts[productIdStr] || 0) + 1;
            }
        });
    });
    // Sort recommended products by frequency
    const sortedRecommendations = Object.keys(recommendedProducts).sort((a, b) => recommendedProducts[b] - recommendedProducts[a]);
    // Fetch product details
    const products = yield Product_1.default.find({
        _id: {
            $in: sortedRecommendations
                .filter(isValidObjectId)
                .map((id) => new mongoose_1.Types.ObjectId(id)),
        },
    });
    return products;
});
exports.getRecommendations = getRecommendations;
