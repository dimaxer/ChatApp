const request = require('supertest');
const app = require('../server'); // Adjust the path as needed

describe('Basic Server Tests', () => {
    it('should respond to root endpoint', async () => {
        const res = await request(app)
            .get('/')
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'ChatApp Backend is running!');
    });
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
