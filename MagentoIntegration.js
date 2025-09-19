import ReactNativeMagento from 'react-native-magento';

/**
 * Magento Integration for Fishing Game
 * This module provides e-commerce functionality to the fishing game
 */

class MagentoIntegration {
  constructor() {
    this.isInitialized = false;
    this.currentCustomer = null;
  }

  /**
   * Initialize Magento with your store configuration
   */
  async initialize(config = {}) {
    try {
      const defaultConfig = {
        baseUrl: 'https://your-magento-store.com', // Replace with your Magento store URL
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        supportedLanguages: ['en', 'th', 'ru', 'de', 'fr', 'es'],
        connectionTimeout: 30000,
        receiveTimeout: 30000,
        ...config
      };

      const success = await ReactNativeMagento.initialize(defaultConfig);
      
      if (success) {
        this.isInitialized = true;
        console.log('✅ Magento initialized successfully');
        return true;
      } else {
        console.error('❌ Failed to initialize Magento');
        return false;
      }
    } catch (error) {
      console.error('❌ Magento initialization error:', error);
      return false;
    }
  }

  /**
   * Customer Authentication
   */
  async login(email, password, rememberMe = true) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const result = await ReactNativeMagento.login(email, password, rememberMe);
      this.currentCustomer = result;
      console.log('✅ Customer logged in:', result);
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async register(customerData) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const customer = await ReactNativeMagento.register(customerData);
      console.log('✅ Customer registered:', customer);
      return customer;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await ReactNativeMagento.logout();
      this.currentCustomer = null;
      console.log('✅ Customer logged out');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }

  getCurrentCustomer() {
    return ReactNativeMagento.currentCustomer || this.currentCustomer;
  }

  /**
   * Product Management - For selling fishing equipment
   */
  async getProducts(filters = {}) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const defaultFilters = {
        page: 1,
        pageSize: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        ...filters
      };

      const products = await ReactNativeMagento.getProducts(defaultFilters);
      console.log('✅ Products loaded:', products?.length || 0);
      return products;
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      throw error;
    }
  }

  async getFishingEquipment() {
    return this.getProducts({
      searchQuery: 'fishing',
      categoryId: 'fishing-equipment', // Replace with your category ID
      pageSize: 50
    });
  }

  async getProduct(sku) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const product = await ReactNativeMagento.getProduct(sku);
      console.log('✅ Product loaded:', product?.name);
      return product;
    } catch (error) {
      console.error('❌ Failed to load product:', error);
      throw error;
    }
  }

  async searchProducts(query, filters = {}) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const results = await ReactNativeMagento.searchProducts(query, {
        page: 1,
        pageSize: 20,
        ...filters
      });
      console.log('✅ Search results:', results?.length || 0);
      return results;
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  /**
   * Shopping Cart Management
   */
  async getCart() {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const cart = await ReactNativeMagento.getCart();
      console.log('✅ Cart loaded:', cart?.items?.length || 0, 'items');
      return cart;
    } catch (error) {
      console.error('❌ Failed to load cart:', error);
      throw error;
    }
  }

  async addToCart(sku, quantity = 1, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const success = await ReactNativeMagento.addToCart({
        sku,
        quantity,
        ...options
      });
      console.log('✅ Added to cart:', sku, 'x', quantity);
      return success;
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      throw error;
    }
  }

  async removeFromCart(itemId) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      await ReactNativeMagento.removeFromCart(itemId);
      console.log('✅ Removed from cart:', itemId);
    } catch (error) {
      console.error('❌ Failed to remove from cart:', error);
      throw error;
    }
  }

  async clearCart() {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      await ReactNativeMagento.clearCart();
      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('❌ Failed to clear cart:', error);
      throw error;
    }
  }

  /**
   * Order Management
   */
  async getOrders(filters = {}) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const orders = await ReactNativeMagento.getOrders({
        page: 1,
        pageSize: 20,
        ...filters
      });
      console.log('✅ Orders loaded:', orders?.length || 0);
      return orders;
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const order = await ReactNativeMagento.getOrder(orderId);
      console.log('✅ Order loaded:', order?.increment_id);
      return order;
    } catch (error) {
      console.error('❌ Failed to load order:', error);
      throw error;
    }
  }

  /**
   * Wishlist Management
   */
  async getWishlist() {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      const wishlist = await ReactNativeMagento.getWishlist();
      console.log('✅ Wishlist loaded:', wishlist?.items?.length || 0, 'items');
      return wishlist;
    } catch (error) {
      console.error('❌ Failed to load wishlist:', error);
      throw error;
    }
  }

  async addToWishlist(sku) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      await ReactNativeMagento.addToWishlist(sku);
      console.log('✅ Added to wishlist:', sku);
    } catch (error) {
      console.error('❌ Failed to add to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(itemId) {
    if (!this.isInitialized) {
      throw new Error('Magento not initialized. Call initialize() first.');
    }

    try {
      await ReactNativeMagento.removeFromWishlist(itemId);
      console.log('✅ Removed from wishlist:', itemId);
    } catch (error) {
      console.error('❌ Failed to remove from wishlist:', error);
      throw error;
    }
  }

  /**
   * Localization
   */
  async setLocale(locale) {
    try {
      await ReactNativeMagento.setLocale(locale);
      console.log('✅ Locale set to:', locale);
    } catch (error) {
      console.error('❌ Failed to set locale:', error);
      throw error;
    }
  }

  translate(key) {
    return ReactNativeMagento.translate(key);
  }

  formatCurrency(amount, currency = 'USD') {
    return ReactNativeMagento.formatCurrency(amount, currency);
  }

  formatDate(date) {
    return ReactNativeMagento.formatDate(date);
  }

  /**
   * Network & Offline Support
   */
  get isOnline() {
    return ReactNativeMagento.isOnline;
  }

  addConnectivityListener(callback) {
    const networkService = ReactNativeMagento.network;
    return networkService.addConnectivityListener(callback);
  }

  async getCachedProducts() {
    try {
      const offlineService = ReactNativeMagento.offline;
      return await offlineService.getCachedProducts();
    } catch (error) {
      console.error('❌ Failed to get cached products:', error);
      throw error;
    }
  }

  /**
   * Gaming Integration Methods
   * These methods integrate e-commerce with fishing game mechanics
   */
  
  /**
   * Convert game coins to store credits or points
   */
  async convertCoinsToStoreCredit(gameCoins, conversionRate = 0.01) {
    const storeCredit = gameCoins * conversionRate;
    console.log(`🎮 Converting ${gameCoins} game coins to $${storeCredit.toFixed(2)} store credit`);
    // This would typically update the customer's account with store credit
    return storeCredit;
  }

  /**
   * Reward players with discount coupons based on achievements
   */
  async rewardPlayerWithCoupon(achievement, discountPercent = 10) {
    console.log(`🏆 Rewarding player with ${discountPercent}% coupon for achievement: ${achievement}`);
    // This would create a coupon code in Magento for the player
    return `FISHING_${achievement.toUpperCase()}_${discountPercent}`;
  }

  /**
   * Get recommended fishing equipment based on player level
   */
  async getRecommendedEquipment(playerLevel) {
    let categoryFilter = 'beginner-fishing';
    
    if (playerLevel >= 10) {
      categoryFilter = 'intermediate-fishing';
    } else if (playerLevel >= 20) {
      categoryFilter = 'advanced-fishing';
    } else if (playerLevel >= 30) {
      categoryFilter = 'professional-fishing';
    }

    return this.getProducts({
      categoryId: categoryFilter,
      pageSize: 10,
      sortBy: 'price',
      sortOrder: 'asc'
    });
  }
}

// Create and export a singleton instance
export const magentoService = new MagentoIntegration();
export default MagentoIntegration;
