/**
 * Main server application file
 * Configures and starts the Express server with all middleware and routes
 * @module Server
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const HttpStatusCode = require('./constants/httpStatusCodes');

// Debug logging
console.log('Current working directory:', process.cwd());
console.log('Attempting to load .env file...');
console.log('Environment variables loaded:', {
    mongoDbExists: !!process.env.MONGODB_URI,
    portExists: !!process.env.PORT,
    mongoDbUri: process.env.MONGODB_URI?.substring(0, 20) + '...',
    envPath: path.resolve(process.cwd(), '.env')
});

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured. Authentication will fail.');
    process.exit(1);
}

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.status(HttpStatusCode.OK).json({ message: "ChatApp Backend is running!" });
});

app.use('/auth', authRoutes);

app.post('/test', (req, res) => {
    console.log('Test POST route hit');
    console.log('Request body:', req.body);
    res.status(HttpStatusCode.OK).json({ message: "Test POST route working" });
});

// 404 handler
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.url}`);
    res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Route not found' });
});

// Database connection and server startup
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
