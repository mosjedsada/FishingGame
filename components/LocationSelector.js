import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { fishingLocations, locationSpecialFish } from './LocationData';

const { width, height } = Dimensions.get('window');

const LocationSelector = ({ 
  visible, 
  onClose, 
  onSelectLocation, 
  currentLocation, 
  playerLevel, 
  playerCoins 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  const handleSelectLocation = (location) => {
    if (location.level > playerLevel) {
      return; // ไม่สามารถเลือกได้
    }
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  const isLocationUnlocked = (location) => {
    return location.level <= playerLevel;
  };

  const canAffordUnlock = (location) => {
    return playerCoins >= location.unlockCost;
  };

  const getLocationStatus = (location) => {
    if (location.level > playerLevel) {
      return `ต้องระดับ ${location.level}`;
    }
    if (location.unlockCost > 0 && !isLocationUnlocked(location)) {
      return `ต้องจ่าย ${location.unlockCost} เหรียญ`;
    }
    return 'พร้อมใช้งาน';
  };

  const getLocationStatusColor = (location) => {
    if (location.level > playerLevel) {
      return '#FF6B6B';
    }
    if (location.unlockCost > 0 && !isLocationUnlocked(location)) {
      return '#FFA500';
    }
    return '#4CAF50';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>เลือกสถานที่ตกปลา</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.locationsList}>
            {fishingLocations.map((location) => {
              const isUnlocked = isLocationUnlocked(location);
              const canAfford = canAffordUnlock(location);
              const isSelected = selectedLocation?.id === location.id;
              const statusColor = getLocationStatusColor(location);

              return (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.locationCard,
                    isSelected && styles.selectedLocationCard,
                    !isUnlocked && styles.lockedLocationCard
                  ]}
                  onPress={() => handleSelectLocation(location)}
                  disabled={!isUnlocked}
                >
                  <View style={styles.locationHeader}>
                    <Text style={styles.locationEmoji}>{location.image}</Text>
                    <View style={styles.locationInfo}>
                      <Text style={[
                        styles.locationName,
                        !isUnlocked && styles.lockedText
                      ]}>
                        {location.name}
                      </Text>
                      <Text style={[
                        styles.locationNameEn,
                        !isUnlocked && styles.lockedText
                      ]}>
                        {location.nameEn}
                      </Text>
                      <Text style={[
                        styles.locationDescription,
                        !isUnlocked && styles.lockedText
                      ]}>
                        {location.description}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ระดับที่ต้องการ:</Text>
                      <Text style={[
                        styles.detailValue,
                        location.level > playerLevel && styles.requirementNotMet
                      ]}>
                        {location.level}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ความยาก:</Text>
                      <Text style={styles.detailValue}>{location.difficulty}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>อัตราจับปลา:</Text>
                      <Text style={styles.detailValue}>
                        {Math.round(location.baseCatchRate * 100)}%
                      </Text>
                    </View>

                    {location.unlockCost > 0 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ค่าเปิด:</Text>
                        <Text style={[
                          styles.detailValue,
                          !canAfford && styles.requirementNotMet
                        ]}>
                          {location.unlockCost} เหรียญ
                        </Text>
                      </View>
                    )}

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>สถานะ:</Text>
                      <Text style={[styles.detailValue, { color: statusColor }]}>
                        {getLocationStatus(location)}
                      </Text>
                    </View>
                  </View>

                  {locationSpecialFish[location.id] && (
                    <View style={styles.specialFishInfo}>
                      <Text style={styles.specialFishLabel}>ปลาพิเศษ:</Text>
                      <Text style={styles.specialFishName}>
                        {locationSpecialFish[location.id].emoji} {locationSpecialFish[location.id].name}
                      </Text>
                    </View>
                  )}

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>✓ เลือกแล้ว</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedLocation && styles.disabledButton
              ]}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={styles.confirmButtonText}>
                {selectedLocation ? `ไปตกปลาที่ ${selectedLocation.name}` : 'เลือกสถานที่ก่อน'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.95,
    height: height * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedLocationCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  lockedLocationCard: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationNameEn: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  lockedText: {
    color: '#999',
  },
  locationDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  requirementNotMet: {
    color: '#FF6B6B',
  },
  specialFishInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  specialFishLabel: {
    fontSize: 12,
    color: '#856404',
    fontWeight: 'bold',
  },
  specialFishName: {
    fontSize: 14,
    color: '#856404',
    marginTop: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default LocationSelector;
