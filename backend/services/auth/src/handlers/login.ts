/* eslint-disable import/no-unresolved */
/**
 * Login Handler - Lambda function for user authentication
 * 
 * This function handles user login by:
 * 1. Validating the incoming request data using Zod schema
 * 2. Finding the user by email in the database
 * 3. Verifying the password against the stored hash
 * 4. Generating a JWT token for authenticated sessions
 * 5. Returning the token and user information
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ZodError } from "zod"
// @ts-ignore
import { queryItems } from "../lib/aws/dynamodb"
// @ts-ignore
import { successResponse, errorResponse } from "../lib/helper"
import { LoginUserSchema } from "../utils/schema"
import { comparePassword, generateToken } from "../utils/util"

// Get the DynamoDB table name from environment variables
const TABLE_NAME = process.env.TABLE_NAME!

/**
 * Lambda handler function for user login
 * @param event - API Gateway event containing the request data
 * @returns API Gateway response with JWT token and user data
 */
export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        // Parse and validate the request body
        const requestBody = JSON.parse(event.body || "{}")
        const parsed = LoginUserSchema.parse(requestBody)

        const { email, password } = parsed

        // Find user by email using GSI (Global Secondary Index)
        const userResult = await queryItems(
            TABLE_NAME,
            "email = :email",
            { ":email": email.toLowerCase() },
            "EmailIndex" // GSI name
        )

        // Check if user exists
        if (!userResult.success || !userResult.data || userResult.data.length === 0) {
            return errorResponse(401, "Invalid email or password")
        }

        const user = userResult.data[0]

        // Verify the password
        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return errorResponse(401, "Invalid email or password")
        }

        // Generate JWT token for the authenticated user
        const token = generateToken(user.id, user.email)

        // Return success response with token and user info (excluding password)
        return successResponse(200, "Login successful", {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
            },
        })

    } catch (error: unknown) {
        console.error("Login error:", error)

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return errorResponse(400, error.errors[0]?.message || "Invalid input")
        }

        // Handle generic errors
        return errorResponse(500, "Internal server error. Please try again later.")
    }
}
