import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ControlPanel = ({ 
  onShopPress,
  onMagentoShopPress,
  onFishingRodShopPress,
  onMissionsPress,
  onLocationSelectorPress,
  onDonationPress
}) => {
  return (
    <View style={styles.controlButtons}>
      <TouchableOpacity style={styles.controlButton} onPress={onShopPress}>
        <Text style={styles.controlButtonText}>🛒</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={onMagentoShopPress}>
        <Text style={styles.controlButtonText}>🏪</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={onFishingRodShopPress}>
        <Text style={styles.controlButtonText}>🎣</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={onMissionsPress}>
        <Text style={styles.controlButtonText}>📜</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={onLocationSelectorPress}>
        <Text style={styles.controlButtonText}>🗺️</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={onDonationPress}>
        <Text style={styles.controlButtonText}>💝</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    fontSize: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ControlPanel;

