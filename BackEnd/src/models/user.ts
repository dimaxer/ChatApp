/**
 * User Model Definition
 * Mongoose schema and model for user data
 * Includes validation rules, indexes, and JSON transformation
 * @module models/user
 */

import { Schema, model, SchemaTypes } from 'mongoose';
import { User } from '../types';

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
const userSchema = new Schema<User>({
    username: {
        type: SchemaTypes.String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: SchemaTypes.String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: SchemaTypes.String,
        required: [true, 'Password is required'],
    },
    role: {
        type: SchemaTypes.String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: SchemaTypes.Boolean,
        default: true
    },
    lastLogin: {
        type: SchemaTypes.Date,
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


export const UserModel = model<User>('User', userSchema);
