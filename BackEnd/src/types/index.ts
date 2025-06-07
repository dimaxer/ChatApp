import { Request } from 'express';
import { RegisterRequestBody, LoginRequestBody } from './requests';

/**
 * Type Definitions
 * Core TypeScript interfaces and types for the application
 * Includes user, authentication, and environment configurations
 * @module types
 */

/**
 * User model interface
 * @property {string} _id - MongoDB document ID
 * @property {string} username - Unique username
 * @property {string} email - Unique email address
 * @property {string} password - Hashed password
 * @property {'user' | 'admin'} role - User role
 * @property {boolean} isActive - Account status
 * @property {Date | null} lastLogin - Last login timestamp
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Extended Express Request interface with authentication
 * @property {User} [user] - Authenticated user object
 * @property {RegisterRequestBody | LoginRequestBody} body - Request body
 */
interface AuthRequest extends Request {
    user?: User;
    body: RegisterRequestBody | LoginRequestBody;
}

/**
 * JWT token payload interface
 * @property {string} userId - User ID from database
 * @property {number} iat - Issued at timestamp
 * @property {number} exp - Expiration timestamp
 */
interface TokenPayload {
    userId: string;
    iat: number;
    exp: number;
}

/**
 * Environment configuration interface
 * @property {string} MONGODB_URI - MongoDB connection string
 * @property {string} PORT - Server port number
 * @property {string} JWT_SECRET - JWT signing secret
 * @property {'development' | 'production' | 'test'} NODE_ENV - Environment mode
 */
interface Environment {
    MONGODB_URI: string;
    PORT: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
}


export type { 
    User, 
    AuthRequest, 
    TokenPayload, 
    Environment,
    RegisterRequestBody,
    LoginRequestBody 
};

