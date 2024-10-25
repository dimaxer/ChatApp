require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth'); // Make sure this path is correct
const cors = require('cors');

// Debug logging
console.log('Current working directory:', process.cwd());
console.log('Attempting to load .env file...');
console.log('Environment variables loaded:', {
    mongoDbExists: !!process.env.MONGODB_URI,
    portExists: !!process.env.PORT,
    mongoDbUri: process.env.MONGODB_URI?.substring(0, 20) + '...',
    envPath: path.resolve(process.cwd(), '.env')
});

// Add after your existing environment variable logging
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured. Authentication will fail.');
    process.exit(1);
}

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*', // During development, allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: "ChatApp Backend is running!" });
});

// Auth routes
console.log('Setting up /auth routes');
app.use('/auth', authRoutes);

// Test POST route
app.post('/test', (req, res) => {
  console.log('Test POST route hit');
  console.log('Request body:', req.body);
  res.json({ message: "Test POST route working" });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});


console.log('MongoDB URI:', process.env.MONGODB_URI ? 'exists' : 'undefined');

// Only connect to MongoDB and start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            const PORT = process.env.PORT || 8080;
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
                console.log('Environment:', process.env.NODE_ENV || 'development');
            });
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = app;
