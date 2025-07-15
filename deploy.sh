#!/bin/bash

# Export NVM directory and load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Get the absolute path to PM2
PM2_PATH="$HOME/.nvm/versions/node/$(nvm current)/bin/pm2"

# Check if pm2 exists at the expected path
if [ ! -f "$PM2_PATH" ]; then
    echo "Error: PM2 not found at $PM2_PATH"
    exit 1
fi

# Navigate to the project directory
cd /home/ubuntu/one-pager-coastal-elements || { echo "Directory not found"; exit 1; }

# Pull the latest changes
echo "Pulling latest changes from Git..."
git reset --hard
git pull

# Build 
rm -rf node_modules/ .next
# Use the node version's npm/yarn
export PATH="$HOME/.nvm/versions/node/$(nvm current)/bin:$PATH"
npm install 
npm run build

# Restart PM2 processes
echo "Restarting PM2 processes..."
$PM2_PATH restart onepager --update-env

echo "Update and PM2 restart completed."
