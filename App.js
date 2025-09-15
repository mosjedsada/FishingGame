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
import Shop from './components/Shop';

const { width, height } = Dimensions.get('window');

// Fish data
const fishTypes = [
  { name: 'ปลาทอง', points: 10, rarity: 0.5, emoji: '🐟', color: '#FFA500' },
  { name: 'ปลาฉลาม', points: 50, rarity: 0.1, emoji: '🦈', color: '#808080' },
  { name: 'ปลาไหล', points: 20, rarity: 0.3, emoji: '🐍', color: '#8B4513' },
  { name: 'ปลาหมึก', points: 30, rarity: 0.2, emoji: '🦑', color: '#800080' },
  { name: 'ม้าน้ำ', points: 25, rarity: 0.4, emoji: '🐠', color: '#FFA500' },
];

const specialFish = { name: 'ปลามังกรทอง', points: 500, rarity: 0.05, emoji: '🐉', color: '#FFD700' };

// Daily missions
const missionTypes = [
  { type: 'catch_fish', target: 5, reward: 100, description: 'จับปลา 5 ตัว' },
  { type: 'earn_points', target: 100, reward: 150, description: 'ได้คะแนน 100 คะแนน' },
  { type: 'play_count', target: 10, reward: 80, description: 'เล่น 10 ครั้ง' },
];

export default function App() {
  // Game state
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [premiumCoins, setPremiumCoins] = useState(10); // New premium currency
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
  const [isSoundOn, setIsSoundOn] = useState(true);
  
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
      // Handle ad removal
      setAdsRemoved(true);
      AsyncStorage.setItem('adsRemoved', 'true');
      Alert.alert(
        'Success / สำเร็จ', 
        'Ads have been removed! / ระบบได้ลบโฆษณาออกเรียบร้อยแล้ว!'
      );
    } else {
      // Handle coin purchases
      setCoins(prevCoins => prevCoins + item.coins);
      Alert.alert(
        'Purchase Complete / ซื้อสำเร็จ',
        `You received ${item.coins} coins! / คุณได้รับ ${item.coins} เหรียญ!`
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

  // Load premium status
  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('adsRemoved');
      if (status === 'true') {
        setAdsRemoved(true);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
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
            Alert.alert('ภารกิจสำเร็จ!', `ได้รับ ${mission.reward} เหรียญ`);
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
        Alert.alert('ปลาพิเศษปรากฏตัว!', 'มีปลามังกรทองหายากปรากฏตัว! เร็วเข้า ก่อนที่มันจะว่ายหนีไป!');
        playSound('special');
        
        // Hide after 10 seconds
        setTimeout(() => {
          setShowSpecialFish(false);
        }, 10000);
      }
      startSpecialFishTimer();
    }, timer);
  };

  // Get random fish
  const getRandomFish = () => {
    const random = Math.random();
    let cumulativeRarity = 0;
    
    for (const fish of fishTypes) {
      const adjustedRarity = fish.rarity + (rodLevel * 0.1) + (baitLevel * 0.05);
      cumulativeRarity += adjustedRarity;
      
      if (random <= cumulativeRarity) {
        return fish;
      }
    }
    
    return null;
  };

  // Start fishing
  const startFishing = () => {
    if (isFishing) {
      // Reel in
      setIsFishing(false);
      setIsWaiting(false);
      setCaughtFish(null);
      return;
    }

    playSound('cast');
    checkMissions('play_count');
    
    setIsFishing(true);
    setIsWaiting(true);
    setCaughtFish(null);
    startHookAnimation();
    
    // Wait time based on line level
    const waitTime = Math.max(1000, 3000 - (lineLevel * 500));
    
    setTimeout(() => {
      setIsWaiting(false);
      
      // Check for special fish first
      if (showSpecialFish && Math.random() < 0.3) {
        setCaughtFish(specialFish);
        setScore(prev => prev + specialFish.points);
        setCoins(prev => prev + specialFish.points * 2);
        setExp(prev => prev + specialFish.points);
        setShowSpecialFish(false);
        playSound('success');
        checkMissions('catch_fish');
        checkMissions('earn_points', specialFish.points);
        Alert.alert('ยอดเยี่ยม!', 'คุณจับปลามังกรทองได้!');
      } else {
        const fish = getRandomFish();
        if (fish) {
          setCaughtFish(fish);
          setScore(prev => prev + fish.points);
          setCoins(prev => prev + fish.points);
          setExp(prev => prev + fish.points);
          playSound('success');
          checkMissions('catch_fish');
          checkMissions('earn_points', fish.points);
        } else {
          playSound('miss');
        }
      }
      
      // Check level up
      if (exp >= expToNextLevel) {
        setLevel(prev => prev + 1);
        setExp(0);
        setExpToNextLevel(prev => prev + 50);
        Alert.alert('เลื่อนระดับ!', `ยินดีด้วย! คุณได้เลื่อนเป็นระดับ ${level + 1}`);
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
          <Text style={styles.shopButtonText}>Shop / ร้านค้า</Text>
        </TouchableOpacity>
      </View>
      
      {/* Background */}
      <Animated.View style={[styles.water, {
        backgroundColor: waterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['#4A90E2', '#2E5BBA']
        })
      }]} />
      
      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>คะแนน: {score}</Text>
        <Text style={styles.infoText}>เหรียญ: {coins}</Text>
        <Text style={styles.infoText}>ระดับ: {level}</Text>
        <Text style={styles.infoText}>EXP: {exp}/{expToNextLevel}</Text>
      </View>
      
      {/* Equipment Info */}
      <View style={styles.equipmentInfo}>
        <Text style={styles.equipText}>เบ็ด: ระดับ {rodLevel}</Text>
        <Text style={styles.equipText}>เหยื่อ: ระดับ {baitLevel}</Text>
        <Text style={styles.equipText}>สายเบ็ด: ระดับ {lineLevel}</Text>
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
          <Text style={styles.fishPoints}>{caughtFish.points} คะแนน</Text>
        </View>
      )}
      
      {/* Special Fish */}
      {showSpecialFish && (
        <TouchableOpacity style={styles.specialFish} onPress={startFishing}>
          <Text style={styles.specialFishEmoji}>{specialFish.emoji}</Text>
          <Text style={styles.specialFishText}>ปลามังกรทอง!</Text>
          <Text style={styles.specialFishSubtext}>แตะเพื่อจับ!</Text>
        </TouchableOpacity>
      )}
      
      {/* Fishing Button */}
      <TouchableOpacity style={styles.fishingButton} onPress={startFishing}>
        <Text style={styles.buttonText}>
          {isFishing ? (isWaiting ? 'รอปลา...' : 'ดึงเบ็ด!') : 'ทอดเบ็ด!'}
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
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowMissions(true)}>
          <Text style={styles.controlButtonText}>📜</Text>
        </TouchableOpacity>
      </View>
      
      {/* Shop Modal */}
      <Modal visible={showShop} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ร้านค้า</Text>
            
            <ScrollView>
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>เบ็ด ระดับ {rodLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, rodLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('rod')}
                  disabled={rodLevel >= 5 || coins < upgradeCosts.rod[rodLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {rodLevel >= 5 ? 'สูงสุด' : `${upgradeCosts.rod[rodLevel - 1]} เหรียญ`}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>เหยื่อ ระดับ {baitLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, baitLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('bait')}
                  disabled={baitLevel >= 5 || coins < upgradeCosts.bait[baitLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {baitLevel >= 5 ? 'สูงสุด' : `${upgradeCosts.bait[baitLevel - 1]} เหรียญ`}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shopItem}>
                <Text style={styles.shopItemText}>สายเบ็ด ระดับ {lineLevel}</Text>
                <TouchableOpacity 
                  style={[styles.upgradeButton, lineLevel >= 5 && styles.disabledButton]}
                  onPress={() => upgradeItem('line')}
                  disabled={lineLevel >= 5 || coins < upgradeCosts.line[lineLevel - 1]}
                >
                  <Text style={styles.upgradeButtonText}>
                    {lineLevel >= 5 ? 'สูงสุด' : `${upgradeCosts.line[lineLevel - 1]} เหรียญ`}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowShop(false)}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Missions Modal */}
      <Modal visible={showMissions} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ภารกิจประจำวัน</Text>
            
            <ScrollView>
              {dailyMissions.map((mission) => (
                <View key={mission.id} style={styles.missionItem}>
                  <Text style={styles.missionText}>{mission.description}</Text>
                  <Text style={styles.missionProgress}>
                    {mission.progress}/{mission.target}
                  </Text>
                  <Text style={styles.missionReward}>
                    รางวัล: {mission.reward} เหรียญ
                  </Text>
                  {mission.isCompleted && (
                    <Text style={styles.completedText}>✅ สำเร็จ</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMissions(false)}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Shop 
        isVisible={showShop} 
        onClose={() => setShowShop(false)}
        onPurchase={handlePurchase}
      />
      <Shop 
        isVisible={shopVisible} 
        onClose={() => setShopVisible(false)}
        onPurchase={handlePurchase}
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
  },
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
  },
  // Add the handlePurchase function before the return statement
  const handlePurchase = (item) => {
    if (item.id === 'remove_ads') {
      // Handle ad removal
      setAdsRemoved(true);
      AsyncStorage.setItem('adsRemoved', 'true');
      Alert.alert(
        'Success / สำเร็จ', 
        'Ads have been removed! / ระบบได้ลบโฆษณาออกเรียบร้อยแล้ว!'
      );
    } else {
      // Handle coin purchases
      setCoins(prevCoins => prevCoins + item.coins);
      Alert.alert(
        'Purchase Complete / ซื้อสำเร็จ',
        `You received ${item.coins} coins! / คุณได้รับ ${item.coins} เหรียญ!`
      );
    }
  };

  // Add the shop button to the UI
  const renderShopButton = () => (
    <TouchableOpacity 
      style={styles.shopButton}
      onPress={() => setShowShop(true)}
    >
      <Text style={styles.shopButtonText}>Shop / ร้านค้า</Text>
    </TouchableOpacity>
  );

  // Add currency display to the UI
  const renderCurrencyDisplay = () => (
    <View style={styles.currencyContainer}>
      <View style={styles.currencyBox}>
        <Text style={styles.currencyText}>Coins: {coins}</Text>
      </View>
      <View style={styles.currencyBox}>
        <Text style={styles.premiumText}>Premium: {premiumCoins} 💎</Text>
      </View>
      {renderShopButton()}
    </View>
  );

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
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  equipmentInfo: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  equipText: {
    color: 'white',
    fontSize: 12,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
  },
  fishEmoji: {
    fontSize: 40,
  },
  fishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fishPoints: {
    fontSize: 14,
    color: '#666',
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
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  specialFishEmoji: {
    fontSize: 60,
  },
  specialFishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  specialFishSubtext: {
    fontSize: 14,
    color: '#333',
  },
  fishingButton: {
    position: 'absolute',
    bottom: 100,
    left: width / 2 - 75,
    width: 150,
    height: 50,
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  controlButtonText: {
    fontSize: 20,
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
  },
});
