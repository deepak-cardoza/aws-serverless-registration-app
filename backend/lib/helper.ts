/**
 * CORS headers for API Gateway responses
 * Allows cross-origin requests from any domain
 */
export const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
}

/**
 * Format a success response
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param data - Optional data to include in response
 * @returns Formatted API Gateway response
 */
export const successResponse = (statusCode: number, message: string, data?: any) => {
    return {
        statusCode,
        headers,
        body: JSON.stringify({
            message,
            ...(data && { data }),
        }),
    }
}

/**
 * Format an error response
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @returns Formatted API Gateway response
 */
export const errorResponse = (statusCode: number, message: string) => {
    return {
        statusCode,
        headers,
        body: JSON.stringify({
            message,
        }),
    }
}
