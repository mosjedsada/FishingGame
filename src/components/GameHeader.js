import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/gameUtils';

const GameHeader = ({ 
  coins, 
  premiumCoins, 
  onShopPress, 
  onSoundToggle, 
  isSoundOn 
}) => {
  return (
    <View style={styles.currencyContainer}>
      <View style={styles.currencyBox}>
        <Text style={styles.currencyText}>
          {formatCurrency(coins, 'coins')}
        </Text>
      </View>
      <View style={styles.currencyBox}>
        <Text style={styles.premiumText}>
          {formatCurrency(premiumCoins, 'premium')}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={onShopPress}
      >
        <Text style={styles.shopButtonText}>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.soundButton}
        onPress={onSoundToggle}
      >
        <Text style={styles.soundButtonText}>
          {isSoundOn ? '🔊' : '🔇'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    margin: 10,
  },
  currencyBox: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  soundButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  soundButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default GameHeader;

