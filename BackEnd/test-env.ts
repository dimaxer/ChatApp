/**
 * Test Environment Configuration
 * Sets up and validates environment for testing
 * Handles environment variable loading and verification
 * @module test-env
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Environment } from './src/types';

const REQUIRED_ENV_VARS: (keyof Environment)[] = [
    'MONGODB_URI',
    'PORT',
    'JWT_SECRET',
    'NODE_ENV'
];

function getEnvFilePath(): string {
    return path.resolve(process.cwd(), '.env');
}

function checkEnvFileExists(envPath: string): boolean {
    const exists = fs.existsSync(envPath);
    console.log('Env file exists:', exists);
    return exists;
}

function loadEnvFile(): dotenv.DotenvConfigOutput {
    const result = dotenv.config();
    if (result.error) {
        throw new Error('Failed to parse environment file');
    }
    return result;
}

function validateRequiredVars(): void {
    const missingVars = REQUIRED_ENV_VARS.filter(
        varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        process.exit(1);
    }
}

function logEnvironmentStatus(): void {
    console.log('Environment variables:', {
        mongoDbExists: !!process.env.MONGODB_URI,
        portExists: !!process.env.PORT,
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
    });
}

function initializeTestEnvironment(): void {
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
    } catch (error) {
        console.error('Error setting up test environment:', error);
        process.exit(1);
    }
}

initializeTestEnvironment();
