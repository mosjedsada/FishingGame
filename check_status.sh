#!/bin/bash

# Fishing Game - Status Check Script
echo "🎣 Fishing Game - Status Check"
echo "=============================="

echo "🔍 Checking Fastlane configuration..."

# Check if Fastlane files exist
if [ -f "fastlane/Fastfile" ] && [ -f "fastlane/Appfile" ]; then
    echo "✅ Fastlane configuration found"
else
    echo "❌ Fastlane configuration missing"
    exit 1
fi

# Check if metadata exists
if [ -d "fastlane/metadata" ]; then
    echo "✅ Metadata files found"
    echo "📁 Available languages:"
    ls fastlane/metadata/
else
    echo "❌ Metadata directory missing"
fi

# Check if screenshots directory exists
if [ -d "fastlane/screenshots" ]; then
    echo "✅ Screenshots directory found"
    echo "📁 Available screenshot languages:"
    ls fastlane/screenshots/
else
    echo "⚠️  Screenshots directory missing - you may want to add screenshots"
fi

echo ""
echo "🔧 Checking Apple Developer setup..."

# Check if we can access App Store Connect
echo "🔍 Testing App Store Connect access..."
if fastlane spaceship --version > /dev/null 2>&1; then
    echo "✅ Spaceship (App Store Connect API) available"
else
    echo "⚠️  Spaceship not available - may need to install"
fi

echo ""
echo "📋 Configuration Summary:"
echo "========================="

# Show current configuration
echo "📱 App Information:"
if [ -f "fastlane/Appfile" ]; then
    echo "Bundle ID: $(grep 'app_identifier' fastlane/Appfile | cut -d'"' -f2)"
    echo "App Name: $(grep 'app_name' fastlane/Appfile | cut -d'"' -f2)"
    echo "Apple ID: $(grep 'apple_id' fastlane/Appfile | cut -d'"' -f2)"
    echo "Team ID: $(grep 'team_id' fastlane/Appfile | cut -d'"' -f2)"
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Available commands:"
echo "1. ./deploy.sh - Interactive deployment"
echo "2. fastlane beta - Deploy to TestFlight"
echo "3. fastlane release - Deploy to App Store"
echo "4. fastlane metadata - Upload metadata only"
echo "5. fastlane submit - Submit for review"
