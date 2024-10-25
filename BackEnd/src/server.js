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

// Add mongoose connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 8080;

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
