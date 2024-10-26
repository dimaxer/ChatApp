/**
 * Test Environment Configuration
 * Handles environment setup for testing purposes
 * @module TestEnvironment
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

/**
 * Initialize and validate test environment
 * Checks for required environment variables and configuration files
 */
function initializeTestEnvironment() {
    console.log('Current directory:', process.cwd());
    const envPath = path.resolve(process.cwd(), '.env');
    console.log('Env file path:', envPath);

    // Verify environment file exists
    const envExists = fs.existsSync(envPath);
    console.log('Env file exists:', envExists);

    if (!envExists) {
        console.error('Environment file not found');
        process.exit(1);
    }

    // Try to read and parse environment file
    try {
        const envContents = fs.readFileSync(envPath, 'utf8');
        console.log('Env file loaded successfully');
        
        const result = dotenv.config();
        if (result.error) {
            throw new Error('Failed to parse environment file');
        }

        // Validate required environment variables
        validateEnvironmentVariables();

    } catch (error) {
        console.error('Error setting up test environment:', error);
        process.exit(1);
    }
}

/**
 * Validate presence of required environment variables
 * @throws {Error} If any required variable is missing
 */
function validateEnvironmentVariables() {
    const requiredVars = ['MONGODB_URI', 'PORT', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        process.exit(1);
    }

    console.log('Environment variables:', {
        mongoDbExists: !!process.env.MONGODB_URI,
        portExists: !!process.env.PORT,
        jwtSecretExists: !!process.env.JWT_SECRET
    });
}

initializeTestEnvironment();
