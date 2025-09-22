# 🎣 Fishing Game - App Store Setup Guide

## ✅ Fastlane Configuration Complete!

การตั้งค่า Fastlane เสร็จสิ้นแล้ว! ตอนนี้คุณต้องทำขั้นตอนต่อไปนี้:

## 📱 Step 1: Create App in App Store Connect

### 1.1 ไปที่ App Store Connect
- เปิด [App Store Connect](https://appstoreconnect.apple.com)
- เข้าสู่ระบบด้วย Apple Developer account

### 1.2 สร้างแอปใหม่
1. กดปุ่ม **"My Apps"**
2. กดปุ่ม **"+"** และเลือก **"New App"**
3. กรอกข้อมูล:
   - **Platform**: iOS
   - **Name**: Fishing Game - Catch Fish & Level Up
   - **Primary Language**: English
   - **Bundle ID**: net.nativemind.fishinggame (หรือ Bundle ID ของคุณ)
   - **SKU**: fishing-game-2024 (หรือ SKU ที่คุณต้องการ)

### 1.3 ตั้งค่าข้อมูลแอป
- **App Information**: กรอกข้อมูลพื้นฐาน
- **Pricing**: ตั้งราคา (Free หรือ Paid)
- **Availability**: เลือกประเทศที่ต้องการ

## 🔧 Step 2: Update Configuration

### 2.1 อัพเดท Appfile
แก้ไขไฟล์ `fastlane/Appfile`:
```ruby
app_identifier("net.nativemind.fishinggame") # Bundle ID ของคุณ
apple_id("your-email@example.com") # Apple ID ของคุณ
team_id("120374799") # Team ID ของคุณ
```

### 2.2 อัพเดท Fastfile
แก้ไขไฟล์ `fastlane/Fastfile`:
```ruby
teamID: "120374799" # Team ID ของคุณ
```

## 🚀 Step 3: Deploy

### 3.1 อัพโหลด Metadata
```bash
fastlane ios metadata
```

### 3.2 สร้าง Build และอัพโหลด
```bash
# สำหรับ TestFlight
fastlane ios beta

# สำหรับ App Store
fastlane ios release
```

### 3.3 ส่งให้ Apple Review
```bash
fastlane ios submit
```

## 📸 Step 4: Add Screenshots

เพิ่ม screenshots ใน:
- `fastlane/screenshots/en-US/`
- `fastlane/screenshots/th/`
- `fastlane/screenshots/ru/`

**ขนาดที่ต้องการ:**
- iPhone 6.7" (1290 x 2796)
- iPhone 6.5" (1242 x 2688)
- iPhone 5.5" (1242 x 2208)

## 🌍 Multi-language Support

แอปรองรับ 3 ภาษา:
- 🇺🇸 **English** - ภาษาอังกฤษ
- 🇹🇭 **Thai** - ภาษาไทย
- 🇷🇺 **Russian** - ภาษารัสเซีย

## 🔍 Troubleshooting

### ปัญหาที่พบบ่อย:

1. **"Could not find app"**
   - ตรวจสอบ Bundle ID ใน App Store Connect
   - ตรวจสอบ Team ID

2. **Certificate Issues**
   - ตรวจสอบ certificates ใน Keychain
   - ใช้ Xcode เพื่อสร้าง certificates ใหม่

3. **Provisioning Profile Issues**
   - ตรวจสอบ provisioning profiles
   - สร้างใหม่ใน Apple Developer Portal

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ logs ใน `fastlane/logs/`
2. ตรวจสอบ App Store Connect
3. ตรวจสอบ Apple Developer Portal

---

**🎣 Happy Fishing! เกมตกปลาของคุณพร้อมเผยแพร่แล้ว!**
