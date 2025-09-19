/**
 * Magento Integration Test Script
 * Run this script to test the Magento integration without running the full app
 * 
 * Usage: node magento-test.js
 */

import { magentoService } from './MagentoIntegration.js';

// Test configuration (using demo store)
const testConfig = {
  baseUrl: 'https://demo.magento.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  supportedLanguages: ['en'],
  connectionTimeout: 10000,
  receiveTimeout: 10000,
};

async function runTests() {
  console.log('🧪 Starting Magento Integration Tests...\n');

  try {
    // Test 1: Initialize Magento
    console.log('1️⃣  Testing Magento Initialization...');
    const initialized = await magentoService.initialize(testConfig);
    
    if (initialized) {
      console.log('✅ Magento initialized successfully');
    } else {
      console.log('❌ Failed to initialize Magento');
      return;
    }

    // Test 2: Check network connectivity
    console.log('\n2️⃣  Testing Network Connectivity...');
    const isOnline = magentoService.isOnline;
    console.log(`📡 Network status: ${isOnline ? 'Online' : 'Offline'}`);

    // Test 3: Test localization
    console.log('\n3️⃣  Testing Localization...');
    try {
      await magentoService.setLocale('en');
      console.log('✅ Locale set to English');
      
      const currency = magentoService.formatCurrency(99.99, 'USD');
      console.log(`💰 Formatted currency: ${currency}`);
      
      const date = magentoService.formatDate(new Date());
      console.log(`📅 Formatted date: ${date}`);
    } catch (error) {
      console.log('⚠️  Localization test failed:', error.message);
    }

    // Test 4: Test products (might fail with demo store)
    console.log('\n4️⃣  Testing Product Loading...');
    try {
      const products = await magentoService.getProducts({
        page: 1,
        pageSize: 5,
      });
      console.log(`✅ Loaded ${products?.length || 0} products`);
      
      if (products && products.length > 0) {
        console.log('📦 First product:', products[0].name || 'Unnamed product');
      }
    } catch (error) {
      console.log('⚠️  Product loading test failed:', error.message);
      console.log('   This is expected with demo store - use your real store URL');
    }

    // Test 5: Test search (might fail with demo store)
    console.log('\n5️⃣  Testing Product Search...');
    try {
      const searchResults = await magentoService.searchProducts('fishing', {
        pageSize: 3
      });
      console.log(`🔍 Found ${searchResults?.length || 0} search results`);
    } catch (error) {
      console.log('⚠️  Search test failed:', error.message);
      console.log('   This is expected with demo store - use your real store URL');
    }

    // Test 6: Test game integration methods
    console.log('\n6️⃣  Testing Game Integration...');
    
    // Test coin conversion
    const storeCredit = await magentoService.convertCoinsToStoreCredit(1000, 0.01);
    console.log(`🪙 1000 game coins = $${storeCredit} store credit`);
    
    // Test coupon generation
    const coupon = await magentoService.rewardPlayerWithCoupon('first_catch', 10);
    console.log(`🎟️  Generated coupon: ${coupon}`);
    
    // Test equipment recommendations
    console.log('\n📋 Equipment recommendations by level:');
    for (let level of [1, 10, 20, 30]) {
      try {
        const recommended = await magentoService.getRecommendedEquipment(level);
        console.log(`   Level ${level}: ${recommended?.length || 0} recommended items`);
      } catch (error) {
        console.log(`   Level ${level}: Failed to load recommendations`);
      }
    }

    // Test 7: Test offline capabilities
    console.log('\n7️⃣  Testing Offline Capabilities...');
    try {
      const cachedProducts = await magentoService.getCachedProducts();
      console.log(`💾 Cached products: ${cachedProducts?.length || 0}`);
    } catch (error) {
      console.log('⚠️  Offline test failed:', error.message);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Replace demo URL with your real Magento store URL');
    console.log('   2. Configure category IDs and product SKUs');
    console.log('   3. Set up authentication if required');
    console.log('   4. Test with real products and customers');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Helper function to test authentication (requires real credentials)
async function testAuthentication() {
  console.log('\n🔐 Authentication Test (Optional)');
  console.log('To test authentication, uncomment and modify the code below:');
  console.log(`
  // try {
  //   const loginResult = await magentoService.login('test@example.com', 'password123');
  //   console.log('✅ Login successful:', loginResult);
  //   
  //   const customer = magentoService.getCurrentCustomer();
  //   console.log('👤 Current customer:', customer);
  //   
  //   await magentoService.logout();
  //   console.log('✅ Logout successful');
  // } catch (error) {
  //   console.log('❌ Authentication test failed:', error.message);
  // }
  `);
}

// Run the tests
if (typeof require !== 'undefined' && require.main === module) {
  runTests()
    .then(() => testAuthentication())
    .catch(console.error);
}

export { runTests, testAuthentication };
