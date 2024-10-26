/**
 * User Model
 * Defines the schema and model for user data in MongoDB
 * @module UserModel
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} username - Unique username for the user
 * @property {string} email - Unique email address for the user
 * @property {string} password - Hashed password for the user
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
