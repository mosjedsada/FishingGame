# 🎣 Fishing Game - App Store Deployment Guide

## 📋 Prerequisites

Before deploying to App Store, make sure you have:

1. **Apple Developer Account** - Active paid membership
2. **App Store Connect Access** - Admin or App Manager role
3. **Xcode** - Latest version installed
4. **Fastlane** - Installed and configured
5. **Certificates & Provisioning Profiles** - Valid for App Store distribution

## 🚀 Quick Start

### 1. Configure App Information

Edit the following files with your actual information:

```bash
# Update Appfile with your details
fastlane/Appfile
- app_identifier: "com.yourcompany.fishinggame"
- apple_id: "your-email@example.com"
- team_id: "YOUR_TEAM_ID"
- team_name: "Your Team Name"
```

### 2. Update Fastfile

Edit `fastlane/Fastfile` and replace:
- `YOUR_TEAM_ID` with your actual Apple Team ID

### 3. Run Deployment

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 🛠️ Manual Deployment Steps

### Option 1: TestFlight (Beta Testing)

```bash
fastlane beta
```

### Option 2: App Store (Production)

```bash
fastlane release
```

### Option 3: Metadata Only

```bash
fastlane metadata
```

### Option 4: Submit for Review

```bash
fastlane submit
```

## 📱 Supported Languages

The app supports multiple languages:

- 🇺🇸 **English** - Primary language
- 🇹🇭 **Thai** - ภาษาไทย
- 🇷🇺 **Russian** - Русский язык

## 📁 File Structure

```
fastlane/
├── Fastfile                 # Main Fastlane configuration
├── Appfile                 # App information
├── metadata/
│   ├── en-US/             # English metadata
│   ├── th/                # Thai metadata
│   └── ru/                # Russian metadata
└── screenshots/           # App screenshots (add your own)
    ├── en-US/
    ├── th/
    └── ru/
```

## 🔧 Configuration

### App Information

Update these files with your app details:

1. **Appfile** - Basic app information
2. **Fastfile** - Build and deployment settings
3. **Metadata files** - App Store descriptions

### Required Information

- Bundle Identifier: `com.yourcompany.fishinggame`
- App Name: "Fishing Game - Catch Fish & Level Up"
- Team ID: Your Apple Developer Team ID
- Apple ID: Your Apple Developer account email

## 📸 Screenshots

Add your app screenshots to:
- `fastlane/screenshots/en-US/`
- `fastlane/screenshots/th/`
- `fastlane/screenshots/ru/`

Required sizes:
- iPhone 6.7" (1290 x 2796)
- iPhone 6.5" (1242 x 2688)
- iPhone 5.5" (1242 x 2208)

## 🎯 Deployment Checklist

- [ ] Apple Developer Account active
- [ ] App Store Connect access
- [ ] Certificates and provisioning profiles
- [ ] App information configured
- [ ] Screenshots added
- [ ] Metadata in all languages
- [ ] Build tested on device
- [ ] App Store Connect app created

## 🚨 Troubleshooting

### Common Issues

1. **Certificate Issues**
   ```bash
   fastlane match nuke distribution
   fastlane match development
   ```

2. **Provisioning Profile Issues**
   ```bash
   fastlane match nuke provisioning
   fastlane match development
   ```

3. **Build Issues**
   - Check Xcode version
   - Clean build folder
   - Update dependencies

### Getting Help

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

## 📞 Support

If you encounter issues:

1. Check the logs in `fastlane/logs/`
2. Verify your Apple Developer account status
3. Ensure all certificates are valid
4. Check App Store Connect for app status

---

**Happy Fishing! 🎣**
