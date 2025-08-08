#!/bin/bash
# Build script for Render deployment

echo "Installing yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp
mv yt-dlp /usr/local/bin/yt-dlp

echo "Installing Node.js dependencies..."
npm install

echo "Build completed!"
