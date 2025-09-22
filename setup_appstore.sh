#!/bin/bash

# Fishing Game - App Store Setup Script
echo "🎣 Fishing Game - App Store Setup"
echo "=================================="

echo "📋 Before proceeding, please prepare the following information:"
echo ""
echo "1. Apple Developer Account email"
echo "2. Apple Team ID (found in Apple Developer Portal)"
echo "3. Team Name"
echo "4. Bundle Identifier (e.g., com.yourcompany.fishinggame)"
echo ""

read -p "Enter your Apple Developer email: " apple_email
read -p "Enter your Apple Team ID: " team_id
read -p "Enter your Team Name: " team_name
read -p "Enter Bundle Identifier (e.g., com.yourcompany.fishinggame): " bundle_id

echo ""
echo "🔧 Updating configuration files..."

# Update Appfile
sed -i.bak "s/your-email@example.com/$apple_email/g" fastlane/Appfile
sed -i.bak "s/YOUR_TEAM_ID/$team_id/g" fastlane/Appfile
sed -i.bak "s/Your Team Name/$team_name/g" fastlane/Appfile
sed -i.bak "s/com.yourcompany.fishinggame/$bundle_id/g" fastlane/Appfile

# Update Fastfile
sed -i.bak "s/YOUR_TEAM_ID/$team_id/g" fastlane/Fastfile

echo "✅ Configuration updated!"
echo ""
echo "📱 Next steps:"
echo "1. Make sure you have valid certificates and provisioning profiles"
echo "2. Add screenshots to fastlane/screenshots/ directories"
echo "3. Run: ./deploy.sh"
echo ""
echo "🔍 To check your certificates:"
echo "fastlane match list"
echo ""
echo "🔍 To check your provisioning profiles:"
echo "fastlane match list"
