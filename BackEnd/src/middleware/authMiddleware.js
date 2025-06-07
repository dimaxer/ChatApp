"use strict";
/**
 * Authentication Middleware
 * Provides route protection and role-based access control
 * Handles JWT token verification and user authentication
 * @module middleware/auth
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
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
/**
 * Verifies a JWT token
 * @param token - JWT token to verify
 * @param secret - Secret key for verification
 * @returns {TokenPayload | null} Decoded token payload or null if invalid
 */
function verifyToken(token, secret) {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (_a) {
        return null;
    }
}
/**
 * Extracts JWT token from Authorization header
 * @param authHeader - Authorization header string
 * @returns {string | null} Token if found and valid format, null otherwise
 */
function extractToken(authHeader) {
    return (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer'))
        ? authHeader.split(' ')[1]
        : null;
}
/**
 * Finds a user by their ID
 * @param userId - User ID to search for
 * @returns {Promise<User | null>} User object if found, null otherwise
 */
function findUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.UserModel.findById(userId);
    });
}
/**
 * Middleware to protect routes that require authentication
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Promise resolving to Response or void
 */
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = extractToken(req.headers.authorization);
        if (!token) {
            return res.status(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.',
            });
        }
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'Invalid token. Please log in again.',
            });
        }
        const user = yield findUserById(decoded.userId);
        if (!user) {
            return res.status(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.',
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(httpStatusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'An error occurred while authenticating.',
        });
    }
});
exports.protect = protect;
/**
 * Middleware to restrict route access based on user roles
 * @param roles - Array of roles allowed to access the route
 * @returns {Function} Express middleware function
 * @example
 * // Restrict route to admin users only
 * router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);
 *
 * // Allow multiple roles
 * router.patch('/posts/:id', protect, restrictTo('admin', 'moderator'), updatePost);
 */
const restrictTo = (...roles) => (req, res, next) => {
    var _a;
    return !roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || '')
        ? res.status(httpStatusCodes_1.HttpStatusCode.FORBIDDEN).json({
            status: 'fail',
            message: 'You do not have permission to perform this action',
        })
        : next();
};
exports.restrictTo = restrictTo;
