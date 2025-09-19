# 🛒 Magento E-commerce Integration Guide

This guide explains how to use the newly integrated Magento e-commerce functionality in your Fishing Game.

## 📦 What's Been Added

### New Packages Installed
- `react-native-magento@2.0.0` - Main e-commerce library
- `react-native-device-info@14.1.1` - Device information
- `react-native-keychain@10.0.0` - Secure credential storage
- `react-native-netinfo@1.1.0` - Network connectivity monitoring

### New Files Created
- `MagentoIntegration.js` - Core integration service
- `components/MagentoShop.js` - Shopping UI component
- `magento-config.example.js` - Configuration template
- `magento-test.js` - Testing utilities

### Modified Files
- `App.js` - Added Magento shop button (🏪) and integration
- `package.json` - Updated with new dependencies
- `README.md` - Added e-commerce documentation

## 🚀 Quick Start

### 1. Configure Your Store
```bash
# Copy the configuration template
cp magento-config.example.js magento-config.js

# Edit magento-config.js with your store details:
# - baseUrl: Your Magento store URL
# - headers: API authentication headers
# - categories: Your product category IDs
# - specialProducts: Your product SKUs
```

### 2. Test the Integration
```bash
# Run the test script (optional)
node magento-test.js
```

### 3. Start the App
```bash
# Start your app as usual
expo start
```

### 4. Access the Store
- Launch your app
- Tap the 🏪 (store) button in the top-right corner
- Browse products, login, and test purchases!

## 🎮 Game Integration Features

### 🪙 Coin Conversion
- Convert in-game coins to store credit
- Default rate: 100 game coins = $1.00 store credit
- Configurable in `magento-config.js`

### 🏆 Achievement Rewards
- Automatic discount coupons for game achievements
- Level-based rewards (Level 10 = 10% discount)
- Special fish catches earn bonus discounts

### 📦 Smart Product Recommendations
- **Level 1-9**: Beginner fishing equipment
- **Level 10-19**: Intermediate gear
- **Level 20-29**: Advanced equipment
- **Level 30+**: Professional fishing gear

### 🛒 Shopping Features
- **Product Catalog**: Browse fishing equipment
- **Shopping Cart**: Add/remove items
- **User Accounts**: Login/register/logout
- **Order History**: View past purchases
- **Wishlist**: Save items for later

## 🔧 Configuration Options

### Store Connection
```javascript
// In magento-config.js
export const MAGENTO_CONFIG = {
  baseUrl: 'https://your-store.com',
  headers: {
    'Content-Type': 'application/json',
    'X-Store-Code': 'default',
    // Add authentication headers if needed
  },
  supportedLanguages: ['en', 'th', 'ru'],
};
```

### Game Integration Settings
```javascript
gameIntegration: {
  coinToStoreCredit: 0.01, // 1 coin = $0.01
  achievementDiscounts: {
    firstCatch: 5,      // 5% discount
    level10: 10,        // 10% discount
    level20: 15,        // 15% discount
    specialFishCaught: 25, // 25% discount
  }
}
```

## 🛠️ API Methods Available

### Authentication
```javascript
import { magentoService } from './MagentoIntegration';

// Login
await magentoService.login('email@example.com', 'password');

// Register
await magentoService.register({
  email: 'new@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Logout
await magentoService.logout();
```

### Products
```javascript
// Get all products
const products = await magentoService.getProducts();

// Search products
const results = await magentoService.searchProducts('fishing rod');

// Get fishing equipment
const equipment = await magentoService.getFishingEquipment();

// Get recommendations by player level
const recommended = await magentoService.getRecommendedEquipment(playerLevel);
```

### Shopping Cart
```javascript
// Get cart
const cart = await magentoService.getCart();

// Add to cart
await magentoService.addToCart('FISHING_ROD_001', 1);

// Remove from cart
await magentoService.removeFromCart(itemId);
```

### Game Integration
```javascript
// Convert game coins to store credit
const credit = await magentoService.convertCoinsToStoreCredit(gameCoins);

// Generate achievement reward coupon
const coupon = await magentoService.rewardPlayerWithCoupon('level_10', 10);
```

## 🎨 UI Components

### MagentoShop Component
```javascript
<MagentoShop
  visible={showMagentoShop}
  onClose={() => setShowMagentoShop(false)}
  playerLevel={level}
  gameCoins={coins}
  onPurchase={(product) => {
    // Handle successful purchase
    console.log('Purchased:', product.name);
  }}
/>
```

### Features:
- **Products Tab**: Browse and add items to cart
- **Cart Tab**: Manage shopping cart items
- **Profile Tab**: Login/logout, convert coins, view stats

## 🔍 Testing & Debugging

### Test with Demo Store
```javascript
// Use demo configuration for testing
const DEMO_CONFIG = {
  baseUrl: 'https://demo.magento.com',
  // ... other settings
};
```

### Debug Network Issues
```javascript
// Check online status
console.log('Online:', magentoService.isOnline);

// Add connectivity listener
magentoService.addConnectivityListener((isOnline) => {
  console.log('Network changed:', isOnline);
});
```

### Test Offline Features
```javascript
// Get cached products
const cached = await magentoService.getCachedProducts();
console.log('Cached items:', cached.length);
```

## 🚨 Troubleshooting

### Common Issues

**1. Store Connection Failed**
- Check your `baseUrl` in configuration
- Verify network connectivity
- Check CORS settings on your Magento store

**2. Authentication Errors**
- Verify customer credentials
- Check API permissions in Magento admin
- Ensure customer account is active

**3. Product Loading Issues**
- Check category IDs in configuration
- Verify products exist and are enabled
- Check product visibility settings

**4. Cart/Checkout Problems**
- Ensure customer is logged in
- Check product inventory levels
- Verify customer has valid address

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
// All API calls will be logged to console
```

## 📚 Documentation Links

- [react-native-magento NPM Package](https://www.npmjs.com/package/react-native-magento)
- [Magento REST API Documentation](https://devdocs.magento.com/guides/v2.4/rest/bk-rest.html)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 🆘 Support

If you encounter issues:

1. Check the console for error messages
2. Verify your Magento store configuration
3. Test with the provided demo configuration
4. Review the example files for proper usage

## 🎉 Success!

Your Fishing Game now has full e-commerce capabilities! Players can:
- Purchase real fishing equipment
- Convert game achievements to store rewards
- Access a complete shopping experience
- Sync progress between game and store

Happy fishing and shopping! 🎣🛒
