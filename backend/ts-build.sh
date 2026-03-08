#!/bin/bash

# Define the source folders and destination name
SOURCE_FOLDER_LIB="lib"
SOURCE_FOLDER_ENTITIES="entities"

# Copying Lib and Entities folders
copy_lib_and_entities() {
  local service_dir=$1
  DESTINATION_NAME="$service_dir/src"
  # Check if the source folders exist
  if [ ! -d "$SOURCE_FOLDER_LIB" ]; then
    echo "Source folder '$SOURCE_FOLDER_LIB' does not exist. Exiting."
    exit 1
  fi

  if [ ! -d "$SOURCE_FOLDER_ENTITIES" ]; then
    echo "Source folder '$SOURCE_FOLDER_ENTITIES' does not exist. Exiting."
    exit 1
  fi

  # Copy the source folders into the service directory
  echo "Copying source folders..."
  echo "Copying from: $SOURCE_FOLDER_LIB -> $DESTINATION_NAME"
  cp -r "$SOURCE_FOLDER_LIB" "$DESTINATION_NAME"
  echo "Copying from: $SOURCE_FOLDER_ENTITIES -> $DESTINATION_NAME"
  cp -r "$SOURCE_FOLDER_ENTITIES" "$DESTINATION_NAME"
}

# Delete Lib and Entities folders
delete_lib_and_entities() {
  local service_dir=$1
  DESTINATION_NAME="$service_dir/src"
  # Delete the copied folders
  echo "Cleaning up..."
  echo "Removing folder: $DESTINATION_NAME/$(basename "$SOURCE_FOLDER_LIB")"
  rm -rf "$DESTINATION_NAME/$(basename "$SOURCE_FOLDER_LIB")"
  echo "Removing folder: $DESTINATION_NAME/$(basename "$SOURCE_FOLDER_ENTITIES")"
  rm -rf "$DESTINATION_NAME/$(basename "$SOURCE_FOLDER_ENTITIES")"
  echo "Cleanup complete. Removed the copied folders."
}

# Build a specific service
build_service() {
  local service=$1
  local service_dir="services/$service"
  local tsconfig="$service_dir/tsconfig.json"

  # Check if tsconfig.json exists
  if [ ! -f "$tsconfig" ]; then
    echo "Skipping $service (no tsconfig.json found)"
    return
  fi

  # Copy lib files and entities before building
  copy_lib_and_entities "$service_dir"

  # Navigate to the service directory and build
  echo "Building $service..."
  (cd "$service_dir" && tsc --project tsconfig.json)
  if [ $? -eq 0 ]; then
    echo "Build successful for $service."
  else
    echo "Build failed for $service."
  fi

  # Copy HTML templates
  if [ -d "$service_dir/src/lib/email-templates" ]; then
    cp -r "$service_dir/src/lib/email-templates" "$service_dir/dist/lib/"
  fi

  # Delete the copied folders
  delete_lib_and_entities "$service_dir"
}

build_resources() {
  local resources_dir="resources"
  local tsconfig="tsconfig.json"

  # Check if tsconfig.json exists
  if [ ! -f "$tsconfig" ]; then
    echo "Skipping resources (no tsconfig.json found)"
    return
  fi

  # Copy lib files and entities before building
  copy_lib_and_entities "$resources_dir"

  # Navigate to the resources directory and build
  echo "Building resources..."
  (cd "$resources_dir" && tsc --project "$tsconfig")
  if [ $? -eq 0 ]; then
    echo "Build successful for resources."
  else
    echo "Build failed for resources."
  fi

  # Delete the copied folders
  delete_lib_and_entities "$resources_dir"
}

# Iterate through all services
build_all_services() {
  for service in services/*; do
    if [ -d "$service" ]; then
      build_service "$(basename "$service")"
    fi
  done
}

# Main logic
if [ "$#" -eq 1 ]; then
  service_name=$1
  if [ "$service_name" = "resources" ]; then
    build_resources
  elif [ -d "services/$service_name" ]; then
    build_service "$service_name"
  else
    echo "Service '$service_name' does not exist under 'services/', and it's not 'resources'."
    exit 1
  fi
else
  echo "Usage: ./ts-build.sh {service_name | resources}"
  exit 1
fi