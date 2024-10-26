/**
 * HTTP Status Codes used throughout the application
 * These constants help maintain consistency in HTTP responses
 * @module HttpStatusCode
 */
const HttpStatusCode = {
    // Success Codes (2xx)
    OK: 200,                    // Standard response for successful HTTP requests
    CREATED: 201,              // Request succeeded and new resource was created
    
    // Client Error Codes (4xx)
    BAD_REQUEST: 400,          // Server cannot process request due to client error
    UNAUTHORIZED: 401,         // Authentication is required and has failed
    FORBIDDEN: 403,           // Server refuses to fulfill valid request
    NOT_FOUND: 404,           // Requested resource could not be found
    CONFLICT: 409,            // Request conflicts with current state of server
    
    // Server Error Codes (5xx)
    INTERNAL_SERVER_ERROR: 500 // Generic server error message
};

module.exports = HttpStatusCode;
