const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path as needed
const User = require('../models/user');
const http = require('http');

let server;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    server = app.listen(process.env.PORT || 0); // Use port 0 to let OS assign a random port
    console.log(`Test server started on port ${server.address().port}`);
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

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

    it('should login a user', async ()=> {
        const res = await request(app)     
            .post('/auth/login')
            .send({
                    email: 'test@example.com',
                    password: 'password123'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
    })
});
