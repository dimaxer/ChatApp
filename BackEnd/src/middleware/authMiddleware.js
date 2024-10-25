const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const HttpStatusCode = require('../constants/httpStatusCodes');

/**
 * Middleware to protect routes that require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.protect = async (req, res, next) => 
{
    try 
    {
        let token;
        // Check if token is provided in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
        {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) 
        {
            // If no token is provided, return an error
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user still exists
        const user = await User.findById(decoded.id);

        if (!user) 
        {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.',
            });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } 
    catch (error) 
    {
        // Handle invalid tokens
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            status: 'fail',
            message: 'Invalid token. Please log in again.',
        });
    }
};
