import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import MagentoShop from './components/MagentoShop';
import FishingRodShop from './components/FishingRodShop';
import CastingMechanism from './components/CastingMechanism';
import LocationSelector from './components/LocationSelector';
import { fishingLocations, locationSpecialFish, locationFishTypes } from './components/LocationData';
import DonationModal from './components/DonationModal';

const { width, height } = Dimensions.get('window');

// Fish data - English names
const fishTypes = [
  { name: 'Goldfish', points: 10, rarity: 0.5, emoji: '🐟', color: '#FFA500' },
  { name: 'Shark', points: 50, rarity: 0.1, emoji: '🦈', color: '#808080' },
  { name: 'Eel', points: 20, rarity: 0.3, emoji: '🐍', color: '#8B4513' },
  { name: 'Squid', points: 30, rarity: 0.2, emoji: '🦑', color: '#800080' },
  { name: 'Seahorse', points: 25, rarity: 0.4, emoji: '🐠', color: '#FFA500' },
];

const specialFish = { name: 'Golden Dragon Fish', points: 500, rarity: 0.05, emoji: '🐉', color: '#FFD700' };

// Daily missions - English
const missionTypes = [
  { type: 'catch_fish', target: 5, reward: 100, description: 'Catch 5 fish' },
  { type: 'earn_points', target: 100, reward: 150, description: 'Earn 100 points' },
  { type: 'play_count', target: 10, reward: 80, description: 'Play 10 times' },
];

export default function App() {
  // Game state
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [premiumCoins, setPremiumCoins] = useState(10);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);
  const [shopVisible, setShopVisible] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  
  // Equipment levels
  const [rodLevel, setRodLevel] = useState(1);
  const [baitLevel, setBaitLevel] = useState(1);
  const [lineLevel, setLineLevel] = useState(1);
  
  // Fishing state
  const [isFishing, setIsFishing] = useState(false);
  const [caughtFish, setCaughtFish] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  
  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showSpecialFish, setShowSpecialFish] = useState(false);
  const [showMagentoShop, setShowMagentoShop] = useState(false);
  const [showFishingRodShop, setShowFishingRodShop] = useState(false);
  const [showCasting, setShowCasting] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  
  // Location state
  const [currentLocation, setCurrentLocation] = useState(fishingLocations[0]);
  
  // Fishing rod state
  const [currentRod, setCurrentRod] = useState(null);
  const [ownedRods, setOwnedRods] = useState([]);
  const [castResult, setCastResult] = useState(null);
  
  // Daily missions
  const [dailyMissions, setDailyMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState(0);
  
  // Animation
  const hookAnimation = useRef(new Animated.Value(0.5)).current;
  const waterAnimation = useRef(new Animated.Value(0)).current;
  
  // Sound
  const [sound, setSound] = useState();
  
  // Equipment costs
  const upgradeCosts = {
    rod: [200, 500, 1000, 2000],
    bait: [100, 300, 600, 1200],
    line: [150, 400, 800, 1500],
  };

  useEffect(() => {
    loadGameData();
    loadFishingRods();
    generateDailyMissions();
    startWaterAnimation();
    startSpecialFishTimer();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Handle purchase from shop
  const handlePurchase = (item) => {
    if (item.id === 'remove_ads') {
      setAdsRemoved(true);
      AsyncStorage.setItem('adsRemoved', 'true');
      Alert.alert(
        'Success!', 
        'Ads have been removed!'
      );
    } else {
      setCoins(prevCoins => prevCoins + item.coins);
      Alert.alert(
        'Purchase Complete',
        `You received ${item.coins} coins!`
      );
    }
  };

  // Save game data
  const saveGameData = async () => {
    try {
      const gameData = {
        score,
        coins,
        premiumCoins,
        level,
        exp,
        expToNextLevel,
        rodLevel,
        baitLevel,
        lineLevel,
        adsRemoved,
      };
      await AsyncStorage.setItem('gameData', JSON.stringify(gameData));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const loadGameData = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameData');
      if (savedState) {
        const gameState = JSON.parse(savedState);
        setScore(gameState.score || 0);
        setCoins(gameState.coins || 100);
        setPremiumCoins(gameState.premiumCoins || 10);
        setLevel(gameState.level || 1);
        setExp(gameState.exp || 0);
        setExpToNextLevel(gameState.expToNextLevel || 100);
        setRodLevel(gameState.rodLevel || 1);
        setBaitLevel(gameState.baitLevel || 1);
        setLineLevel(gameState.lineLevel || 1);
        setAdsRemoved(gameState.adsRemoved || false);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  };

  // Load fishing rods
  const loadFishingRods = async () => {
    try {
      const savedRods = await AsyncStorage.getItem('fishingRods');
      if (savedRods) {
        const rodData = JSON.parse(savedRods);
        setOwnedRods(rodData);
        const equippedRod = rodData.find(rod => rod.equipped);
        if (equippedRod) {
          setCurrentRod(equippedRod);
        }
      } else {
        // Initialize with basic rod
        const basicRod = {
          id: 'basic_rod',
          name: 'Basic Rod',
          castingDistance: 50,
          accuracy: 70,
          durability: 100,
          owned: true,
          equipped: true,
        };
        setCurrentRod(basicRod);
        setOwnedRods([basicRod]);
        await AsyncStorage.setItem('fishingRods', JSON.stringify([basicRod]));
      }
    } catch (error) {
      console.error('Error loading fishing rods:', error);
    }
  };

  // Handle rod purchase
  const handleRodPurchase = (rod) => {
    if (coins >= rod.price) {
      setCoins(prev => prev - rod.price);
      const updatedRods = [...ownedRods];
      const rodIndex = updatedRods.findIndex(r => r.id === rod.id);
      if (rodIndex >= 0) {
        updatedRods[rodIndex] = { ...updatedRods[rodIndex], owned: true };
      } else {
        updatedRods.push({ ...rod, owned: true });
      }
      setOwnedRods(updatedRods);
      AsyncStorage.setItem('fishingRods', JSON.stringify(updatedRods));
      saveGameData();
    }
  };

  // Handle rod equip
  const handleRodEquip = (rod) => {
    const updatedRods = ownedRods.map(r => ({
      ...r,
      equipped: r.id === rod.id
    }));
    setOwnedRods(updatedRods);
    setCurrentRod(rod);
    AsyncStorage.setItem('fishingRods', JSON.stringify(updatedRods));
  };

  // Handle casting
  const handleCast = (result) => {
    setCastResult(result);
    if (result.accuracy) {
      const accuracyBonus = result.accuracy ? currentRod.accuracy / 100 : 0;
    }
  };

  // Play sound effect
  const playSound = async (soundName) => {
    if (!isSoundOn) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sounds/click.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  // Generate daily missions
  const generateDailyMissions = () => {
    const missions = missionTypes.map((mission, index) => ({
      ...mission,
      id: index,
      progress: 0,
      isCompleted: false,
    }));
    setDailyMissions(missions);
  };

  // Check mission progress
  const checkMissions = (type, amount = 1) => {
    setDailyMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.type === type && !mission.isCompleted) {
          const newProgress = mission.progress + amount;
          const isCompleted = newProgress >= mission.target;
          
          if (isCompleted && !mission.isCompleted) {
            setCoins(prev => prev + mission.reward);
            Alert.alert('Mission Complete!', `You earned ${mission.reward} coins!`);
          }
          
          return {
            ...mission,
            progress: Math.min(newProgress, mission.target),
            isCompleted,
          };
        }
        return mission;
      })
    );
  };

  // Water animation
  const startWaterAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waterAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(waterAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Hook animation
  const startHookAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(hookAnimation, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(hookAnimation, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Special fish timer
  const startSpecialFishTimer = () => {
    const timer = Math.random() * 120000 + 60000; // 1-3 minutes
    setTimeout(() => {
      if (!showSpecialFish) {
        setShowSpecialFish(true);
        Alert.alert('Special Fish Appeared!', 'A rare Golden Dragon Fish has appeared! Hurry up before it swims away!');
        playSound('special');
        
        // Hide after 10 seconds
        setTimeout(() => {
          setShowSpecialFish(false);
        }, 10000);
      }
      startSpecialFishTimer();
    }, timer);
  };

  // Get random fish based on current location
  const getRandomFish = () => {
    const locationFish = locationFishTypes[currentLocation.id] || fishTypes;
    const random = Math.random();
    let cumulativeRarity = 0;
    
    for (const fish of locationFish) {
      const adjustedRarity = fish.rarity + (rodLevel * 0.1) + (baitLevel * 0.05);
      cumulativeRarity += adjustedRarity;
      
      if (random <= cumulativeRarity) {
        return fish;
      }
    }
    
    return null;
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    setIsFishing(false);
    setIsWaiting(false);
    setCaughtFish(null);
    setCastResult(null);
  };

  // Start fishing
  const startFishing = () => {
    if (isFishing) {
      setIsFishing(false);
      setIsWaiting(false);
      setCaughtFish(null);
      return;
    }

    if (!castResult) {
      setShowCasting(true);
      return;
    }

    playSound('cast');
    checkMissions('play_count');
    
    setIsFishing(true);
    setIsWaiting(true);
    setCaughtFish(null);
    startHookAnimation();
    
    const baseWaitTime = Math.max(1000, 3000 - (lineLevel * 500));
    const rodAccuracyBonus = currentRod ? currentRod.accuracy / 100 : 1;
    const waitTime = Math.max(1000, baseWaitTime * rodAccuracyBonus);
    
    setTimeout(() => {
      setIsWaiting(false);
      
      if (showSpecialFish && Math.random() < 0.3) {
        const specialFish = locationSpecialFish[currentLocation.id] || specialFish;
        setCaughtFish(specialFish);
        const points = Math.round(specialFish.points * currentLocation.rewards.coins);
        setScore(prev => prev + points);
        setCoins(prev => prev + points * 2);
        setExp(prev => prev + Math.round(points * currentLocation.rewards.exp));
        setShowSpecialFish(false);
        playSound('success');
        checkMissions('catch_fish');
        checkMissions('earn_points', points);
        Alert.alert('Excellent!', `You caught ${specialFish.name}!`);
      } else {
        const fish = getRandomFish();
        if (fish) {
          setCaughtFish(fish);
          const points = Math.round(fish.points * currentLocation.rewards.coins);
          setScore(prev => prev + points);
          setCoins(prev => prev + points);
          setExp(prev => prev + Math.round(points * currentLocation.rewards.exp));
          playSound('success');
          checkMissions('catch_fish');
          checkMissions('earn_points', points);
        } else {
          playSound('miss');
        }
      }
      
      if (exp >= expToNextLevel) {
        setLevel(prev => prev + 1);
        setExp(0);
        setExpToNextLevel(prev => prev + 50);
        Alert.alert('Level Up!', `Congratulations! You reached level ${level + 1}!`);
      }
      
      saveGameData();
    }, waitTime);
  };

  // Upgrade equipment
  const upgradeItem = (item) => {
    let currentLevel, cost;
    
    switch (item) {
      case 'rod':
        currentLevel = rodLevel;
        cost = upgradeCosts.rod[currentLevel - 1];
        if (currentLevel < 5 && coins >= cost) {
          setCoins(prev => prev - cost);
          setRodLevel(prev => prev + 1);
          playSound('upgrade');
        }
        break;
      case 'bait':
        currentLevel = baitLevel;
        cost = upgradeCosts.bait[currentLevel - 1];
        if (currentLevel < 5 && coins >= cost) {
          setCoins(prev => prev - cost);
          setBaitLevel(prev => prev + 1);
          playSound('upgrade');
        }
        break;
      case 'line':
        currentLevel = lineLevel;
        cost = upgradeCosts.line[currentLevel - 1];
        if (currentLevel < 5 && coins >= cost) {
          setCoins(prev => prev - cost);
          setLineLevel(prev => prev + 1);
          playSound('upgrade');
        }
        break;
    }
    saveGameData();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.currencyContainer}>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyText}>Coins: {coins}</Text>
        </View>
        <View style={styles.currencyBox}>
          <Text style={styles.premiumText}>Premium: {premiumCoins} 💎</Text>
        </View>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => setShopVisible(true)}
        >
          <Text style={styles.shopButtonText}>Shop</Text>
        </TouchableOpacity>
      </View>
      
      {/* Background */}
      <Animated.View style={[styles.water, {
        backgroundColor: waterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [currentLocation.background, currentLocation.waterColor]
        })
      }]} />
      
      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Coins: {coins}</Text>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>EXP: {exp}/{expToNextLevel}</Text>
      </View>
      
      {/* Current Location Info */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{currentLocation.name}</Text>
        <Text style={styles.locationDescription}>{currentLocation.description}</Text>
        <Text style={styles.locationDifficulty}>Difficulty: {currentLocation.difficulty}</Text>
      </View>
      
      {/* Equipment Info */}
      <View style={styles.equipmentInfo}>
        <Text style={styles.equipText}>Rod: {currentRod?.name || 'No Rod'}</Text>
        <Text style={styles.equipText}>Bait: Level {baitLevel}</Text>
        <Text style={styles.equipText}>Line: Level {lineLevel}</Text>
        {castResult && (
          <Text style={styles.castInfo}>
            Cast: {castResult.distance}m
          </Text>
        )}
      </View>
      
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
            {Math.round(caughtFish.points * currentLocation.rewards.coins)} points
          </Text>
        </View>
      )}
      
      {/* Special Fish */}
      {showSpecialFish && (
        <TouchableOpacity style={styles.specialFish} onPress={startFishing}>
          <Text style={styles.specialFishEmoji}>
            {locationSpecialFish[currentLocation.id]?.emoji || specialFish.emoji}
          </Text>
          <Text style={styles.specialFishText}>
            {locationSpecialFish[currentLocation.id]?.name || 'Golden Dragon Fish!'}
          </Text>
          <Text style={styles.specialFishSubtext}>Tap to catch!</Text>
        </TouchableOpacity>
      )}
      
      {/* Fishing Button */}
      <TouchableOpacity style={styles.fishingButton} onPress={startFishing}>
        <Text style={styles.buttonText}>
          {isFishing ? (isWaiting ? 'Waiting for fish...' : 'Reel in!') : 
           castResult ? 'Cast line!' : 'Cast!'}
        </Text>
      </TouchableOpacity>
      
      {/* Control Buttons */}
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setIsSoundOn(!isSoundOn)}>
          <Text style={styles.controlButtonText}>{isSoundOn ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowShop(true)}>
          <Text style={styles.controlButtonText}>🛒</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowMagentoShop(true)}>
          <Text style={styles.controlButtonText}>🏪</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowFishingRodShop(true)}>
          <Text style={styles.controlButtonText}>🎣</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowMissions(true)}>
          <Text style={styles.controlButtonText}>📜</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowLocationSelector(true)}>
          <Text style={styles.controlButtonText}>🗺️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowDonation(true)}>
          <Text style={styles.controlButtonText}>💝</Text>
        </TouchableOpacity>
      </View>
      
      {/* Shop Modal */}
      <Modal visible={showShop} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Shop</Text>
            
            <ScrollView>
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>Rod Level {rodLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, rodLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('rod')}
                  disabled={rodLevel >= 5 || coins < upgradeCosts.rod[rodLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {rodLevel >= 5 ? 'Max Level' : `${upgradeCosts.rod[rodLevel - 1]} coins`}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>Bait Level {baitLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, baitLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('bait')}
                  disabled={baitLevel >= 5 || coins < upgradeCosts.bait[baitLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {baitLevel >= 5 ? 'Max Level' : `${upgradeCosts.bait[baitLevel - 1]} coins`}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>Line Level {lineLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, lineLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('line')}
                  disabled={lineLevel >= 5 || coins < upgradeCosts.line[lineLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {lineLevel >= 5 ? 'Max Level' : `${upgradeCosts.line[lineLevel - 1]} coins`}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowShop(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Missions Modal */}
      <Modal visible={showMissions} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daily Missions</Text>
            
            <ScrollView>
              {dailyMissions.map((mission) => (
                <View key={mission.id} style={styles.missionItem}>
                  <Text style={styles.missionText}>{mission.description}</Text>
                  <Text style={styles.missionProgress}>
                    {mission.progress}/{mission.target}
                  </Text>
                  <Text style={styles.missionReward}>
                    Reward: {mission.reward} coins
                  </Text>
                  {mission.isCompleted && (
                    <Text style={styles.completedText}>✅ Completed</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMissions(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Magento Shop */}
      <MagentoShop
        visible={showMagentoShop}
        onClose={() => setShowMagentoShop(false)}
        playerLevel={level}
        gameCoins={coins}
        onPurchase={(product) => {
          console.log('Purchased:', product.name);
          Alert.alert(
            'Purchase Successful!',
            `You bought ${product.name}! This might improve your fishing luck!`
          );
        }}
      />
      
      {/* Fishing Rod Shop */}
      <FishingRodShop
        visible={showFishingRodShop}
        onClose={() => setShowFishingRodShop(false)}
        playerCoins={coins}
        onPurchase={handleRodPurchase}
        onEquip={handleRodEquip}
      />
      
      {/* Casting Mechanism */}
      <CastingMechanism
        visible={showCasting}
        onClose={() => setShowCasting(false)}
        onCast={handleCast}
        currentRod={currentRod}
        isFishing={isFishing}
        onStartFishing={startFishing}
      />
      
      {/* Location Selector */}
      <LocationSelector
        visible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSelectLocation={handleLocationSelect}
        currentLocation={currentLocation}
        playerLevel={level}
        playerCoins={coins}
      />
      
      {/* Donation Modal */}
      <DonationModal
        visible={showDonation}
        onClose={() => setShowDonation(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    paddingTop: 40,
  },
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
  water: {
    position: 'absolute',
    top: height * 0.4,
    left: 0,
    right: 0,
    bottom: 0,
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shopItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  missionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  missionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  missionProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  missionReward: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
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
    left: width / 2 - 100,
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
});