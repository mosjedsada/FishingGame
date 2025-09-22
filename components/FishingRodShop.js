import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fishing rod data with different types and casting abilities
const FISHING_RODS = [
  {
    id: 'basic_rod',
    name: 'เบ็ดพื้นฐาน / Basic Rod',
    description: 'เบ็ดสำหรับผู้เริ่มต้น / Perfect for beginners',
    price: 0, // Free starter rod
    castingDistance: 50,
    accuracy: 70,
    durability: 100,
    rarity: 'common',
    emoji: '🎣',
    owned: true, // Player starts with this
    equipped: true,
    stats: {
      power: 1,
      accuracy: 1,
      durability: 1,
    }
  },
  {
    id: 'fiberglass_rod',
    name: 'เบ็ดไฟเบอร์กลาส / Fiberglass Rod',
    description: 'เบ็ดที่แข็งแรงและทนทาน / Strong and durable',
    price: 200,
    castingDistance: 70,
    accuracy: 75,
    durability: 150,
    rarity: 'common',
    emoji: '🎣',
    owned: false,
    equipped: false,
    stats: {
      power: 2,
      accuracy: 2,
      durability: 2,
    }
  },
  {
    id: 'carbon_rod',
    name: 'เบ็ดคาร์บอน / Carbon Rod',
    description: 'เบ็ดน้ำหนักเบา โยนได้ไกล / Lightweight, casts far',
    price: 500,
    castingDistance: 90,
    accuracy: 80,
    durability: 200,
    rarity: 'uncommon',
    emoji: '🎣',
    owned: false,
    equipped: false,
    stats: {
      power: 3,
      accuracy: 3,
      durability: 3,
    }
  },
  {
    id: 'titanium_rod',
    name: 'เบ็ดไทเทเนียม / Titanium Rod',
    description: 'เบ็ดระดับมืออาชีพ / Professional grade',
    price: 1200,
    castingDistance: 120,
    accuracy: 85,
    durability: 300,
    rarity: 'rare',
    emoji: '🎣',
    owned: false,
    equipped: false,
    stats: {
      power: 4,
      accuracy: 4,
      durability: 4,
    }
  },
  {
    id: 'legendary_rod',
    name: 'เบ็ดตำนาน / Legendary Rod',
    description: 'เบ็ดในตำนาน โยนได้ไกลที่สุด / Legendary rod with maximum range',
    price: 3000,
    castingDistance: 150,
    accuracy: 90,
    durability: 500,
    rarity: 'legendary',
    emoji: '🏆',
    owned: false,
    equipped: false,
    stats: {
      power: 5,
      accuracy: 5,
      durability: 5,
    }
  }
];

const FishingRodShop = ({ visible, onClose, playerCoins, onPurchase, onEquip }) => {
  const [rods, setRods] = useState(FISHING_RODS);
  const [selectedRod, setSelectedRod] = useState(null);

  useEffect(() => {
    loadRodInventory();
  }, []);

  const loadRodInventory = async () => {
    try {
      const savedRods = await AsyncStorage.getItem('fishingRods');
      if (savedRods) {
        const rodData = JSON.parse(savedRods);
        setRods(rodData);
      }
    } catch (error) {
      console.error('Error loading rod inventory:', error);
    }
  };

  const saveRodInventory = async (updatedRods) => {
    try {
      await AsyncStorage.setItem('fishingRods', JSON.stringify(updatedRods));
    } catch (error) {
      console.error('Error saving rod inventory:', error);
    }
  };

  const handlePurchase = (rod) => {
    if (rod.owned) {
      Alert.alert('Already Owned', 'You already own this rod! / คุณมีเบ็ดนี้แล้ว!');
      return;
    }

    if (playerCoins < rod.price) {
      Alert.alert(
        'Insufficient Coins / เหรียญไม่เพียงพอ',
        `You need ${rod.price} coins to buy this rod / คุณต้องการ ${rod.price} เหรียญเพื่อซื้อเบ็ดนี้`
      );
      return;
    }

    Alert.alert(
      'Confirm Purchase / ยืนยันการซื้อ',
      `Buy ${rod.name} for ${rod.price} coins? / ซื้อ ${rod.name} ราคา ${rod.price} เหรียญ?`,
      [
        { text: 'Cancel / ยกเลิก', style: 'cancel' },
        {
          text: 'Buy / ซื้อ',
          onPress: () => {
            const updatedRods = rods.map(r => 
              r.id === rod.id ? { ...r, owned: true } : r
            );
            setRods(updatedRods);
            saveRodInventory(updatedRods);
            onPurchase(rod);
            Alert.alert(
              'Purchase Complete / ซื้อสำเร็จ',
              `You now own ${rod.name}! / คุณเป็นเจ้าของ ${rod.name} แล้ว!`
            );
          }
        }
      ]
    );
  };

  const handleEquip = (rod) => {
    if (!rod.owned) {
      Alert.alert('Not Owned', 'You must purchase this rod first! / คุณต้องซื้อเบ็ดนี้ก่อน!');
      return;
    }

    const updatedRods = rods.map(r => ({
      ...r,
      equipped: r.id === rod.id
    }));
    
    setRods(updatedRods);
    saveRodInventory(updatedRods);
    onEquip(rod);
    
    Alert.alert(
      'Rod Equipped / เปลี่ยนเบ็ดแล้ว',
      `You are now using ${rod.name} / คุณใช้ ${rod.name} แล้ว`
    );
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#808080';
      case 'uncommon': return '#00FF00';
      case 'rare': return '#0080FF';
      case 'legendary': return '#FFD700';
      default: return '#808080';
    }
  };

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common': return 'ธรรมดา';
      case 'uncommon': return 'ไม่ธรรมดา';
      case 'rare': return 'หายาก';
      case 'legendary': return 'ตำนาน';
      default: return 'ธรรมดา';
    }
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
          <Text style={styles.title}>Fishing Rod Shop / ร้านค้าเบ็ดตกปลา</Text>
          <Text style={styles.subtitle}>Your Coins: {playerCoins} / เหรียญของคุณ: {playerCoins}</Text>
          
          <ScrollView style={styles.scrollView}>
            {rods.map((rod) => (
              <View 
                key={rod.id} 
                style={[
                  styles.rodContainer,
                  { borderColor: getRarityColor(rod.rarity) },
                  rod.equipped && styles.equippedRod
                ]}
              >
                <View style={styles.rodHeader}>
                  <Text style={styles.rodEmoji}>{rod.emoji}</Text>
                  <View style={styles.rodInfo}>
                    <Text style={styles.rodName}>{rod.name}</Text>
                    <Text style={[styles.rarityText, { color: getRarityColor(rod.rarity) }]}>
                      {getRarityText(rod.rarity)}
                    </Text>
                  </View>
                  {rod.equipped && (
                    <Text style={styles.equippedText}>EQUIPPED / ใช้อยู่</Text>
                  )}
                </View>

                <Text style={styles.rodDescription}>{rod.description}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Casting Distance / ระยะโยน:</Text>
                    <Text style={styles.statValue}>{rod.castingDistance}m</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Accuracy / ความแม่นยำ:</Text>
                    <Text style={styles.statValue}>{rod.accuracy}%</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Durability / ความทนทาน:</Text>
                    <Text style={styles.statValue}>{rod.durability}</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  {!rod.owned ? (
                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        playerCoins < rod.price && styles.disabledButton
                      ]}
                      onPress={() => handlePurchase(rod)}
                      disabled={playerCoins < rod.price}
                    >
                      <Text style={styles.buttonText}>
                        Buy / ซื้อ - {rod.price} coins
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.equipButton,
                        rod.equipped && styles.equippedButton
                      ]}
                      onPress={() => handleEquip(rod)}
                    >
                      <Text style={styles.buttonText}>
                        {rod.equipped ? 'Equipped / ใช้อยู่' : 'Equip / ใช้'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  shopContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2E5BBA',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  rodContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  equippedRod: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  rodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rodEmoji: {
    fontSize: 30,
    marginRight: 10,
  },
  rodInfo: {
    flex: 1,
  },
  rodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rarityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  equippedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rodDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  statsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  equipButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  equippedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FishingRodShop;
