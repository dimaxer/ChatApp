const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Make sure this path is correct
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

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
  res.json({ message: "Server is running" });
  res.send('ChatApp Backend is running!');
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
app.listen(PORT, '0.0.0.0', () => 
{
    console.log(`Server is running on port ${PORT}`);
});
