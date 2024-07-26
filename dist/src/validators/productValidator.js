"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductSchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    name: joi_1.default.string().optional(),
    slug: joi_1.default.string().optional(),
    image: joi_1.default.string().optional(),
    price: joi_1.default.number().greater(0).optional().messages({
        "number.greater": "Price must be a positive number",
        "any.optional": "Price is optional",
    }),
    category: joi_1.default.string().optional(),
    brand: joi_1.default.string().optional(),
    countInStock: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
});
exports.updateProductSchema = joi_1.default.object({
    _id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    slug: joi_1.default.string().required(),
    image: joi_1.default.string().required(),
    price: joi_1.default.number().greater(0).required().messages({
        "number.greater": "Price must be a positive number",
    }),
    category: joi_1.default.string().required(),
    brand: joi_1.default.string().required(),
    countInStock: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
});
