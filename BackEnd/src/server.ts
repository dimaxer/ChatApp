/**
 * Express server configuration and initialization
 * Sets up middleware, routes, and database connection
 * Handles environment validation and server startup
 * @module server
 */

import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { HttpStatusCode } from './constants/httpStatusCodes';
import { Environment } from './types';

dotenv.config();

/**
 * Creates a typed environment object from process.env
 * @param env - NodeJS process environment
 * @returns {Environment} Typed environment object
 * @throws {Error} If NODE_ENV is invalid
 */
function createTypedEnv(env: NodeJS.ProcessEnv): Environment {
    const nodeEnv = env.NODE_ENV;
    
    // Validate NODE_ENV value
    if (nodeEnv !== 'development' && nodeEnv !== 'production' && nodeEnv !== 'test') {
        throw new Error(`Invalid NODE_ENV: ${nodeEnv}`);
    }

    return {
        MONGODB_URI: env.MONGODB_URI,
        PORT: env.PORT,
        JWT_SECRET: env.JWT_SECRET,
        NODE_ENV: nodeEnv
    } as Environment;
}

/**
 * Validates required environment variables are set
 * @throws {Error} If any required environment variable is missing
 * @returns {Environment} Validated environment variables
 */
function validateEnvironment(): Environment {
    const requiredEnvVars: (keyof Environment)[] = [
        'MONGODB_URI',
        'PORT',
        'JWT_SECRET',
        'NODE_ENV'
    ];

    const missingVars = requiredEnvVars.filter(
        varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return createTypedEnv(process.env);
}

/**
 * Configures request logging middleware
 * @param app - Express application instance
 */
function setupLogging(app: Express): void {
    app.use((req: Request, _res: Response, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
        next();
    });
}

/**
 * Sets up middleware for the Express application
 * @param app - Express application instance
 */
function setupMiddleware(app: Express): void {
    app.use(express.json());
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    setupLogging(app);
}


/**
 * Configures API routes for the application
 * @param app - Express application instance
 */
function setupRoutes(app: Express): void {
    app.get('/', (_req: Request, res: Response) => 
        res.status(HttpStatusCode.OK).json({ 
            message: 'ChatApp Backend is running!' 
        })
    );

    app.use('/auth', authRouter);
}

/**
 * Establishes connection to MongoDB database
 * @param uri - MongoDB connection string
 * @throws {Error} If connection fails
 */
async function connectToDatabase(uri: string): Promise<void> {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } 
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

/**
 * Initializes and configures the Express server
 * Sets up middleware, logging, routes, and database connection
 * @returns {Express} Configured Express application
 */
function initializeServer(): Express {
    const env = validateEnvironment();
    const app = express();
    
    setupMiddleware(app);
    setupRoutes(app);

    if (env.NODE_ENV !== 'test') {
        connectToDatabase(env.MONGODB_URI).then(() => {
            app.listen(env.PORT, () => {
                console.log(`Server running on port ${env.PORT}`);
                console.log('Environment:', env.NODE_ENV);
            });
        });
    }

    return app;
}

export default initializeServer();
