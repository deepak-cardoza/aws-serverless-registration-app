# AWS Serverless Registration App

A comprehensive demonstration application showcasing AWS serverless architecture with a focus on backend services, Infrastructure as Code (IaC), and cloud-native development practices. This project implements a complete user authentication system using AWS Lambda, API Gateway, and DynamoDB, with a simple frontend for demonstration purposes.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [AWS Services Used](#aws-services-used)
- [Understanding AWS Services (Manual Setup)](#understanding-aws-services-manual-setup)
  - [Creating Lambda Function](#1-creating-a-lambda-function)
  - [Setting up API Gateway](#2-setting-up-api-gateway)
  - [Creating DynamoDB Table](#3-creating-dynamodb-table)
- [Project Setup & Installation](#project-setup--installation)
  - [Prerequisites](#prerequisites)
  - [Step 1: Fork and Clone Repository](#step-1-fork-and-clone-repository)
  - [Step 2: Install Node.js and npm](#step-2-install-nodejs-and-npm)
  - [Step 3: Install AWS CLI](#step-3-install-aws-cli)
  - [Step 4: Install Serverless Framework v3](#step-4-install-serverless-framework-v3)
  - [Step 5: Install TypeScript Globally](#step-5-install-typescript-globally)
  - [Step 6: Configure AWS Credentials](#step-6-configure-aws-credentials)
  - [Step 7: Install Project Dependencies](#step-7-install-project-dependencies)
  - [Step 8: Deploy Resources (Lambda Layer)](#step-8-deploy-resources-lambda-layer)
  - [Step 9: Deploy Auth Service](#step-9-deploy-auth-service)
  - [Step 10: Test the APIs](#step-10-test-the-apis)
  - [Step 11: Setup Frontend](#step-11-setup-frontend)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Project Overview

This project is designed as a **learning resource for AWS serverless architecture** with emphasis on:

- **Backend Development**: Building scalable serverless APIs using TypeScript and Node.js
- **AWS Cloud Services**: Hands-on experience with core AWS services
- **Infrastructure as Code**: Automated infrastructure deployment using Serverless Framework
- **Security Best Practices**: Password hashing, JWT authentication, and input validation
- **Frontend Integration**: Simple HTML/CSS/JavaScript interface for API interaction

The main focus is on understanding how AWS services work together to create a production-ready serverless application, with a minimal frontend to demonstrate the complete user flow.

---

## Tech Stack

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling with modern gradients and animations
- **JavaScript (ES6+)** - Client-side logic and API calls
- **Axios** - HTTP client for API requests

### Backend
- **TypeScript** - Type-safe backend development
- **Node.js v20.x** - JavaScript runtime
- **[Serverless Framework v3](https://www.serverless.com/framework/docs)** - Infrastructure as Code (IaC) tool
- **Zod** - Schema validation and type inference
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **AWS SDK v3** - AWS service integration

### AWS Services
- **AWS Lambda** - Serverless compute
- **API Gateway** - RESTful API management
- **DynamoDB** - NoSQL database
- **S3** - Static website hosting (frontend) and deployment packages (backend)
- **CloudFront** - Content Delivery Network (CDN) for secure, low-latency frontend delivery
- **CloudFormation** - Infrastructure provisioning
- **CloudWatch** - Logging and monitoring
- **SSM Parameter Store** - Configuration management
- **IAM** - Identity and access management

### Development Tools
- **[Serverless Framework v3](https://www.serverless.com/framework/docs)** - Infrastructure as Code (IaC)
- **[Swagger Editor](https://editor.swagger.io/)** - API documentation and testing
- **[Postman](https://www.postman.com/)** - API testing and development

### Serverless Framework Plugins
- **serverless-s3-sync** - Syncs local directories (such as compiled `dist` frontend assets) directly to an S3 bucket automatically.
- **serverless-plugin-scripts** - Enables custom lifecycle hook scripting to run automated actions (e.g., frontend asset preparation, copying files, and CloudFront CDN cache invalidations) during packaging and deployment.
- **serverless-dotenv-plugin** - Pre-loads environment variables from local `.env` files into serverless configuration files.
- **serverless-offline** - Emulates AWS Lambda and API Gateway locally on your machine for offline testing.

---

## Understanding AWS Services (Manual Setup)

Before diving into automated deployments, let's understand AWS services by creating them manually through the AWS Console.

### 1. Creating a Lambda Function

**Purpose**: Learn how Lambda functions work by creating a simple "Hello World" function.

**Steps**:

1. **Login to AWS Console**
   - Navigate to [AWS Console](https://console.aws.amazon.com/)
   - Sign in with your AWS account

2. **Open Lambda Service**
   - Search for "Lambda" in the services search bar
   - Click on "Lambda" to open the Lambda dashboard

3. **Create Function**
   - Click "Create function" button
   - Choose "Author from scratch"
   - Function name: `hello-world-function`
   - Runtime: Select "Python 3.12"
   - Architecture: x86_64
   - Click "Create function"

4. **Add Function Code**
   - In the Code source section, replace the default code with:
   ```python
   def lambda_handler(event, context):
       return {
           'statusCode': 200,
           'body': 'Hello from Lambda!'
       }
   ```
   - Click "Deploy" to save changes

5. **Test the Function**
   - Click "Test" tab
   - Create a new test event with default settings
   - Click "Test" button
   - Observe the execution results showing "Hello from Lambda!"

### 2. Setting up API Gateway

**Purpose**: Create an HTTP endpoint that triggers your Lambda function.

**Steps**:

1. **Open API Gateway Service**
   - Search for "API Gateway" in AWS Console
   - Click "Create API"

2. **Choose API Type**
   - Select "HTTP API" (simpler for learning)
   - Click "Build"

3. **Add Integration**
   - Click "Add integration"
   - Select "Lambda"
   - Choose your region
   - Select `hello-world-function`
   - API name: `hello-world-api`
   - Click "Next"

4. **Configure Routes**
   - Method: GET
   - Resource path: `/hello`
   - Click "Next"

5. **Define Stages**
   - Stage name: `dev`
   - Click "Next" then "Create"

6. **Test the API**
   - Copy the "Invoke URL" from the API details
   - Open the URL in browser: `https://your-api-id.execute-api.region.amazonaws.com/dev/hello`
   - You should see "Hello from Lambda!"

### 3. Creating DynamoDB Table

**Purpose**: Understand NoSQL database structure and primary keys.

**Steps**:

1. **Open DynamoDB Service**
   - Search for "DynamoDB" in AWS Console
   - Click "Create table"

2. **Configure Table**
   - Table name: `test-users-table`
   - Partition key: `userId` (String)
   - Sort key: `email` (String)
   - Table settings: Use default settings
   - Click "Create table"

3. **Add Sample Data**
   - Once table is created, click on the table name
   - Go to "Explore table items"
   - Click "Create item"
   - Add attributes:
     - `userId`: `user-001`
     - `email`: `test@example.com`
     - Add more attributes: `name` (String): `Test User`
   - Click "Create item"

4. **Query the Table**
   - Use "Scan" to view all items
   - Try filtering by partition key

**Key Learnings**:
- Lambda functions are event-driven and stateless
- API Gateway routes HTTP requests to Lambda functions
- DynamoDB uses partition keys for data distribution
- All these services are serverless (no server management)

---

## Project Setup & Installation

### Prerequisites

Before starting, ensure you have:
- An AWS account with administrative access
- A Bash-compliant terminal/command line:
  - **Windows**: Git Bash (installed automatically with Git).
  - **macOS/Linux**: Default Terminal/Zsh/Bash.
- Git installed on your machine (includes Git Bash for Windows)

### Step 1: Fork and Clone Repository

**Fork the Repository** (if contributing):
1. Go to the GitHub repository page
2. Click the "Fork" button in the top-right corner
3. This creates a copy in your GitHub account

**Clone the Repository**:
```bash
# Clone your forked repository (or the original)
git clone https://github.com/your-username/aws-serverless-registration-app.git

# Navigate to project directory
cd aws-serverless-registration-app
```

### Step 2: Install Node.js and npm

**Check if Node.js is installed**:
```bash
node -v
npm -v
```

**If not installed or wrong version**:

1. **Download Node.js v24.15.0**:
   - Visit [Node.js v24.15.0 Downloads](https://nodejs.org/download/release/v24.15.0/)
   - Download the installer for your operating system:
     - Windows: `node-v24.15.0-x64.msi`
     - macOS: `node-v24.15.0.pkg`
     - Linux: `node-v24.15.0-linux-x64.tar.xz`

2. **Install Node.js**:
   - Run the installer
   - Follow the installation wizard
   - Restart your terminal

3. **Verify Installation**:
   ```bash
   node -v  # Should output: v24.15.0
   npm -v   # Should output: 10.x.x or higher
   ```

### Step 3: Install AWS CLI

**Check if AWS CLI is installed**:
```bash
aws --version
```

**If not installed**:

**For Windows**:

- [Download AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
```bash
# Download and run the MSI installer
# Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

**For macOS**:
```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

**For Linux**:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify Installation**:
```bash
aws --version  # Should output: aws-cli/2.x.x
```

### Step 4: Install Serverless Framework v3

**Important**: We need Serverless Framework version 3.40.0 specifically.

```bash
# Install Serverless Framework v3.40.0 globally
npm install -g serverless@3.40.0

# Verify installation
sls -v
# Should output: Framework Core: 3.40.0
```

**Why version 3.40.0?**
This project is built and tested with Serverless Framework v3. Version 4 has breaking changes that are not compatible with this setup.

### Step 5: Install TypeScript Globally

**Important**: TypeScript must be installed globally because the build scripts (`ts-build.sh`) compile the services using the global `tsc` compiler command.

```bash
# Install TypeScript globally
npm install -g typescript

# Verify installation
tsc -v
# Should output: Version 5.x.x or higher
```

### Step 6: Configure AWS Credentials

**Create IAM User** (if you don't have one):

1. **Login to AWS Console**
   - Go to IAM service
   - Click "Users" → "Add users"

2. **Create User**:
   - User name: `serverless-deploy-user`
   - Select "Access key - Programmatic access"
   - Click "Next: Permissions"

3. **Attach Policies**:
   - Click "Attach existing policies directly"
   - Select these policies:
     - `AdministratorAccess` (for learning purposes)
     - For production, use more restrictive policies
   - Click "Next" → "Create user"

4. **Save Credentials**:
   - **IMPORTANT**: Copy the Access Key ID and Secret Access Key
   - You won't be able to see the secret key again!

**Configure AWS CLI**:
```bash
aws configure
```

Enter the following when prompted:
```
AWS Access Key ID: YOUR_ACCESS_KEY_ID
AWS Secret Access Key: YOUR_SECRET_ACCESS_KEY
Default region name: ap-south-1  # or your preferred region
Default output format: json
```

**Verify Configuration**:
```bash
aws sts get-caller-identity
# Should display your AWS account details
```

### Step 7: Install Project Dependencies

**Navigate to backend folder**:
```bash
cd backend
```

**Install dependencies**:
```bash
npm install
```

If you encounter dependency conflicts:
```bash
npm install --legacy-peer-deps
```

**Understanding the Backend Structure**:

```
backend/
├── entities/              # Data models with Zod schemas
│   └── User.ts           # User entity with validation rules
├── lib/                  # Shared libraries across services
│   ├── aws/
│   │   └── dynamodb.ts   # DynamoDB helper functions (CRUD operations)
│   └── helper.ts         # Common utilities (CORS headers, responses)
├── resources/            # Infrastructure resources
│   ├── nodejs/           # Lambda Layer dependencies
│   │   └── package.json  # Layer packages (bcrypt, jwt, zod, uuid)
│   └── serverless.yml    # Lambda Layer and SSM configuration
├── services/             # Microservices
│   └── auth/             # Authentication service
│       ├── src/
│       │   ├── handlers/ # Lambda function handlers
│       │   │   ├── register.ts  # User registration logic
│       │   │   └── login.ts     # User login logic
│       │   └── utils/
│       │       ├── schema.ts    # Zod validation schemas
│       │       └── util.ts      # Auth utilities (hash, JWT)
│       ├── .env          # Environment variables
│       └── serverless.yml # Service configuration (API, Lambda, DynamoDB)
├── package.json          # Root dependencies
├── pre-deploy.sh         # Pre-deployment script (copies lib/entities)
└── ts-build.sh           # TypeScript compilation script
```

**Key Files Explained**:

- **entities/User.ts**: Defines user data structure with Zod validation
- **lib/aws/dynamodb.ts**: Reusable functions for DynamoDB operations
- **lib/helper.ts**: Common response formatters and CORS headers
- **resources/serverless.yml**: Creates Lambda Layer with shared dependencies
- **services/auth/serverless.yml**: Defines API Gateway, Lambda functions, and DynamoDB table
- **pre-deploy.sh**: Copies shared code (lib, entities) into service before deployment
- **ts-build.sh**: Compiles TypeScript to JavaScript

### Step 8: Deploy Resources (Lambda Layer)

**Purpose**: Deploy the Lambda Layer containing shared dependencies (bcrypt, jwt, zod, uuid).

**Open Terminal 1** (for resources):

```bash
# Navigate to resources folder
cd backend/resources

# Export AWS credentials (if not using aws configure)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=ap-south-1

# Deploy resources
sls deploy --stage dev
```

**What happens during deployment**:
1. Serverless Framework reads `serverless.yml`
2. Installs npm packages in `nodejs/` folder
3. Creates a Lambda Layer with these dependencies
4. Creates CloudFormation stack: `aws-reg-app-resources-dev`
5. Stores Layer ARN in SSM Parameter Store: `REG_APP_NODE_LAYER`

**Verify in AWS Console**:

1. **Lambda Layers**:
   - Go to Lambda → Layers
   - You should see `aws-reg-app-resources-dev-NodeDependencies`

2. **CloudFormation**:
   - Go to CloudFormation → Stacks
   - Stack name: `aws-reg-app-resources-dev`
   - Status should be `CREATE_COMPLETE`

3. **SSM Parameter Store**:
   - Go to Systems Manager → Parameter Store
   - Parameter: `REG_APP_NODE_LAYER`
   - Contains the Lambda Layer ARN

**Expected Output**:
```
✔ Service deployed to stack aws-reg-app-resources-dev (XXs)

layers:
  NodeDependencies: arn:aws:lambda:ap-south-1:XXXX:layer:aws-reg-app-resources-dev-NodeDependencies:1
```

### Step 9: Deploy Auth Service

**Purpose**: Deploy the authentication service with API Gateway, Lambda functions, and DynamoDB table.

**Open Terminal 2** (for services):

```bash
# Navigate to auth service folder
cd backend/services/auth

# Export AWS credentials (if needed)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=ap-south-1

# Deploy auth service
sls deploy --stage dev
```

**What happens during deployment**:
1. Pre-deploy script copies `lib/` and `entities/` into `src/`
2. TypeScript is compiled to JavaScript in `dist/` folder
3. CloudFormation creates:
   - DynamoDB table: `auth-users-dev`
   - Lambda functions: `register` and `login`
   - API Gateway with `/register` and `/login` endpoints
4. Lambda functions are linked to the Lambda Layer
5. IAM roles are created with DynamoDB permissions

**Verify in AWS Console**:

1. **API Gateway**:
   - Go to API Gateway
   - API name: `dev-auth`
   - Note the "Invoke URL" (e.g., `https://abc123.execute-api.ap-south-1.amazonaws.com/dev`)

2. **Lambda Functions**:
   - Go to Lambda → Functions
   - You should see:
     - `auth-dev-register`
     - `auth-dev-login`
   - Click on a function → Configuration → Layers
   - Verify the Lambda Layer is attached

3. **DynamoDB**:
   - Go to DynamoDB → Tables
   - Table name: `auth-users-dev`
   - Check the schema:
     - Partition key: `partition_key`
     - Sort key: `id`
     - GSI: `EmailIndex` on `email`

4. **CloudFormation**:
   - Stack name: `auth-dev`
   - Status: `CREATE_COMPLETE`

5. **CloudWatch Logs**:
   - Go to CloudWatch → Log groups
   - You should see:
     - `/aws/lambda/auth-dev-register`
     - `/aws/lambda/auth-dev-login`

**Expected Output**:
```
✔ Service deployed to stack auth-dev (XXs)

endpoints:
  POST - https://abc123.execute-api.ap-south-1.amazonaws.com/dev/register
  POST - https://abc123.execute-api.ap-south-1.amazonaws.com/dev/login

functions:
  register: auth-dev-register
  login: auth-dev-login
```

**IMPORTANT**: Copy the API Gateway endpoint URL!

### Step 10: Test the APIs

**Method 1: Using Postman (Recommended)**

1. **Open Postman Web**:
   - Visit [Postman Web](https://www.postman.com/)
   - Sign in or create a free account

2. **Import Swagger Documentation**:
   - In Postman, click "Import"
   - Select "File" tab
   - Upload `backend/services/auth/docs/auth-swagger.json`
   - Postman will automatically create a collection with all endpoints

3. **Test Registration**:
   - Select `POST /register` from the collection
   - Update the base URL to your API Gateway endpoint
   - Go to "Body" tab → "raw" → "JSON"
   - Add request body:
   ```json
   {
     "name": "John Doe",
     "email": "john.doe@example.com",
     "phone": "1234567890",
     "dateOfBirth": "1990-01-15",
     "password": "SecurePass123!"
   }
   ```
   - Click "Send"

4. **Test Login**:
   - Select `POST /login` from the collection
   - Add request body:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "SecurePass123!"
   }
   ```
   - Click "Send"
   - Copy the JWT token from the response

**Method 2: Using Swagger Editor**

1. **Open Swagger Editor**:
   - Visit [Swagger Editor](https://editor.swagger.io/)

2. **Load API Documentation**:
   - Click "File" → "Import file"
   - Select `backend/services/auth/docs/auth-swagger.json`

3. **Update Server URL**:
   - In the editor, update the `servers` section with your API Gateway URL:
   ```yaml
   servers:
     - url: https://your-api-gateway-url.amazonaws.com/dev
   ```

4. **Test Endpoints**:
   - Click "Try it out" on any endpoint
   - Fill in the request body
   - Click "Execute"
   - View the response

**Method 3: Using cURL**:

**Test Registration**:
```bash
curl -X POST https://your-api-gateway-url.amazonaws.com/dev/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-15",
    "password": "SecurePass123!"
  }'
```

**Expected Response**:
```json
{
  "message": "User registered successfully",
  "data": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Test Login**:
```bash
curl -X POST https://your-api-gateway-url.amazonaws.com/dev/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response**:
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "dateOfBirth": "1990-01-15"
    }
  }
}
```

**Verify in DynamoDB**:
1. Go to DynamoDB → Tables → `auth-users-dev`
2. Click "Explore table items"
3. You should see the registered user with hashed password

### Step 11: Setup Frontend

**1. Update API Configuration**:

Navigate to frontend folder:
```bash
cd frontend
```

Edit `js/config.js` and set the `BASE_URL` to your API Gateway Invoke URL:
```javascript
const API_CONFIG = {
    BASE_URL: 'https://your-api-gateway-url.amazonaws.com/dev', // Replace with your actual URL
    ENDPOINTS: {
        REGISTER: '/register',
        LOGIN: '/login'
    }
};
```

---

**2. Deploy Frontend to AWS (S3 & CloudFront CDN)** (Recommended for Cloud Hosting):

You can deploy the frontend application to an S3 bucket configured for static web hosting and deliver it securely using Amazon CloudFront.

1. **Install Dependencies**:
   Install the required Serverless Framework plugins:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```
   *Optional:* Open the `.env` file to customize the `REGION` and `S3_BUCKET_NAME`. If not specified, the bucket name defaults to `aws-reg-app-frontend`.

3. **Deploy to AWS**:
   ```bash
   # Deploy frontend resources
   sls deploy --stage dev
   ```
   *(Note: Avoid using the `sls` command alias on Windows PowerShell as it conflicts with Select-String).*

4. **Verify Deployment & Access**:
   Once the deployment finishes, the terminal will display the CloudFront URL. For example:
   ```text
   ✅ Invalidation submitted (ID: I2DTK7FREP6YISJPNGFLUW6DP2)
   🌐 CloudFront CDN URL: https://d1lrefdzq6r7v6.cloudfront.net
   ```
   Open that URL in your browser to access the live web application securely over HTTPS.

---

**3. Run Frontend Locally** (Alternative for local development):

If you prefer to run the frontend application locally, you can use any static server:

* **Option 1: Using VS Code Live Server**:
  - Install the "Live Server" extension in VS Code.
  - Right-click on `index.html` and select "Open with Live Server".
  - The browser will automatically open at `http://localhost:5500`.

* **Option 2: Using Python**:
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

* **Option 3: Using Node.js**:
  ```bash
  npx http-server
  ```
  Open `http://localhost:8080` in your browser.

---

**4. Access the Application**:
- Open the application URL (locally or CloudFront URL).
- You should see the landing page.
- Click "Register" to create an account.
- After registration, login with your credentials and view your profile information.

---

## Project Structure

```
aws-serverless-registration-app/
├── backend/
│   ├── entities/              # Zod schemas for data validation
│   │   └── User.ts
│   ├── lib/                   # Shared utilities
│   │   ├── aws/
│   │   │   └── dynamodb.ts    # DynamoDB operations
│   │   └── helper.ts          # Response formatters
│   ├── resources/             # Infrastructure resources
│   │   ├── nodejs/
│   │   │   └── package.json   # Lambda Layer dependencies
│   │   └── serverless.yml     # Layer configuration
│   ├── services/
│   │   └── auth/              # Authentication service
│   │       ├── docs/
│   │       │   └── auth-swagger.json
│   │       ├── src/
│   │       │   ├── handlers/
│   │       │   │   ├── register.ts
│   │       │   │   └── login.ts
│   │       │   └── utils/
│   │       │       ├── schema.ts
│   │       │       └── util.ts
│   │       ├── .env
│   │       ├── serverless.yml
│   │       └── tsconfig.json
│   ├── package.json
│   ├── pre-deploy.sh
│   └── ts-build.sh
├── frontend/
│   ├── css/
│   │   └── style.css          # Page styling including responsive footer
│   ├── js/
│   │   ├── config.js          # API Endpoint Configuration
│   │   ├── nav.js             # Navigation component (dynamically loads About page)
│   │   ├── index.js
│   │   ├── register.js
│   │   ├── login.js
│   │   └── home.js
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── home.html
│   ├── about.html             # About page showing AWS architecture & tech stack
│   ├── serverless.yml         # Serverless configuration for S3 & CloudFront deployment
│   ├── package.json           # Frontend devDependencies for Serverless plugins
│   ├── deploy.sh              # Bash helper script for pre-build and invalidation
│   ├── .env.example           # Example env configuration
│   └── README.md
└── README.md
```

---

## API Documentation

### Register User

**Endpoint**: `POST /register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-15",
  "password": "SecurePass123!"
}
```

**Validation Rules**:
- `name`: Required, minimum 1 character
- `email`: Required, valid email format
- `phone`: Required, minimum 10 digits
- `dateOfBirth`: Required, YYYY-MM-DD format
- `password`: Required, minimum 8 characters

**Success Response (201)**:
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

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `409 Conflict`: User already exists
- `500 Internal Server Error`: Server error

### Login User

**Endpoint**: `POST /login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200)**:
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

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

## Database Schema

### DynamoDB Table: `auth-users-dev`

**Primary Key**:
- Partition Key: `partition_key` (String) - Always "USER"
- Sort Key: `id` (String) - UUID v4

**Global Secondary Index**:
- Index Name: `EmailIndex`
- Partition Key: `email` (String)
- Projection: ALL

**Attributes**:
| Attribute | Type | Description |
|-----------|------|-------------|
| partition_key | String | Partition key (always "USER") |
| id | String | Unique user identifier (UUID) |
| name | String | User's full name |
| email | String | User's email (indexed) |
| phone | String | User's phone number |
| dateOfBirth | String | Date of birth (YYYY-MM-DD) |
| password | String | Hashed password (bcrypt) |
| created_at | String | ISO timestamp of creation |
| updated_at | String | ISO timestamp of last update |

---

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: 24-hour token expiry
3. **Input Validation**: Zod schema validation
4. **Email Uniqueness**: GSI prevents duplicate accounts
5. **CORS Configuration**: Proper headers for security
6. **Environment Variables**: Sensitive data in .env files
7. **IAM Roles**: Least privilege access for Lambda functions

---

## Troubleshooting

### Common Issues

**1. Serverless Framework Version Mismatch**
```bash
# Error: Invalid configuration
# Solution: Install exact version
npm install -g serverless@3.40.0
```

**2. AWS Credentials Not Configured**
```bash
# Error: Missing credentials
# Solution: Configure AWS CLI
aws configure
```

**3. Node.js Version Mismatch**
```bash
# Error: Unsupported engine
# Solution: Install Node.js v24.15.0
```

**4. Lambda Layer Circular Dependency**
```bash
# Error: EMFILE: too many open files
# Solution: Package name in resources/nodejs/package.json should not be "lambda-layer"
# Use "reg-app-dependencies" instead
```

**5. DynamoDB Table Already Exists**
```bash
# Error: Table already exists
# Solution: Delete existing table or change stage name
sls deploy --stage dev2
```

**6. API Gateway 403 Forbidden**
```bash
# Error: Missing Authentication Token
# Solution: Check API endpoint URL and HTTP method
```

### Cleanup Resources

**Remove all deployed resources**:
```bash
# Remove auth service
cd backend/services/auth
sls remove --stage dev

# Remove resources
cd ../../resources
sls remove --stage dev
```

This will delete:
- Lambda functions
- API Gateway
- DynamoDB table
- CloudFormation stacks
- Lambda Layer
- SSM parameters

---

<div align="center">

## **Author**

<img src="https://github.com/deepak-cardoza.png" width="150" style="border-radius: 50%;" alt="Deepak Cardoza">

### Hi, I'm Deepak Cardoza 👋

**Founder & Full Stack Developer** at Ezra Techland | Former Backend Developer at 7EDGE Private Limited

MCA Graduate from St. Joseph Engineering College, Mangaluru | AWS Certified Cloud Practitioner & Developer Associate

Passionate about software development, cloud technologies, building useful applications, and also enjoy videography and creative tech work.

---

📱 **+91 8494964695** | 📧 **deepakcardoza12@gmail.com** | 🌐 **[deepakcardoza.com](https://deepakcardoza.com)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/deepak-cardoza-b544961aa)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/deepak-cardoza)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@deepakcardoza)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/deepak_cardoza/)

📍 **Mangaluru, Karnataka, India**

</div>
