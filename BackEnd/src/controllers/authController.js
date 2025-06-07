"use strict";
/**
 * Authentication Controller
 * Handles user registration, login, and token generation
 * Implements password hashing and user creation in database
 * @module controllers/auth
 */
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
exports.register = register;
exports.login = login;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const SALT_ROUNDS = 10;
/**
 * Generates a JWT token for user authentication
 * @param userId - The unique identifier of the user
 * @returns {string} A signed JWT token
 * @throws {Error} If JWT_SECRET is not configured
 */
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
/**
 * Hashes a password using bcrypt
 * @param password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    });
}
/**
 * Creates a new user in the database
 * @param userData - User registration data
 * @returns {Promise<User>} Created user object
 * @throws {Error} If user creation fails
 */
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new user_1.UserModel(userData);
        return yield user.save();
    });
}
/**
 * Finds a user by their email address
 * @param email - Email address to search for
 * @returns {Promise<User | null>} User object if found, null otherwise
 */
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.UserModel.findOne({ email });
    });
}
/**
 * Verifies a password against its hashed version
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
/**
 * Registers a new user in the system
 * @param req - Express request object with RegisterRequestBody
 * @param res - Express response object
 * @returns Promise resolving to Response with user data or error
 */
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = yield hashPassword(password);
            const user = yield createUser({
                username,
                email,
                password: hashedPassword
            });
            return res.status(httpStatusCodes_1.HttpStatusCode.CREATED).json({
                status: 'success',
                message: 'User created successfully',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                }
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            return res.status(httpStatusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Error creating user'
            });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not configured');
                return res.status(httpStatusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: 'Server configuration error'
                });
            }
            const user = yield findUserByEmail(email);
            if (!user) {
                return res.status(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
            const isPasswordValid = yield verifyPassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
            const token = generateToken(user._id);
            return res.status(httpStatusCodes_1.HttpStatusCode.OK).json({
                status: 'success',
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            return res.status(httpStatusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'An error occurred during login'
            });
        }
    });
}
