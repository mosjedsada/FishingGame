import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product data with both English and Thai
const SHOP_ITEMS = [
  {
    id: 'coins_100',
    coins: 100,
    price: 0.99,
    title: '100 Coins / 100 เหรียญ',
    description: 'Perfect for small upgrades / เหมาะสำหรับอัพเกรดเบื้องต้น',
    popular: false
  },
  {
    id: 'coins_500',
    coins: 500,
    price: 3.99,
    title: '500 Coins / 500 เหรียญ',
    description: 'Great value! / คุ้มค่า!',
    popular: true
  },
  {
    id: 'coins_1200',
    coins: 1200,
    price: 6.99,
    title: '1,200 Coins / 1,200 เหรียญ',
    description: 'Best value! / คุ้มที่สุด!',
    popular: false
  },
  {
    id: 'remove_ads',
    coins: 0,
    price: 2.99,
    title: 'Remove Ads / ลบโฆษณา',
    description: 'Remove all ads permanently / ลบโฆษณาทั้งหมดถาวร',
    popular: false
  }
];

const Shop = ({ isVisible, onClose, onPurchase }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // In a real app, this would connect to your payment processor
  const handlePurchase = async (item) => {
    try {
      // Simulate purchase processing
      Alert.alert(
        'Purchase Confirmation / ยืนยันการซื้อ',
        `Confirm purchase of ${item.title} for $${item.price}? / ยืนยันการซื้อ ${item.title} ราคา ${item.price} ดอลลาร์?`,
        [
          { text: 'Cancel / ยกเลิก', style: 'cancel' },
          {
            text: 'Buy Now / ซื้อเลย',
            onPress: async () => {
              // In a real app, process payment here
              if (onPurchase) {
                onPurchase(item);
              }
              Alert.alert(
                'Purchase Complete / ซื้อสำเร็จ',
                `Thank you for your purchase! / ขอบคุณสำหรับการซื้อ!`,
                [{ text: 'OK / ตกลง' }]
              );
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error / ข้อผิดพลาด', 'Purchase failed. Please try again. / การซื้อล้มเหลว กรุณาลองใหม่');
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Shop / ร้านค้า</Text>
          
          {SHOP_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, item.popular && styles.popularItem]}
              onPress={() => handlePurchase(item)}
            >
              {item.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular / ยอดนิยม</Text>
                </View>
              )}
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              {item.coins > 0 && (
                <Text style={styles.coinAmount}>{item.coins} coins / {item.coins} เหรียญ</Text>
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close / ปิด</Text>
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
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  popularItem: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF9C4',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  coinAmount: {
    fontSize: 16,
    color: '#FF9800',
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Shop;
