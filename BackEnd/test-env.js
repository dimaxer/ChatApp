"use strict";
/**
 * Test Environment Configuration
 * Sets up and validates environment for testing
 * Handles environment variable loading and verification
 * @module test-env
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const REQUIRED_ENV_VARS = [
    'MONGODB_URI',
    'PORT',
    'JWT_SECRET',
    'NODE_ENV'
];
function getEnvFilePath() {
    return path_1.default.resolve(process.cwd(), '.env');
}
function checkEnvFileExists(envPath) {
    const exists = fs_1.default.existsSync(envPath);
    console.log('Env file exists:', exists);
    return exists;
}
function loadEnvFile() {
    const result = dotenv_1.default.config();
    if (result.error) {
        throw new Error('Failed to parse environment file');
    }
    return result;
}
function validateRequiredVars() {
    const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        process.exit(1);
    }
}
function logEnvironmentStatus() {
    console.log('Environment variables:', {
        mongoDbExists: !!process.env.MONGODB_URI,
        portExists: !!process.env.PORT,
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
    });
}
function initializeTestEnvironment() {
    console.log('Current directory:', process.cwd());
    const envPath = getEnvFilePath();
    console.log('Env file path:', envPath);
    if (!checkEnvFileExists(envPath)) {
        console.error('Environment file not found');
        process.exit(1);
    }
    try {
        loadEnvFile();
        validateRequiredVars();
        logEnvironmentStatus();
    }
    catch (error) {
        console.error('Error setting up test environment:', error);
        process.exit(1);
    }
}
initializeTestEnvironment();
