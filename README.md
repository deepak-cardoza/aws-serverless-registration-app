# AWS Serverless Registration App

A complete demonstration application showcasing AWS Serverless Framework with API Gateway, Lambda functions, and DynamoDB for user authentication.

## 🏗️ Architecture

This application demonstrates a serverless authentication system built with:

- **AWS Lambda** - Serverless compute for handling API requests
- **API Gateway** - RESTful API endpoints
- **DynamoDB** - NoSQL database for user data storage
- **Serverless Framework** - Infrastructure as Code (IaC)
- **TypeScript** - Type-safe backend development
- **Zod** - Runtime schema validation

## 📁 Project Structure

```
aws-serverless-registration-app/
├── backend/
│   ├── entities/              # Data models with Zod schemas
│   │   └── User.ts           # User entity definition
│   ├── lib/                  # Shared libraries
│   │   ├── aws/
│   │   │   └── dynamodb.ts   # DynamoDB helper functions
│   │   └── helper.ts         # General helper functions
│   ├── services/
│   │   └── auth/             # Authentication service
│   │       ├── docs/
│   │       │   └── auth-swagger.json  # API documentation
│   │       ├── src/
│   │       │   ├── handlers/
│   │       │   │   ├── register.ts    # Registration handler
│   │       │   │   └── login.ts       # Login handler
│   │       │   └── utils/
│   │       │       ├── schema.ts      # Request validation schemas
│   │       │       └── util.ts        # Auth utility functions
│   │       ├── .env                   # Environment variables
│   │       ├── serverless.yml         # Service configuration
│   │       └── tsconfig.json          # TypeScript config
│   ├── package.json
│   ├── pre-deploy.sh         # Pre-deployment script
│   └── ts-build.sh           # TypeScript build script
└── README.md
```

## 🚀 Features

### Authentication APIs

1. **User Registration** (`POST /register`)
   - Validates user input with Zod schemas
   - Checks for existing users
   - Securely hashes passwords with bcrypt
   - Stores user data in DynamoDB
   - Returns user information (excluding password)

2. **User Login** (`POST /login`)
   - Validates credentials
   - Verifies password against stored hash
   - Generates JWT token (24-hour expiry)
   - Returns token and user profile

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js v18.16.0** (recommended for compatibility)
- **Serverless Framework v3.40.0**
- AWS Account with configured credentials

### Version Requirements

To ensure consistency across all environments, use these exact versions:

```bash
# Check Node.js version
node -v  # Should show v18.16.0

# Check Serverless Framework version
sls -v   # Should show Framework Core: 3.40.0
```

If you need to install Node.js v18.16.0, download it from [Node.js official website](https://nodejs.org/download/release/v18.16.0/).

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aws-serverless-registration-app
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
   
   If you encounter dependency conflicts, use:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   
   Edit `backend/services/auth/.env`:
   ```env
   SERVICE_NAME=auth
   REGION=ap-south-1
   DEBUG=true
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Configure AWS credentials**
   ```bash
   aws configure
   ```

### Deployment

1. **Deploy to AWS**
   ```bash
   cd backend/services/auth
   serverless deploy
   ```

2. **Run locally with serverless-offline**
   ```bash
   cd backend/services/auth
   serverless offline
   ```
   The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Register User

**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-15",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "data": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
- `400` - Invalid input data
- `409` - User already exists
- `500` - Internal server error

### Login User

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "dateOfBirth": "1990-01-15"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - Invalid credentials
- `500` - Internal server error

## 🗄️ Database Schema

### DynamoDB Table: `auth-users-{stage}`

**Primary Key:**
- Partition Key: `partition_key` (String) - Always "USER"
- Sort Key: `id` (String) - UUID

**Global Secondary Index:**
- Index Name: `EmailIndex`
- Partition Key: `email` (String)

**Attributes:**
- `partition_key` - Partition key for data organization
- `id` - Unique user identifier (UUID)
- `name` - User's full name
- `email` - User's email (indexed for quick lookup)
- `phone` - User's phone number
- `dateOfBirth` - Date of birth (YYYY-MM-DD)
- `password` - Hashed password (bcrypt)
- `created_at` - Timestamp of account creation
- `updated_at` - Timestamp of last update

## 🔒 Security Features

1. **Password Hashing** - Passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Authentication** - Secure token-based authentication
3. **Input Validation** - Zod schemas validate all incoming requests
4. **Email Uniqueness** - Prevents duplicate accounts
5. **CORS Configuration** - Proper CORS headers for API security

## 🧪 Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-15",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

## 📚 Key Technologies

- **Serverless Framework** - Infrastructure as Code
- **TypeScript** - Type-safe development
- **Zod** - Schema validation and type inference
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **AWS SDK v3** - AWS service integration

## 🎓 Learning Resources

This demo application is designed for beginners to understand:

1. **Serverless Architecture** - How to build scalable serverless applications
2. **AWS Lambda** - Writing and deploying Lambda functions
3. **DynamoDB** - NoSQL database operations and indexing
4. **API Gateway** - Creating RESTful APIs
5. **TypeScript** - Type-safe backend development
6. **Authentication** - Implementing secure user authentication

## 📝 Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run eslint` - Run ESLint for code quality

## 🔧 Troubleshooting

### Build Issues
If you encounter build errors, ensure:
1. All dependencies are installed: `npm install`
2. TypeScript is properly configured
3. The `pre-deploy.sh` and `ts-build.sh` scripts have execute permissions

### Deployment Issues
1. Verify AWS credentials are configured
2. Check that the region in `.env` matches your AWS setup
3. Ensure DynamoDB table name doesn't conflict with existing tables

## 📄 License

ISC

## 👤 Author

Deepak Cardoza

---

**Note:** This is a demonstration application. For production use, ensure you:
- Use strong JWT secrets
- Implement rate limiting
- Add comprehensive error logging
- Set up monitoring and alerts
- Use AWS Secrets Manager for sensitive data
- Implement proper backup strategies
