/**
 * Authentication Middleware
 * Provides middleware functions for authentication and authorization
 * @module AuthMiddleware
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpStatusCode = require('../constants/httpStatusCodes');

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Extract token from Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user still exists
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    status: 'fail',
                    message: 'The user belonging to this token no longer exists.'
                });
            }

            // Attach user to request object
            req.user = user;
            next();
            
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'Invalid token. Please log in again.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'An error occurred while authenticating.'
        });
    }
};

/**
 * Middleware to restrict access to specific user roles
 * 
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} Express middleware function
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(HttpStatusCode.FORBIDDEN).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
