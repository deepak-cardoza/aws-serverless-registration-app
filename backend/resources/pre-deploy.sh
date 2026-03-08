#!/bin/bash

set -e  # Stop on first error

echo "Current directory before CD: $(pwd)"
cd ./nodejs
echo "Current directory after CD: $(pwd)"
echo "Starting npm install"
rm -f package-lock.json
npm install --omit=dev --no-save
echo "Node modules installed successfully"
cd ..
