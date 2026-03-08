import { z } from "zod"

/**
 * User Schema - Defines the structure and validation rules for user data
 * This schema is used for both validation and TypeScript type inference
 */
export const UserSchema = z.object({
    // Partition key for DynamoDB (always "USER" for user records)
    partition_key: z.string().trim().min(1),
    
    // Unique user identifier (UUID)
    id: z.string().trim().min(1),
    
    // User's full name
    name: z.string().trim().min(1, "Name is required"),
    
    // User's email address
    email: z.string().trim().email("Invalid email format"),
    
    // User's phone number
    phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
    
    // Date of birth (YYYY-MM-DD format)
    dateOfBirth: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
    
    // Hashed password (stored securely)
    password: z.string().min(1),
    
    // Timestamps
    created_at: z.union([z.string(), z.date()]).optional(),
    updated_at: z.union([z.string(), z.date()]).optional(),
})

/**
 * TypeScript type inferred from the Zod schema
 * Use this type for type-safe user objects throughout the application
 */
export type User = z.infer<typeof UserSchema>
