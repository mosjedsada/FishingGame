#!/bin/bash

# Fishing Game - Deploy Script
# This script helps deploy the app to App Store using Fastlane

echo "🎣 Fishing Game - Deploy to App Store"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Fastlane is installed
if ! command -v fastlane &> /dev/null; then
    echo "📦 Installing Fastlane..."
    gem install fastlane
fi

# Check if we have the required files
if [ ! -f "fastlane/Fastfile" ]; then
    echo "❌ Error: Fastlane configuration not found"
    exit 1
fi

echo "🔧 Setting up Fastlane..."

# Install dependencies
if [ -f "Gemfile" ]; then
    echo "📦 Installing Ruby dependencies..."
    bundle install
fi

echo "🚀 Starting deployment process..."

# Choose deployment type
echo "Select deployment type:"
echo "1) Build and upload to TestFlight (Beta)"
echo "2) Build and upload to App Store (Production)"
echo "3) Upload metadata only"
echo "4) Submit for review"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🧪 Deploying to TestFlight..."
        fastlane beta
        ;;
    2)
        echo "🏪 Deploying to App Store..."
        fastlane release
        ;;
    3)
        echo "📝 Uploading metadata..."
        fastlane metadata
        ;;
    4)
        echo "📋 Submitting for review..."
        fastlane submit
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "✅ Deployment process completed!"
echo "📱 Check App Store Connect for your app status"
