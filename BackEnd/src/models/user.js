"use strict";
/**
 * User Model Definition
 * Mongoose schema and model for user data
 * Includes validation rules, indexes, and JSON transformation
 * @module models/user
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
/**
 * Mongoose schema for User model
 * Defines user document structure and validation rules
 * @property {string} username - Unique username (3-30 characters)
 * @property {string} email - Unique email address
 * @property {string} password - Hashed password
 * @property {string} role - User role (user/admin)
 * @property {boolean} isActive - Account status
 * @property {Date} lastLogin - Last login timestamp
 */
const userSchema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.SchemaTypes.String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: mongoose_1.SchemaTypes.String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: mongoose_1.SchemaTypes.String,
        required: [true, 'Password is required'],
    },
    role: {
        type: mongoose_1.SchemaTypes.String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: mongoose_1.SchemaTypes.Boolean,
        default: true
    },
    lastLogin: {
        type: mongoose_1.SchemaTypes.Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes for performance
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
