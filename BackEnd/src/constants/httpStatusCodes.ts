/**
 * HTTP Status Codes
 * Defines constant values for HTTP response status codes
 * Used throughout the application for consistent HTTP responses
 * @module constants/httpStatusCodes
 */

export const HttpStatusCode = {
    // Success Codes (2xx)
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // Client Error Codes (4xx)
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // Server Error Codes (5xx)
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
} as const;

export type HttpStatusCodeType = typeof HttpStatusCode[keyof typeof HttpStatusCode];
