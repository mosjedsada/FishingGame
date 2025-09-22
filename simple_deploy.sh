#!/bin/bash

# Fishing Game - Simple Deploy Script
echo "🎣 Fishing Game - Simple Deploy to App Store"
echo "============================================="

echo "📋 Before proceeding, please make sure you have:"
echo "1. Apple Developer Account"
echo "2. App Store Connect access"
echo "3. Valid certificates and provisioning profiles"
echo ""

echo "🔧 Current configuration:"
echo "Bundle ID: $(grep 'app_identifier' fastlane/Appfile | cut -d'"' -f2)"
echo "Apple ID: $(grep 'apple_id' fastlane/Appfile | cut -d'"' -f2)"
echo "Team ID: $(grep 'team_id' fastlane/Appfile | cut -d'"' -f2)"
echo ""

echo "⚠️  IMPORTANT: Please update the following files with your actual information:"
echo "1. fastlane/Appfile - Update Apple ID, Team ID, Bundle ID"
echo "2. fastlane/Fastfile - Update Team ID in build settings"
echo ""

read -p "Have you updated the configuration files? (y/n): " updated

if [ "$updated" != "y" ]; then
    echo "❌ Please update the configuration files first"
    echo "Run: ./setup_appstore.sh to help with configuration"
    exit 1
fi

echo ""
echo "🚀 Starting deployment process..."
echo ""

echo "Select deployment type:"
echo "1) Upload metadata only (recommended first step)"
echo "2) Build and upload to TestFlight (Beta)"
echo "3) Build and upload to App Store (Production)"
echo "4) Submit for review"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "📝 Uploading metadata..."
        fastlane ios metadata
        ;;
    2)
        echo "🧪 Deploying to TestFlight..."
        fastlane ios beta
        ;;
    3)
        echo "🏪 Deploying to App Store..."
        fastlane ios release
        ;;
    4)
        echo "📋 Submitting for review..."
        fastlane ios submit
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo "📱 Check App Store Connect for your app status"
echo ""
echo "🔍 Useful commands:"
echo "- fastlane ios lanes - Show all available lanes"
echo "- fastlane ios metadata - Upload metadata only"
echo "- fastlane ios beta - Deploy to TestFlight"
echo "- fastlane ios release - Deploy to App Store"
echo "- fastlane ios submit - Submit for review"
