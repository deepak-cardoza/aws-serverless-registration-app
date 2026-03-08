import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}

/**
 * Generate a JWT token for authenticated user
 * @param userId - User's unique identifier
 * @param email - User's email address
 * @returns JWT token string
 */
export const generateToken = (userId: string, email: string): string => {
    const secret = process.env.JWT_SECRET || "your-secret-key-change-in-production"
    const expiresIn = "24h" // Token expires in 24 hours
    
    return jwt.sign(
        { userId, email },
        secret,
        { expiresIn }
    )
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
    try {
        const secret = process.env.JWT_SECRET || "your-secret-key-change-in-production"
        return jwt.verify(token, secret)
    } catch (error) {
        return null
    }
}
