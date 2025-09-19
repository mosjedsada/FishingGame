/**
 * Magento Configuration Example
 * Copy this file to magento-config.js and update with your store details
 */

export const MAGENTO_CONFIG = {
  // Your Magento store URL (required)
  baseUrl: 'https://your-magento-store.com',
  
  // API headers (optional)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Store-Code': 'default', // Your store code
    // 'Authorization': 'Bearer your-api-token', // If using token authentication
  },
  
  // Supported languages for localization
  supportedLanguages: ['en', 'th', 'ru', 'de', 'fr', 'es', 'ja', 'ko'],
  
  // Timeout settings (optional)
  connectionTimeout: 30000, // 30 seconds
  receiveTimeout: 30000,    // 30 seconds
  
  // Store-specific settings
  storeSettings: {
    // Currency code
    defaultCurrency: 'USD',
    
    // Category IDs for fishing equipment (replace with your actual category IDs)
    categories: {
      beginnerFishing: '123',
      intermediateFishing: '124', 
      advancedFishing: '125',
      professionalFishing: '126',
      fishingAccessories: '127',
    },
    
    // Product SKUs for special items (replace with your actual SKUs)
    specialProducts: {
      basicRod: 'FISHING_ROD_BASIC',
      advancedRod: 'FISHING_ROD_ADVANCED',
      professionalRod: 'FISHING_ROD_PRO',
      basicBait: 'FISHING_BAIT_BASIC',
      premiumBait: 'FISHING_BAIT_PREMIUM',
      fishingLine: 'FISHING_LINE_STRONG',
      tackle: 'FISHING_TACKLE_SET',
    }
  },
  
  // Game integration settings
  gameIntegration: {
    // Conversion rate from game coins to store credit
    coinToStoreCredit: 0.01, // 1 game coin = $0.01 store credit
    
    // Discount percentages for achievements
    achievementDiscounts: {
      firstCatch: 5,      // 5% discount
      level10: 10,        // 10% discount  
      level20: 15,        // 15% discount
      level30: 20,        // 20% discount
      specialFishCaught: 25, // 25% discount
    },
    
    // Level-based product recommendations
    levelRecommendations: {
      1: 'beginnerFishing',
      10: 'intermediateFishing', 
      20: 'advancedFishing',
      30: 'professionalFishing',
    }
  }
};

// Demo/Testing Configuration (works without real Magento store)
export const DEMO_CONFIG = {
  baseUrl: 'https://demo.magento.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  supportedLanguages: ['en'],
  connectionTimeout: 10000,
  receiveTimeout: 10000,
};

// Development Configuration
export const DEV_CONFIG = {
  baseUrl: 'http://localhost:8080', // Local Magento development server
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Store-Code': 'default',
  },
  supportedLanguages: ['en'],
  connectionTimeout: 15000,
  receiveTimeout: 15000,
};
