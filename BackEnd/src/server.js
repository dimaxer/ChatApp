"use strict";
/**
 * Express server configuration and initialization
 * Sets up middleware, routes, and database connection
 * Handles environment validation and server startup
 * @module server
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const httpStatusCodes_1 = require("./constants/httpStatusCodes");
dotenv_1.default.config();
/**
 * Creates a typed environment object from process.env
 * @param env - NodeJS process environment
 * @returns {Environment} Typed environment object
 * @throws {Error} If NODE_ENV is invalid
 */
function createTypedEnv(env) {
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
    };
}
/**
 * Validates required environment variables are set
 * @throws {Error} If any required environment variable is missing
 * @returns {Environment} Validated environment variables
 */
function validateEnvironment() {
    const requiredEnvVars = [
        'MONGODB_URI',
        'PORT',
        'JWT_SECRET',
        'NODE_ENV'
    ];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    return createTypedEnv(process.env);
}
/**
 * Configures request logging middleware
 * @param app - Express application instance
 */
function setupLogging(app) {
    app.use((req, _res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
        next();
    });
}
/**
 * Sets up middleware for the Express application
 * @param app - Express application instance
 */
function setupMiddleware(app) {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
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
function setupRoutes(app) {
    app.get('/', (_req, res) => res.status(httpStatusCodes_1.HttpStatusCode.OK).json({
        message: 'ChatApp Backend is running!'
    }));
    app.use('/auth', auth_1.authRouter);
}
/**
 * Establishes connection to MongoDB database
 * @param uri - MongoDB connection string
 * @throws {Error} If connection fails
 */
function connectToDatabase(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(uri);
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    });
}
/**
 * Initializes and configures the Express server
 * Sets up middleware, logging, routes, and database connection
 * @returns {Express} Configured Express application
 */
function initializeServer() {
    const env = validateEnvironment();
    const app = (0, express_1.default)();
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
exports.default = initializeServer();
