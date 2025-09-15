import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';

const SHOP_ITEMS = [
  {
    id: 'coins_100',
    title: '100 Coins',
    description: 'Get a quick boost!',
    price: 0.99,
    currency: 'USD',
    coins: 100,
    isPopular: false,
  },
  {
    id: 'coins_500',
    title: '500 Coins',
    description: 'Great value pack!',
    price: 3.99,
    currency: 'USD',
    coins: 500,
    isPopular: true,
  },
  {
    id: 'coins_1200',
    title: '1,200 Coins',
    description: 'Best deal!',
    price: 6.99,
    currency: 'USD',
    coins: 1200,
    isPopular: false,
  },
  {
    id: 'remove_ads',
    title: 'Remove Ads',
    description: 'Remove all ads permanently',
    price: 4.99,
    currency: 'USD',
    coins: 0,
    isPopular: false,
  },
];

const ShopModal = ({ visible, onClose, onPurchase }) => {
  const handlePurchase = (item) => {
    Alert.alert(
      'Confirm Purchase',
      `Buy ${item.title} for ${item.currency}${item.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            onPurchase(item);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.shopContainer}>
          <Text style={styles.title}>Shop</Text>
          
          {SHOP_ITEMS.map((item) => (
            <View 
              key={item.id} 
              style={[
                styles.itemContainer,
                item.isPopular && styles.popularItem
              ]}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {item.coins > 0 && (
                  <Text style={styles.coinText}>{item.coins} coins</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => handlePurchase(item)}
              >
                <Text style={styles.buyButtonText}>
                  {item.currency}${item.price}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  shopContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  popularItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  coinText: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 4,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShopModal;
