#!/bin/bash

# Function to check if a service already exists in the compose file
check_service_exists() {
  local service=$1
  local compose_file="serverless-compose.yml"

  if [ -f "$compose_file" ]; then
    # Check for the service name in a case-insensitive way
    if grep -iq "^[[:space:]]*$service:" "$compose_file"; then
      echo "Error: $service already exists in $compose_file (case-insensitive match)."
      exit 1
    fi
  fi
}

# Function to update the serverless conmpose file, when new service is added
update_serverless_compose() {
  local service=$1
  local service_path="services/$service"
  local compose_file="serverless-compose.yml"

  # Check if the compose file exists
  if [ -f "$compose_file" ]; then
    # Check if the service already exists
    if grep -q "  $service:" "$compose_file"; then
      echo "$service already exists in $compose_file."
    else
      # Add the new service to the end of the services section
      echo "Adding $service to $compose_file..."
      awk -v service="$service" -v service_path="$service_path" '
        /^services:/ { 
          print; 
          in_services=1; 
          next 
        }
        in_services && /^[^[:space:]]/ { 
          in_services=0; 
          print "  " service ":\n    path: " service_path
        }
        { print }
        END {
          if (in_services) {
            print "  " service ":\n    path: " service_path ""
          }
        }
      ' "$compose_file" > "${compose_file}.tmp" && mv "${compose_file}.tmp" "$compose_file"
      echo "$service added to $compose_file."
    fi
  else
    # Create the compose file if it doesn't exist
    echo "$compose_file does not exist. Creating a new one..."
    cat > "$compose_file" <<EOL
# Note: This file is auto-generated. Do not manually edit this file.
# To update this file add a new service by running this script,
# Syntax: ./add-service.sh <service_name>
# Example: ./add-service.sh admins

services:
  $service:
    path: $service_path
    
EOL
    echo "$compose_file created with $service."
  fi
}

# Function to create a new service with boilerplate files
create_service() {
  local service="$1"
  local service_dir="services/$service"

  # Create service directory structure
  mkdir -p "$service_dir/src/handlers"
  mkdir -p "$service_dir/src/utils"
  mkdir -p "$service_dir/docs"

  # Add serverless.yml
  cat > "$service_dir/serverless.yml" <<EOL
service: $service
frameworkVersion: "3"
useDotenv: true
deprecationNotificationMode: error
disabledDeprecations:
  - UNSUPPORTED_CLI_OPTIONS
  - CLI_OPTIONS_SCHEMA_V3
  - CONFIG_VALIDATION_MODE_DEFAULT_V3

provider:
  name: aws
  runtime: nodejs20.x
  layers:
    - \${ssm:KKA_NODE_LAYER}
  stage: \${opt:stage, 'dev'}
  region: \${env:REGION}
  versionFunctions: false

  environment:
    REGION: \${env:REGION}
    DEBUG: \${env:DEBUG}
    STAGE: \${self:provider.stage}

  iam:
    role:
      statements:
        - Effect: Allow
          Action:
          - cognito-idp:*
          Resource: "*"

# Lambda Functions
functions:
  # Create
  create:
    handler: dist/handlers/create.handler
    events:
      - http:
          path: /
          method: post
          cors: true
          authorizer:
            arn: \${ssm:KKA_COGNITO_AUTH_ARN}

package:
  patterns:
    - dist/**             # Include only compiled JS files
    - templates/**        # Include html templates
    - "!node_modules/**"  # Exclude dependencies
    - "!lib/**"           # Exclude raw TypeScript files in lib
    - "!entities/**"      # Exclude raw TypeScript files in entities
    - "!.git/**"          # Exclude Git metadata
    - "!docs/**"          # Exclude documentation
    - "!**/*.ts"          # Exclude all TypeScript files
    - "!tsconfig.json"    # Exclude tsconfig.json

custom:
  scripts:
    hooks:
      package:initialize: bash -c "cd ../../ && chmod +x pre-deploy.sh && ./pre-deploy.sh ${self:service}"
      before:offline:start: bash -c "cd ../../ && chmod +x pre-deploy.sh && ./pre-deploy.sh ${self:service}"

  customDomain:
    rest:
      domainName: ${ssm:KKA_DOMAIN_NAME}
      stage: ${opt:stage, self:provider.stage}
      basePath: ${self:service}
      certificateName: ${ssm:KKA_DOMAIN_CERTIFICATE}
      createRoute53Record: false
      securityPolicy: tls_1_2
      endpointType: REGIONAL

plugins:
  - serverless-offline
  - serverless-domain-manager
  - serverless-plugin-scripts
EOL

  # Add docs/swagger.json
  cat > "$service_dir/docs/$service-swagger.json" <<EOL
{
  "openapi": "3.0.3",
  "info": {
    "title": "KKA Backend APIs",
    "description": "KKA API Documentation",
    "version": "1.0.11"
  },
  "servers": [
    {
      "url": "https://apis.dev.kka.net/$service"
    }
  ],
  "tags": [
    {
      "name": "Tag Here",
      "description": "Description Here",
      "externalDocs": {
        "description": "KKA (Service Name Here)",
        "url": "https://dev.kka.net/"
      }
    }
  ],
  "paths": {
    "/": {
    }
  },
  "components": {
    "schemas": {
    },
    "securitySchemes": {
      "api_key": {
        "type": "apiKey",
        "name": "Authorization",
        "in": "header",
        "description": "Bearer Token"
      }
    }
  }
}
EOL

  # Add .env
  cat > "$service_dir/.env" <<EOL
# Environment variables for $service
SERVICE_NAME=$service
REGION=ap-south-1
DEBUG=true
EOL

  # Add handlers/handler.ts
  cat > "$service_dir/src/handlers/handler.ts" <<EOL
// handlers/handler.ts
import { addNumbers } from '@utils/util';

export const hello = async () => {
  const num1 = 10;
  const num2 = 20;
  const result = addNumbers(num1, num2);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "calculated" }),
  };
};
EOL

  # Add utils/util.ts
  cat > "$service_dir/src/utils/util.ts" <<EOL
// utils/util.ts
export const addNumbers = (a: number, b: number): number => {
  return a + b;
};
EOL

  # Add tsconfig.json
  cat > "$service_dir/tsconfig.json" <<EOL
{
  "compilerOptions": {
    "outDir": "./dist", // Root output directory
    "resolveJsonModule": true, // Allow importing JSON files
    "module": "CommonJS",
    "target": "ES2020",
    "strict": true,
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@lib/*": ["../../lib/src/*"],
      "@handlers/*": ["src/handlers/*"],
      "@utils/*": ["src/utils/*"]
    },
    "skipLibCheck": true, // Skip type checking for 'lib'
    "incremental": true,  // Enables incremental compilation
    "esModuleInterop": true // Enables compatibility with CommonJS modules
  },
  "include": ["src/handlers/**/*.ts", "src/utils/**/*.ts", "src/lib/**/*.ts", "src/entities/*.ts"],
  "exclude": ["node_modules"]
}

EOL

  echo "Service '$service' created with default files and configuration." 

  # Update the serverless-compose.yml file
  update_serverless_compose "$service"
}

# Main Login - Accepts Arguments and Creates New Service
if [ -z "$1" ]; then
  echo "Please specify a service name."
else
  # Check if the service already exists
  check_service_exists "$1"
  # Proceed to create new service
  echo "Creating service with arguments: $1"
  create_service "$1"
fi