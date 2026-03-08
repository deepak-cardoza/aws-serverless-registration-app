
#!/bin/bash

set -e  # Stop on first error

# Accept service name as an argument
SERVICE_NAME="$1"

if [ -z "$SERVICE_NAME" ]; then
  echo "Error: No service name provided."
  echo "Usage: ./pre-deploy.sh <service-name>"
  exit 1
fi

echo "Building service before deployment - Running ts-build.sh"
echo "Current directory: $(pwd)"

chmod +x ts-build.sh
./ts-build.sh "$SERVICE_NAME"
echo "Build completed for $SERVICE_NAME"
