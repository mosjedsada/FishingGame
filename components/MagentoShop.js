import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { magentoService } from '../MagentoIntegration';

const MagentoShop = ({ 
  visible, 
  onClose, 
  playerLevel = 1, 
  gameCoins = 0, 
  onPurchase 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('products'); // products, cart, profile

  useEffect(() => {
    if (visible) {
      initializeMagento();
    }
  }, [visible]);

  const initializeMagento = async () => {
    setIsLoading(true);
    try {
      // Initialize Magento (you should replace with your actual store URL)
      const initialized = await magentoService.initialize({
        baseUrl: 'https://demo.magento.com', // Replace with your store URL
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Code': 'default'
        }
      });

      if (initialized) {
        await loadRecommendedProducts();
        await loadCart();
        checkLoginStatus();
      }
    } catch (error) {
      console.error('Failed to initialize Magento:', error);
      Alert.alert('Error', 'Failed to connect to store');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendedProducts = async () => {
    try {
      // Get fishing equipment recommended for player level
      const recommended = await magentoService.getRecommendedEquipment(playerLevel);
      setProducts(recommended || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback to general fishing products
      try {
        const fishingProducts = await magentoService.getFishingEquipment();
        setProducts(fishingProducts || []);
      } catch (fallbackError) {
        console.error('Fallback product loading failed:', fallbackError);
      }
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await magentoService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const checkLoginStatus = () => {
    const customer = magentoService.getCurrentCustomer();
    setIsLoggedIn(!!customer);
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await magentoService.login(loginForm.email, loginForm.password, true);
      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
      Alert.alert('Success', 'Logged in successfully!');
      await loadCart();
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await magentoService.logout();
      setIsLoggedIn(false);
      setCart(null);
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please login to add items to cart');
      setShowLogin(true);
      return;
    }

    setIsLoading(true);
    try {
      await magentoService.addToCart(product.sku, 1);
      await loadCart();
      Alert.alert('Success', `${product.name} added to cart!`);
      
      // Trigger purchase callback for game integration
      if (onPurchase) {
        onPurchase(product);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
      console.error('Add to cart failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    setIsLoading(true);
    try {
      await magentoService.removeFromCart(itemId);
      await loadCart();
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
      console.error('Remove from cart failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertCoinsToCredit = async () => {
    try {
      const storeCredit = await magentoService.convertCoinsToStoreCredit(gameCoins);
      Alert.alert(
        'Coins Converted!', 
        `${gameCoins} game coins converted to $${storeCredit.toFixed(2)} store credit!`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to convert coins');
    }
  };

  const renderProducts = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>
          Fishing Equipment (Level {playerLevel})
        </Text>
        <Text style={styles.sectionSubtitle}>
          Recommended for your skill level
        </Text>
      </View>

      {products.map((product, index) => (
        <View key={product.sku || index} style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name || 'Fishing Equipment'}</Text>
            <Text style={styles.productPrice}>
              {magentoService.formatCurrency(product.price || 29.99)}
            </Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description || 'High-quality fishing equipment to improve your catch rate'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(product)}
            disabled={isLoading}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      ))}

      {products.length === 0 && !isLoading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No products available</Text>
          <Text style={styles.emptySubtext}>
            Products will appear here when connected to your Magento store
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderCart = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Shopping Cart</Text>
        {cart?.items?.length > 0 && (
          <Text style={styles.sectionSubtitle}>
            {cart.items.length} item(s) in cart
          </Text>
        )}
      </View>

      {cart?.items?.map((item, index) => (
        <View key={item.item_id || index} style={styles.cartItem}>
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.cartItemPrice}>
              {magentoService.formatCurrency(item.price)} x {item.qty}
            </Text>
            <Text style={styles.cartItemTotal}>
              Total: {magentoService.formatCurrency(item.price * item.qty)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromCart(item.item_id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      {(!cart?.items || cart.items.length === 0) && !isLoading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Add some fishing equipment to get started!
          </Text>
        </View>
      )}

      {cart?.items?.length > 0 && (
        <View style={styles.cartSummary}>
          <Text style={styles.cartTotal}>
            Total: {magentoService.formatCurrency(cart.grand_total || 0)}
          </Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Player Profile</Text>
      </View>

      {isLoggedIn ? (
        <View style={styles.profileSection}>
          <Text style={styles.profileText}>
            ✅ Logged in to store
          </Text>
          <Text style={styles.profileSubtext}>
            You can now purchase items and track orders
          </Text>
          
          <View style={styles.gameStats}>
            <Text style={styles.statsTitle}>Game Stats</Text>
            <Text style={styles.statsText}>Level: {playerLevel}</Text>
            <Text style={styles.statsText}>Coins: {gameCoins}</Text>
          </View>

          <TouchableOpacity 
            style={styles.convertButton}
            onPress={convertCoinsToCredit}
          >
            <Text style={styles.convertButtonText}>
              Convert Coins to Store Credit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileSection}>
          <Text style={styles.profileText}>
            🔐 Not logged in
          </Text>
          <Text style={styles.profileSubtext}>
            Login to access your account and purchase items
          </Text>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setShowLogin(true)}
          >
            <Text style={styles.loginButtonText}>Login to Store</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🛒 Fishing Store</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'products' && styles.activeTab]}
              onPress={() => setActiveTab('products')}
            >
              <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
                Products
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
                Cart {cart?.items?.length > 0 && `(${cart.items.length})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'cart' && renderCart()}
              {activeTab === 'profile' && renderProfile()}
            </>
          )}
        </View>

        {/* Login Modal */}
        <Modal visible={showLogin} animationType="fade" transparent>
          <View style={styles.loginModalContainer}>
            <View style={styles.loginModalContent}>
              <Text style={styles.loginTitle}>Login to Store</Text>
              
              <TextInput
                style={styles.loginInput}
                placeholder="Email"
                value={loginForm.email}
                onChangeText={(text) => setLoginForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.loginInput}
                placeholder="Password"
                value={loginForm.password}
                onChangeText={(text) => setLoginForm(prev => ({ ...prev, password: text }))}
                secureTextEntry
              />
              
              <View style={styles.loginButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowLogin(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B35',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cartItemTotal: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartSummary: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSection: {
    padding: 20,
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
  gameStats: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  convertButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  convertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  // Login Modal Styles
  loginModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginModalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MagentoShop;
