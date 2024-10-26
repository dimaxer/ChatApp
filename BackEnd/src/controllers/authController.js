/**
 * Authentication Controller
 * Handles user authentication operations including registration and login
 * @module AuthController
 */

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpStatusCode = require('../constants/httpStatusCodes');

/**
 * Register a new user
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user details
 * @param {string} req.body.username - User's username
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        console.log('User registered:', user);
        res.status(HttpStatusCode.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user' });
    }
};

/**
 * Login an existing user
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                     .json({ message: 'Server configuration error' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(HttpStatusCode.UNAUTHORIZED)
                     .json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(HttpStatusCode.UNAUTHORIZED)
                     .json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(HttpStatusCode.OK).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
           .json({ message: 'Server error' });
    }
};
