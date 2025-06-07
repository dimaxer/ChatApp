/**
 * Authentication Routes
 * Defines API endpoints for authentication operations
 * Includes public routes for login/register and protected routes for user data
 * @module routes/auth
 */

import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { HttpStatusCode } from '../constants/httpStatusCodes';

const router = Router();

/**
 * Health check endpoint handler
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns {Response} Success response with status message
 */
function handleHealthCheck(
    _req: AuthRequest, 
    res: Response
): Response {
    return res.status(HttpStatusCode.OK).json({ 
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
function handleProtectedRoute(
    req: AuthRequest, 
    res: Response
): Response {
    return res.status(HttpStatusCode.OK).json({
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
router.get('/profile', protect, handleProtectedRoute);
router.get('/test-auth', protect, handleProtectedRoute);

export { router as authRouter };
