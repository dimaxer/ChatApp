/**
 * Authentication Middleware
 * Provides route protection and role-based access control
 * Handles JWT token verification and user authentication
 * @module middleware/auth
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, AuthRequest, TokenPayload } from '../types';
import { UserModel } from '../models/user';
import { HttpStatusCode } from '../constants/httpStatusCodes';

/**
 * Verifies a JWT token
 * @param token - JWT token to verify
 * @param secret - Secret key for verification
 * @returns {TokenPayload | null} Decoded token payload or null if invalid
 */
function verifyToken(token: string, secret: string): TokenPayload | null {
    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Extracts JWT token from Authorization header
 * @param authHeader - Authorization header string
 * @returns {string | null} Token if found and valid format, null otherwise
 */
function extractToken(authHeader?: string): string | null {
    return authHeader?.startsWith('Bearer') 
        ? authHeader.split(' ')[1] 
        : null;
}

/**
 * Finds a user by their ID
 * @param userId - User ID to search for
 * @returns {Promise<User | null>} User object if found, null otherwise
 */
async function findUserById(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
}

/**
 * Middleware to protect routes that require authentication
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Promise resolving to Response or void
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.',
            });
        }

        const decoded = verifyToken(token, process.env.JWT_SECRET as string);
        if (!decoded) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'Invalid token. Please log in again.',
            });
        }

        const user = await findUserById(decoded.userId);
        if (!user) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'An error occurred while authenticating.',
        });
    }
};

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
export const restrictTo = (...roles: string[]) => (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Response | void => 
    !roles.includes(req.user?.role || '') 
        ? res.status(HttpStatusCode.FORBIDDEN).json({
            status: 'fail',
            message: 'You do not have permission to perform this action',
        })
        : next();
