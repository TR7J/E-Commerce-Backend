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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../src/index");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../../src/utils");
const User_1 = __importDefault(require("../../src/models/User"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose_1.default.connection.readyState === 0) {
        yield mongoose_1.default.connect(uri, {});
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    if (mongoServer) {
        yield mongoServer.stop();
    }
    if (index_1.server) {
        index_1.server.close(() => console.log("Server closed"));
    }
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.connection.dropDatabase();
    }
}));
it("should get the current user information", () => __awaiter(void 0, void 0, void 0, function* () {
    const password = "password";
    const hashedPassword = bcryptjs_1.default.hashSync(password, 8);
    const user = new User_1.default({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
    });
    yield user.save();
    // Create the token with the user object
    const token = (0, utils_1.generateToken)(user);
    console.log("Generated token:", token);
    const response = yield (0, supertest_1.default)(index_1.app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send();
    console.log("Response:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "test@example.com");
}), 10000);
