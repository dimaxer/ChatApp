const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('Setting up auth routes');

// Test route to check if auth routes are working
router.get('/', (req, res) => {
    console.log('GET /auth/ route hit');
    res.json({ message: "Auth route is working" });
});

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

module.exports = router;
