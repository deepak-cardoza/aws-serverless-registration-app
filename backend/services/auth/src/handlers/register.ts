/* eslint-disable import/no-unresolved */
/**
 * Register Handler - Lambda function for user registration
 * 
 * This function handles user registration by:
 * 1. Validating the incoming request data using Zod schema
 * 2. Checking if the user already exists in the database
 * 3. Hashing the user's password for secure storage
 * 4. Storing the new user in DynamoDB
 * 5. Returning appropriate success or error responses
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ZodError } from "zod"
import { v4 as uuidv4 } from "uuid"
// @ts-ignore
import { putItem, queryItems } from "../lib/aws/dynamodb"
// @ts-ignore
import { successResponse, errorResponse } from "../lib/helper"
// @ts-ignore
import { User } from "../entities/User"
import { RegisterUserSchema } from "../utils/schema"
import { hashPassword } from "../utils/util"

// Get the DynamoDB table name from environment variables
const TABLE_NAME = process.env.TABLE_NAME!

/**
 * Lambda handler function for user registration
 * @param event - API Gateway event containing the request data
 * @returns API Gateway response with status code and message
 */
export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        // Parse and validate the request body
        const requestBody = JSON.parse(event.body || "{}")
        const parsed = RegisterUserSchema.parse(requestBody)

        const { name, email, phone, dateOfBirth, password } = parsed

        // Check if user with this email already exists
        // We query using a GSI (Global Secondary Index) on email
        const existingUser = await queryItems(
            TABLE_NAME,
            "email = :email",
            { ":email": email.toLowerCase() },
            "EmailIndex" // GSI name
        )

        if (existingUser.success && existingUser.data && existingUser.data.length > 0) {
            return errorResponse(409, "User with this email already exists")
        }

        // Hash the password before storing
        const hashedPassword = await hashPassword(password)

        // Generate a unique ID for the user
        const userId = uuidv4()

        // Create the user record
        const userRecord: User = {
            partition_key: "USER",
            id: userId,
            name,
            email: email.toLowerCase(),
            phone,
            dateOfBirth,
            password: hashedPassword,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        // Store the user in DynamoDB
        const result = await putItem(TABLE_NAME, userRecord)

        if (!result.success) {
            throw new Error("Failed to create user in database")
        }

        // Return success response (don't send password back)
        return successResponse(201, "User registered successfully", {
            userId,
            name,
            email: email.toLowerCase(),
        })

    } catch (error: unknown) {
        console.error("Register error:", error)

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return errorResponse(400, error.errors[0]?.message || "Invalid input")
        }

        // Handle generic errors
        return errorResponse(500, "Internal server error. Please try again later.")
    }
}
