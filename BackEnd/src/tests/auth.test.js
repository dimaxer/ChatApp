"use strict";
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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
const user_1 = require("../models/user");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
let server;
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};
/**
 * Sets up test server and database connection
 */
function setupTestServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        server = server_1.default.listen(process.env.PORT || 0);
        console.log(`Test server started on port ${server.address().port}`);
    });
}
/**
 * Cleans up test database between tests
 */
function cleanupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_1.UserModel.deleteMany({});
    });
}
/**
 * Cleans up test server after all tests
 */
function cleanupServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        yield server.close();
    });
}
/**
 * Registers a test user for authentication tests
 * @returns {Promise<TestResponse>} Response from registration endpoint
 */
function registerTestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send(testUser);
    });
}
/**
 * Logs in the test user for authentication tests
 * @returns {Promise<TestResponse>} Response from login endpoint
 */
function loginTestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password
        });
    });
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
    it('should respond to root endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/')
            .send();
        expect(response.statusCode).toBe(httpStatusCodes_1.HttpStatusCode.OK);
        expect(response.body).toHaveProperty('message', 'ChatApp Backend is running!');
    }));
});
describe('Auth Endpoints', () => {
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield registerTestUser();
        expect(response.statusCode).toBe(httpStatusCodes_1.HttpStatusCode.CREATED);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User created successfully');
    }));
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield registerTestUser();
        const response = yield loginTestUser();
        expect(response.statusCode).toBe(httpStatusCodes_1.HttpStatusCode.OK);
        expect(response.body.status).toBe('success');
        expect((_a = response.body.data) === null || _a === void 0 ? void 0 : _a.token).toBeDefined();
    }));
    it('should protect authenticated routes', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield registerTestUser();
        const loginResponse = yield loginTestUser();
        const token = (_a = loginResponse.body.data) === null || _a === void 0 ? void 0 : _a.token;
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(httpStatusCodes_1.HttpStatusCode.OK);
        expect(response.body.status).toBe('success');
    }));
    it('should reject invalid login credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: 'wrong@email.com',
            password: 'wrongpassword'
        });
        expect(response.statusCode).toBe(httpStatusCodes_1.HttpStatusCode.UNAUTHORIZED);
        expect(response.body.status).toBe('error');
    }));
});
