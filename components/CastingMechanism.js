import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CastingMechanism = ({ 
  visible, 
  onClose, 
  onCast, 
  currentRod, 
  isFishing, 
  onStartFishing 
}) => {
  const [castingPower, setCastingPower] = useState(0);
  const [castingDirection, setCastingDirection] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [castResult, setCastResult] = useState(null);
  
  const powerAnimation = useRef(new Animated.Value(0)).current;
  const directionAnimation = useRef(new Animated.Value(0)).current;
  const chargeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCharging) {
      startChargingAnimation();
    } else {
      stopChargingAnimation();
    }
  }, [isCharging]);

  const startChargingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(chargeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(chargeAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopChargingAnimation = () => {
    chargeAnimation.stopAnimation();
    chargeAnimation.setValue(0);
  };

  const handlePowerCharge = () => {
    if (!isCharging) {
      setIsCharging(true);
      setCastingPower(0);
    } else {
      setCastingPower(prev => Math.min(prev + 10, 100));
    }
  };

  const handleDirectionChange = (direction) => {
    const newDirection = Math.max(-45, Math.min(45, castingDirection + direction));
    setCastingDirection(newDirection);
  };

  const calculateCastResult = () => {
    if (!currentRod) return null;

    const baseDistance = currentRod.castingDistance;
    const powerMultiplier = castingPower / 100;
    const directionMultiplier = 1 - Math.abs(castingDirection) / 100;
    const accuracy = currentRod.accuracy / 100;
    
    const finalDistance = Math.round(baseDistance * powerMultiplier * directionMultiplier);
    const accuracyRoll = Math.random() * 100;
    const isAccurate = accuracyRoll <= (accuracy * 100);
    
    return {
      distance: finalDistance,
      accuracy: isAccurate,
      power: castingPower,
      direction: castingDirection,
    };
  };

  const executeCast = () => {
    if (castingPower === 0) {
      Alert.alert('No Power', 'Charge up your cast first! / ต้องชาร์จพลังก่อน!');
      return;
    }

    const result = calculateCastResult();
    setCastResult(result);
    
    // Animate the cast
    Animated.sequence([
      Animated.timing(powerAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(powerAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Start fishing after cast
    setTimeout(() => {
      onCast(result);
      onStartFishing();
      onClose();
    }, 1000);
  };

  const resetCast = () => {
    setCastingPower(0);
    setCastingDirection(0);
    setIsCharging(false);
    setCastResult(null);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.castingInterface}>
        <Text style={styles.title}>Casting / การโยนเบ็ด</Text>
        <Text style={styles.rodInfo}>
          Using: {currentRod?.name || 'No Rod Selected'}
        </Text>

        {/* Power Meter */}
        <View style={styles.powerSection}>
          <Text style={styles.sectionTitle}>Power / พลัง: {castingPower}%</Text>
          <View style={styles.powerMeter}>
            <View 
              style={[
                styles.powerBar,
                { 
                  width: `${castingPower}%`,
                  backgroundColor: castingPower < 30 ? '#4CAF50' : 
                                 castingPower < 70 ? '#FF9800' : '#F44336'
                }
              ]} 
            />
          </View>
          <TouchableOpacity
            style={[
              styles.chargeButton,
              isCharging && styles.chargingButton
            ]}
            onPress={handlePowerCharge}
            onLongPress={() => setIsCharging(true)}
            onPressOut={() => setIsCharging(false)}
          >
            <Text style={styles.chargeButtonText}>
              {isCharging ? 'Charging... / กำลังชาร์จ...' : 'Hold to Charge / กดค้างเพื่อชาร์จ'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Direction Control */}
        <View style={styles.directionSection}>
          <Text style={styles.sectionTitle}>Direction / ทิศทาง: {castingDirection}°</Text>
          <View style={styles.directionControls}>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => handleDirectionChange(-5)}
            >
              <Text style={styles.directionButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.directionIndicator}>
              <Text style={styles.directionText}>
                {castingDirection > 0 ? '→' : castingDirection < 0 ? '←' : '↑'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => handleDirectionChange(5)}
            >
              <Text style={styles.directionButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cast Result */}
        {castResult && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Cast Result / ผลการโยน:</Text>
            <Text style={styles.resultText}>
              Distance: {castResult.distance}m / ระยะทาง: {castResult.distance} เมตร
            </Text>
            <Text style={[
              styles.resultText,
              { color: castResult.accuracy ? '#4CAF50' : '#F44336' }
            ]}>
              Accuracy: {castResult.accuracy ? 'Perfect!' : 'Missed!'} / 
              ความแม่นยำ: {castResult.accuracy ? 'แม่นยำ!' : 'พลาด!'}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.castButton]}
            onPress={executeCast}
            disabled={castingPower === 0}
          >
            <Text style={styles.actionButtonText}>Cast! / โยน!</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={resetCast}
          >
            <Text style={styles.actionButtonText}>Reset / รีเซ็ต</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.actionButtonText}>Close / ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  castingInterface: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2E5BBA',
  },
  rodInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  powerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  powerMeter: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  powerBar: {
    height: '100%',
    borderRadius: 10,
  },
  chargeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  chargingButton: {
    backgroundColor: '#FF9800',
  },
  chargeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionSection: {
    marginBottom: 20,
  },
  directionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButton: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  directionButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  directionIndicator: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  directionText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  resultSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  castButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  closeButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CastingMechanism;
