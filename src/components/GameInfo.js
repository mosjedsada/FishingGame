import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GameInfo = ({ 
  score, 
  coins, 
  level, 
  exp, 
  expToNextLevel,
  currentLocation,
  currentRod,
  equipment,
  castResult 
}) => {
  return (
    <>
      {/* Game Stats */}
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Coins: {coins}</Text>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>EXP: {exp}/{expToNextLevel}</Text>
      </View>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{currentLocation?.name}</Text>
        <Text style={styles.locationDescription}>{currentLocation?.description}</Text>
        <Text style={styles.locationDifficulty}>
          Difficulty: {currentLocation?.difficulty}
        </Text>
      </View>

      {/* Equipment Info */}
      <View style={styles.equipmentInfo}>
        <Text style={styles.equipText}>
          Rod: {currentRod?.name || 'No Rod'}
        </Text>
        <Text style={styles.equipText}>
          Bait: Level {equipment?.bait?.level || 1}
        </Text>
        <Text style={styles.equipText}>
          Line: Level {equipment?.line?.level || 1}
        </Text>
        {castResult && (
          <Text style={styles.castInfo}>
            Cast: {castResult.distance}m
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gameInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 15,
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
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationInfo: {
    position: 'absolute',
    top: 50,
    left: '50%',
    marginLeft: -100,
    width: 200,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
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
  locationName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationDescription: {
    color: '#FFD700',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationDifficulty: {
    color: '#FFA500',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  equipmentInfo: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 15,
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
  equipText: {
    color: 'white',
    fontSize: 12,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  castInfo: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default GameInfo;

