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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../src/models/User"));
const userController_1 = require("../../src/controllers/userController");
const utils_1 = require("../../src/utils");
jest.mock("../../src/models/User");
jest.mock("../../src/utils");
describe("User Controller", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });
    describe("signinUser", () => {
        it("should sign in user with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: "test@example.com", password: "password" };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: bcryptjs_1.default.hashSync("password", 8),
                isAdmin: false,
            };
            User_1.default.findOne.mockResolvedValue(user);
            utils_1.generateToken.mockReturnValue("token");
            yield (0, userController_1.signinUser)(req, res);
            expect(User_1.default.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(res.json).toHaveBeenCalledWith({
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                token: "token",
            });
        }));
        it("should return 401 for invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: "test@example.com", password: "wrongpassword" };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: bcryptjs_1.default.hashSync("password", 8),
                isAdmin: false,
            };
            User_1.default.findOne.mockResolvedValue(user);
            yield (0, userController_1.signinUser)(req, res);
            expect(User_1.default.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid email or password",
            });
        }));
    });
    describe("signupUser", () => {
        it("should sign up a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                name: "Test User",
                email: "test@example.com",
                password: "password",
            };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: bcryptjs_1.default.hashSync("password", 8),
                isAdmin: false,
            };
            User_1.default.create.mockResolvedValue(user);
            utils_1.generateToken.mockReturnValue("token");
            yield (0, userController_1.signupUser)(req, res);
            expect(User_1.default.create).toHaveBeenCalledWith({
                name: "Test User",
                email: "test@example.com",
                password: expect.any(String),
            });
            expect(res.json).toHaveBeenCalledWith({
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                token: "token",
            });
        }));
    });
    describe("updateUserProfile", () => {
        it("should update user profile", () => __awaiter(void 0, void 0, void 0, function* () {
            // Ensure req.user has all required properties
            req.user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                token: "some-token",
            };
            req.body = {
                name: "Updated User",
                email: "updated@example.com",
                password: "newpassword",
            };
            // Create a mock user object
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: bcryptjs_1.default.hashSync("password", 8),
                isAdmin: false,
                save: jest.fn().mockResolvedValue({
                    _id: "1",
                    name: "Updated User",
                    email: "updated@example.com",
                    isAdmin: false,
                }),
            };
            // Mock User.findById and generateToken
            User_1.default.findById.mockResolvedValue(user);
            utils_1.generateToken.mockReturnValue("token");
            yield (0, userController_1.updateUserProfile)(req, res);
            // Ensure User.findById is called with req.user._id
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            // Ensure user.save is called
            expect(user.save).toHaveBeenCalled();
            // Ensure the response contains the updated user profile
            expect(res.json).toHaveBeenCalledWith({
                _id: "1",
                name: "Updated User",
                email: "updated@example.com",
                isAdmin: false,
                token: "token",
            });
        }));
        it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            req.user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                token: "some-token",
            };
            // Return null from User.findById
            User_1.default.findById.mockResolvedValue(null);
            yield (0, userController_1.updateUserProfile)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            req.user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                token: "some-token",
            };
            const error = new Error("Server error");
            // Simulate error from User.findById
            User_1.default.findById.mockRejectedValue(error);
            yield (0, userController_1.updateUserProfile)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        }));
    });
    describe("getUsers", () => {
        it("should get all users", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = [
                {
                    _id: "1",
                    name: "Test User",
                    email: "test@example.com",
                    isAdmin: false,
                },
            ];
            User_1.default.find.mockResolvedValue(users);
            yield (0, userController_1.getUsers)(req, res);
            expect(User_1.default.find).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith(users);
        }));
    });
    describe("getUserById", () => {
        it("should get user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
            };
            User_1.default.findById.mockResolvedValue(user);
            yield (0, userController_1.getUserById)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith(user);
        }));
        it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            User_1.default.findById.mockResolvedValue(null);
            yield (0, userController_1.getUserById)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
        }));
    });
    describe("updateUser", () => {
        it("should update a user", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            req.body = {
                name: "Updated User",
                email: "updated@example.com",
                isAdmin: true,
            };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
                save: jest.fn().mockResolvedValue({
                    _id: "1",
                    name: "Updated User",
                    email: "updated@example.com",
                    isAdmin: true,
                }),
            };
            User_1.default.findById.mockResolvedValue(user);
            yield (0, userController_1.updateUser)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(user.save).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({
                message: "User Updated",
                user: {
                    _id: "1",
                    name: "Updated User",
                    email: "updated@example.com",
                    isAdmin: true,
                },
            });
        }));
        it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            User_1.default.findById.mockResolvedValue(null);
            yield (0, userController_1.updateUser)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
        }));
    });
    describe("deleteUser", () => {
        it("should delete a user and return success message", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            const user = {
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                isAdmin: false,
            };
            User_1.default.findById.mockResolvedValue(user);
            User_1.default.deleteOne.mockResolvedValue({});
            yield (0, userController_1.deleteUser)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(User_1.default.deleteOne).toHaveBeenCalledWith({ _id: "1" });
            expect(res.send).toHaveBeenCalledWith({ message: "User Deleted" });
        }));
        it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            User_1.default.findById.mockResolvedValue(null);
            yield (0, userController_1.deleteUser)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
        }));
        it("should return 400 if trying to delete an admin user", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            const user = {
                _id: "1",
                name: "Admin User",
                email: "admin@example.com",
                isAdmin: true,
            };
            User_1.default.findById.mockResolvedValue(user);
            yield (0, userController_1.deleteUser)(req, res);
            expect(User_1.default.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Cannot Delete Admin User",
            });
        }));
    });
});
