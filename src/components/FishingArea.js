import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const FishingArea = ({ 
  fishingState, 
  hookAnimation, 
  waterAnimation, 
  currentLocation,
  onFishingPress,
  onSpecialFishPress 
}) => {
  const { isFishing, caughtFish, isWaiting, showSpecialFish } = fishingState;

  return (
    <>
      {/* Water Background */}
      <Animated.View style={[styles.water, {
        backgroundColor: waterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [currentLocation?.background || '#87CEEB', currentLocation?.waterColor || '#4682B4']
        })
      }]} />

      {/* Fishing Line */}
      <Animated.View style={[styles.fishingLine, {
        top: hookAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [height * 0.3, height * 0.7]
        })
      }]} />

      {/* Hook */}
      <Animated.View style={[styles.hook, {
        top: hookAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [height * 0.3, height * 0.7]
        })
      }]}>
        <Text style={styles.hookText}>🎣</Text>
      </Animated.View>

      {/* Caught Fish */}
      {caughtFish && (
        <View style={styles.caughtFish}>
          <Text style={styles.fishEmoji}>{caughtFish.emoji}</Text>
          <Text style={styles.fishName}>{caughtFish.name}</Text>
          <Text style={styles.fishPoints}>
            {caughtFish.points} points
          </Text>
        </View>
      )}

      {/* Special Fish */}
      {showSpecialFish && (
        <TouchableOpacity style={styles.specialFish} onPress={onSpecialFishPress}>
          <Text style={styles.specialFishEmoji}>🐉</Text>
          <Text style={styles.specialFishText}>Golden Dragon Fish!</Text>
          <Text style={styles.specialFishSubtext}>Tap to catch!</Text>
        </TouchableOpacity>
      )}

      {/* Fishing Button */}
      <TouchableOpacity style={styles.fishingButton} onPress={onFishingPress}>
        <Text style={styles.buttonText}>
          {isFishing ? (isWaiting ? 'Waiting for fish...' : 'Reel in!') : 
           fishingState.castResult ? 'Cast line!' : 'Cast!'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  water: {
    position: 'absolute',
    top: height * 0.4,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fishingLine: {
    position: 'absolute',
    left: width / 2 - 1,
    width: 2,
    height: 2,
    backgroundColor: '#8B4513',
  },
  hook: {
    position: 'absolute',
    left: width / 2 - 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hookText: {
    fontSize: 30,
  },
  caughtFish: {
    position: 'absolute',
    top: height * 0.5,
    left: width / 2 - 75,
    width: 150,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  fishEmoji: {
    fontSize: 40,
  },
  fishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fishPoints: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialFish: {
    position: 'absolute',
    bottom: 200,
    left: width / 2 - 75,
    width: 150,
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.9)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  specialFishEmoji: {
    fontSize: 60,
  },
  specialFishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialFishSubtext: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fishingButton: {
    position: 'absolute',
    bottom: 100,
    left: width / 2 - 75,
    width: 150,
    height: 60,
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default FishingArea;

