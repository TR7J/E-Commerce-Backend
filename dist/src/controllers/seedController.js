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
exports.seedDatabase = void 0;
const data_1 = require("../data");
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const seedDatabase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Product_1.default.deleteMany({});
        const createdProducts = yield Product_1.default.insertMany(data_1.sampleProducts);
        yield User_1.default.deleteMany({});
        const createdUsers = yield User_1.default.insertMany(data_1.sampleUsers);
        res.json({ createdProducts, createdUsers });
    }
    catch (error) {
        next(error);
    }
});
exports.seedDatabase = seedDatabase;
