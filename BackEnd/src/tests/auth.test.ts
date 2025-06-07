import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { UserModel } from '../models/user';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { User } from '../types';

/**
 * Test server configuration interface
 */
interface TestServer {
    address: () => { port: number };
    close: () => Promise<void>;
}

/**
 * Test response interface for auth endpoints
 */
interface TestResponse {
    statusCode: number;
    body: {
        status?: string;
        message?: string;
        data?: {
            token?: string;
            user?: Partial<User>;
        };
    };
}

let server: TestServer;

const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};

/**
 * Sets up test server and database connection
 */
async function setupTestServer(): Promise<void> {
    await mongoose.connect(process.env.MONGODB_URI as string);
    server = app.listen(process.env.PORT || 0) as unknown as TestServer;
    console.log(`Test server started on port ${server.address().port}`);
}

/**
 * Cleans up test database between tests
 */
async function cleanupDatabase(): Promise<void> {
    await UserModel.deleteMany({});
}

/**
 * Cleans up test server after all tests
 */
async function cleanupServer(): Promise<void> {
    await mongoose.connection.close();
    await server.close();
}

/**
 * Registers a test user for authentication tests
 * @returns {Promise<TestResponse>} Response from registration endpoint
 */
async function registerTestUser(): Promise<TestResponse> {
    return await request(app)
        .post('/auth/register')
        .send(testUser);
}

/**
 * Logs in the test user for authentication tests
 * @returns {Promise<TestResponse>} Response from login endpoint
 */
async function loginTestUser(): Promise<TestResponse> {
    return await request(app)
        .post('/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password     
        })
}   

beforeAll(setupTestServer);
afterEach(cleanupDatabase);
afterAll(cleanupServer);    

/**
 * Authentication Tests
 * Integration tests for authentication endpoints
 * Tests registration, login, and protected routes
 * @module tests/auth
 */
describe('Basic Server Tests', () => {
    it('should respond to root endpoint', async () => {
        const response = await request(app)
            .get('/')
            .send();    
            
        expect(response.statusCode).toBe(HttpStatusCode.OK);
        expect(response.body).toHaveProperty('message', 'ChatApp Backend is running!');
    });
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const response = await registerTestUser();
        
        expect(response.statusCode).toBe(HttpStatusCode.CREATED);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User created successfully');
    });

    it('should login a user', async () => {
        await registerTestUser();
        const response = await loginTestUser();
        
        expect(response.statusCode).toBe(HttpStatusCode.OK);
        expect(response.body.status).toBe('success');
        expect(response.body.data?.token).toBeDefined();
    });

    it('should protect authenticated routes', async () => {
        await registerTestUser();
        const loginResponse = await loginTestUser();
        const token = loginResponse.body.data?.token;

        const response = await request(app)
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(HttpStatusCode.OK);
        expect(response.body.status).toBe('success');
    });

    it('should reject invalid login credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@email.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(response.body.status).toBe('error');
    });
});
