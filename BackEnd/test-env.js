const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('Current directory:', process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log('Env file path:', envPath);

// Check if file exists
console.log('Env file exists:', fs.existsSync(envPath));

// Try to read the file contents
try {
    const envContents = fs.readFileSync(envPath, 'utf8');
    console.log('Env file contents (first line):', envContents.split('\n')[0]);
} catch (error) {
    console.error('Error reading .env file:', error);
}

const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Env file loaded successfully');
    console.log('Environment variables:', {
        mongoDbExists: !!process.env.MONGODB_URI,
        portExists: !!process.env.PORT,
        jwtSecretExists: !!process.env.JWT_SECRET
    });
}
