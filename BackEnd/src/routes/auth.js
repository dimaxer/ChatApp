"use strict";
/**
 * Authentication Routes
 * Defines API endpoints for authentication operations
 * Includes public routes for login/register and protected routes for user data
 * @module routes/auth
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController = __importStar(require("../controllers/authController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const router = (0, express_1.Router)();
exports.authRouter = router;
/**
 * Health check endpoint handler
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns {Response} Success response with status message
 */
function handleHealthCheck(_req, res) {
    return res.status(httpStatusCodes_1.HttpStatusCode.OK).json({
        status: 'success',
        message: 'Auth route is working'
    });
}
/**
 * Protected route handler for authenticated users
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns {Response} Success response with user data
 */
function handleProtectedRoute(req, res) {
    return res.status(httpStatusCodes_1.HttpStatusCode.OK).json({
        status: 'success',
        message: 'You are authenticated!',
        data: {
            user: req.user
        }
    });
}
// Public routes
router.get('/', handleHealthCheck);
router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected routes
router.get('/profile', authMiddleware_1.protect, handleProtectedRoute);
router.get('/test-auth', authMiddleware_1.protect, handleProtectedRoute);
