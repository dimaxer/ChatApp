/**
 * Authentication Controller
 * Handles user registration, login, and token generation
 * Implements password hashing and user creation in database
 * @module controllers/auth
 */

import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { 
    AuthRequest, 
    User, 
    RegisterRequestBody, 
    LoginRequestBody 
} from '../types';
import { HttpStatusCode } from '../constants/httpStatusCodes';

const SALT_ROUNDS = 10;

/**
 * Generates a JWT token for user authentication
 * @param userId - The unique identifier of the user
 * @returns {string} A signed JWT token
 * @throws {Error} If JWT_SECRET is not configured
 */
function generateToken(userId: string): string {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1h' }
    );
}

/**
 * Hashes a password using bcrypt
 * @param password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Creates a new user in the database
 * @param userData - User registration data
 * @returns {Promise<User>} Created user object
 * @throws {Error} If user creation fails
 */
async function createUser(userData: RegisterRequestBody): Promise<User> {
    const user = new UserModel(userData);
    return await user.save();
}

/**
 * Finds a user by their email address
 * @param email - Email address to search for
 * @returns {Promise<User | null>} User object if found, null otherwise
 */
async function findUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
}

/**
 * Verifies a password against its hashed version
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
async function verifyPassword(
    password: string, 
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Registers a new user in the system
 * @param req - Express request object with RegisterRequestBody
 * @param res - Express response object
 * @returns Promise resolving to Response with user data or error
 */
export async function register(
    req: AuthRequest & { body: RegisterRequestBody },
    res: Response
): Promise<Response> {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        
        const user = await createUser({ 
            username, 
            email, 
            password: hashedPassword 
        });

        return res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
            status: 'error',
            message: 'Error creating user' 
        });
    }
}

export async function login(
    req: AuthRequest & { body: LoginRequestBody },
    res: Response
): Promise<Response> {
    try {
        const { email, password } = req.body;
        
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                status: 'error',
                message: 'Server configuration error' 
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        const token = generateToken(user._id);
        
        return res.status(HttpStatusCode.OK).json({ 
            status: 'success',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
            status: 'error',
            message: 'An error occurred during login' 
        });
    }
}
