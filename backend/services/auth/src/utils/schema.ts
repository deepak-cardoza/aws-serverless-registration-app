import { z } from "zod"

/**
 * Register User Schema - Validates the registration request payload
 * Ensures all required fields are present and properly formatted
 */
export const RegisterUserSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
    dateOfBirth: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

/**
 * TypeScript type for registration data
 */
export type RegisterUser = z.infer<typeof RegisterUserSchema>

/**
 * Login User Schema - Validates the login request payload
 * Requires email and password for authentication
 */
export const LoginUserSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

/**
 * TypeScript type for login data
 */
export type LoginUser = z.infer<typeof LoginUserSchema>
