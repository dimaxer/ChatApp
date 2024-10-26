/**
 * Authentication Routes
 * Defines all authentication-related routes for the application
 * @module AuthRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const HttpStatusCode = require('../constants/httpStatusCodes');

console.log('Setting up auth routes');

/**
 * Test route to verify auth routing is working
 * @route GET /auth
 */
router.get('/', (req, res) => {
    console.log('GET /auth/ route hit');
    res.status(HttpStatusCode.OK).json({ message: "Auth route is working" });
});

/**
 * Register a new user
 * @route POST /auth/register
 * @body {string} username - The user's username
 * @body {string} email - The user's email
 * @body {string} password - The user's password
 */
router.post('/register', authController.register);

/**
 * Login an existing user
 * @route POST /auth/login
 * @body {string} email - The user's email
 * @body {string} password - The user's password
 */
router.post('/login', authController.login);

module.exports = router;
