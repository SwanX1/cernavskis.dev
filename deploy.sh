#!/bin/sh
# This script is run without arguments, in the root directory of the project.
# It has administrative privileges.

SERVICE_NAME="webapp"
SERVICE_USER="deployment"
SERVICE_PATH_DEFAULT="/var/www/$SERVICE_NAME"

# Check if the script is run as root
if [ "$(id -u)" -eq 0 ]; then
  echo "This script must not be run as root."
  exit 1
fi

# Check if bun is installed
if [ -z $(command -v bun) ]; then
  echo "bun is not installed. Please install it first."
  exit 1
fi

# Check if screen is installed
if [ -z $(command -v screen) ]; then
  echo "screen is not installed. Please install it first."
  exit 1
fi

# Find service path
if [ ! -f "~/.service_paths" ]; then
  touch ~/.service_paths
fi

SERVICE_PATH=$(cat ~/.service_paths | grep $SERVICE_NAME | cut -d' ' -f2)

if [ -z "$SERVICE_PATH" ]; then
  SERVICE_PATH=$SERVICE_PATH_DEFAULT
  echo "$SERVICE_NAME $SERVICE_PATH" >> ~/.service_paths
fi

# Clone the repository
if [ ! -d "$SERVICE_PATH" ]; then
  git clone -v --depth=1 https://github.com/SwanX1/cernavskis.dev.git $SERVICE_PATH
fi

cd $SERVICE_PATH

# Checkout the latest commit on main
git config advice.detachedHead false
git fetch origin -v
git checkout origin/main --force
git clean -fdxe .env

# Install the dependencies
bun install --verbose --production

if [ ! -z "$(screen -ls $SERVICE_NAME | grep $SERVICE_NAME)" ]; then
  echo "Service is already running, stopping it."
  screen -S $SERVICE_NAME -X quit
fi

echo "Starting the service."
screen -dmqS $SERVICE_NAME bun .