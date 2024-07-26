"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleUsers = exports.sampleProducts = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.sampleProducts = [
    {
        name: "Nike Slim shirt",
        slug: "nike-slim-shirt",
        category: "Shirts",
        image: "../images/car-engine-cylinder-gasket.jpg",
        price: 120,
        countInStock: 10,
        brand: "Nike",
        rating: 4.5,
        numberOfReviews: 10,
        description: "high quality shirt",
    },
    {
        name: "Adidas Fit Shirt",
        slug: "adidas-fit-shirt",
        category: "Shirts",
        image: "../images/car-radiators.jpeg",
        price: 100,
        countInStock: 20,
        brand: "Adidas",
        rating: 4.0,
        numberOfReviews: 10,
        description: "high quality product",
    },
    {
        name: "Lacoste Free Pants",
        slug: "lacoste-free-pants",
        category: "Pants",
        image: "../images/clutch_kit.jpg",
        price: 220,
        countInStock: 0,
        brand: "Lacoste",
        rating: 4.8,
        numberOfReviews: 17,
        description: "high quality product",
    },
    {
        name: "Nike Slim Pant",
        slug: "nike-slim-pant",
        category: "Pants",
        image: "../images/spark-plugs.jpg",
        price: 78,
        countInStock: 15,
        brand: "Nike",
        rating: 4.5,
        numberOfReviews: 14,
        description: "high quality product",
    },
];
exports.sampleUsers = [
    {
        name: "Joe",
        email: "admin@example.com",
        password: bcryptjs_1.default.hashSync("123456"),
        isAdmin: true,
    },
    {
        name: "John",
        email: "user@example.com",
        password: bcryptjs_1.default.hashSync("123456"),
        isAdmin: false,
    },
];
/* "scripts": {
  "dev": "ts-node-dev --respawn --transpile-only --files src/index.ts",
  "build": "tsc",
  "test": "jest",
  "start": "node build/index.js"
}, */
