import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';

// Hooks
import { useGameState } from './src/hooks/useGameState';
import { useFishing } from './src/hooks/useFishing';
import { useEquipment } from './src/hooks/useEquipment';
import { useMissions } from './src/hooks/useMissions';

// Components
import GameHeader from './src/components/GameHeader';
import FishingArea from './src/components/FishingArea';
import GameInfo from './src/components/GameInfo';
import ControlPanel from './src/components/ControlPanel';

// Modal Components
import ShopModal from './components/ShopModal';
import LocationSelector from './components/LocationSelector';
import CastingMechanism from './components/CastingMechanism';
import MagentoShop from './components/MagentoShop';
import FishingRodShop from './components/FishingRodShop';
import DonationModal from './components/DonationModal';

// Services
import SoundService from './src/services/SoundService';

// Data
import { fishingLocations } from './components/LocationData';
import { GAME_SETTINGS } from './src/constants';

export default function App() {
  // Game State
  const {
    gameState,
    updateScore,
    updateCoins,
    updatePremiumCoins,
    checkLevelUp,
  } = useGameState();

  // Equipment State
  const {
    equipment,
    currentRod,
    ownedRods,
    upgradeEquipment,
    purchaseRod,
    equipRod,
  } = useEquipment();

  // Location State
  const [currentLocation, setCurrentLocation] = useState(fishingLocations[0]);

  // Fishing State
  const {
    fishingState,
    hookAnimation,
    waterAnimation,
    startFishing,
    startWaterAnimation,
    startSpecialFishTimer,
    castLine,
    resetFishing,
  } = useFishing(gameState, currentLocation, currentRod);

  // Missions State
  const {
    missions,
    checkMissionProgress,
    getActiveMissions,
  } = useMissions();

  // Sound State
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Modal States
  const [showShop, setShowShop] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showCasting, setShowCasting] = useState(false);
  const [showMagentoShop, setShowMagentoShop] = useState(false);
  const [showFishingRodShop, setShowFishingRodShop] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showDonation, setShowDonation] = useState(false);

  // Initialize
  useEffect(() => {
    startWaterAnimation();
    startSpecialFishTimer();
    SoundService.initialize();
  }, []);

  // Handle Level Up
  useEffect(() => {
    const leveledUp = checkLevelUp();
    if (leveledUp) {
      Alert.alert(
        'Level Up! 🎉',
        `You reached level ${gameState.level}!`,
        [{ text: 'OK' }]
      );
      if (isSoundOn) {
        SoundService.playSuccess();
      }
    }
  }, [gameState.exp]);

  // Handle Fishing
  const handleFishingPress = () => {
    if (!fishingState.isFishing && !fishingState.castResult) {
      setShowCasting(true);
      return;
    }

    if (fishingState.isFishing && !fishingState.isWaiting) {
      // Reel in the fish
      const caughtFish = fishingState.caughtFish;
      if (caughtFish) {
        const baseReward = caughtFish.points;
        const locationMultiplier = currentLocation?.rewards?.coins || 1.0;
        const expMultiplier = currentLocation?.rewards?.exp || 1.0;
        const finalCoins = Math.round(baseReward * locationMultiplier);
        const finalExp = Math.round(baseReward * expMultiplier);

        updateScore(finalExp);
        updateCoins(finalCoins);
        
        // Check missions
        checkMissionProgress('catch_fish', 1);
        checkMissionProgress('earn_points', finalExp);
        checkMissionProgress('play_count', 1);

        if (isSoundOn) {
          SoundService.playSuccess();
        }

        Alert.alert(
          `Caught ${caughtFish.name}! 🎣`,
          `+${finalCoins} coins, +${finalExp} EXP`,
          [{ text: 'OK' }]
        );
      } else {
        if (isSoundOn) {
          SoundService.playMiss();
        }
        Alert.alert('Missed!', 'The fish got away...', [{ text: 'OK' }]);
      }

      resetFishing();
    } else {
      startFishing();
    }
  };

  // Handle Special Fish
  const handleSpecialFishPress = () => {
    const specialFish = {
      name: 'Golden Dragon Fish',
      emoji: '🐉',
      points: 500,
      rarity: 0.05,
      color: '#FFD700'
    };

    const locationMultiplier = currentLocation?.rewards?.coins || 1.0;
    const finalCoins = Math.round(specialFish.points * locationMultiplier * 2);

    updateScore(specialFish.points);
    updateCoins(finalCoins);
    updatePremiumCoins(5);

    if (isSoundOn) {
      SoundService.playSuccess();
    }

    Alert.alert(
      '🐉 Golden Dragon Fish! 🐉',
      `Amazing! +${finalCoins} coins, +${specialFish.points} EXP, +5 premium coins!`,
      [{ text: 'Awesome!' }]
    );

    checkMissionProgress('catch_fish', 1);
    checkMissionProgress('earn_points', specialFish.points);
  };

  // Handle Cast
  const handleCast = (castResult) => {
    castLine(castResult);
    if (isSoundOn) {
      SoundService.playClick();
    }
  };

  // Handle Location Change
  const handleLocationChange = (location) => {
    if (location.level > gameState.level) {
      Alert.alert(
        'Locked Location',
        `Reach level ${location.level} to unlock this location.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (location.unlockCost > 0 && gameState.coins < location.unlockCost) {
      Alert.alert(
        'Not Enough Coins',
        `You need ${location.unlockCost} coins to unlock this location.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (location.unlockCost > 0) {
      updateCoins(-location.unlockCost);
    }

    setCurrentLocation(location);
    resetFishing();
    
    if (isSoundOn) {
      SoundService.playClick();
    }

    Alert.alert(
      'Location Changed',
      `Now fishing at ${location.name}!`,
      [{ text: 'OK' }]
    );
  };

  // Handle Shop Purchase
  const handleShopPurchase = (item) => {
    if (item.id === 'remove_ads') {
      Alert.alert('Thank You!', 'Ads have been removed!', [{ text: 'OK' }]);
    } else {
      updateCoins(item.coins);
      Alert.alert(
        'Purchase Successful!',
        `You received ${item.coins} coins!`,
        [{ text: 'OK' }]
      );
    }

    if (isSoundOn) {
      SoundService.playClick();
    }
  };

  // Handle Rod Purchase
  const handleRodPurchase = (rod) => {
    const result = purchaseRod(rod, gameState.coins);
    if (result.success) {
      updateCoins(-result.cost);
      Alert.alert('Success!', `You purchased ${rod.name}!`, [{ text: 'OK' }]);
      if (isSoundOn) {
        SoundService.playSuccess();
      }
    } else {
      Alert.alert('Not Enough Coins', 'You need more coins!', [{ text: 'OK' }]);
    }
  };

  // Handle Rod Equip
  const handleRodEquip = (rod) => {
    equipRod(rod);
    Alert.alert('Success!', `Equipped ${rod.name}!`, [{ text: 'OK' }]);
    if (isSoundOn) {
      SoundService.playClick();
    }
  };

  // Handle Sound Toggle
  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    if (!isSoundOn) {
      SoundService.playClick();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Game Screen */}
      <View style={styles.gameContainer}>
        {/* Header */}
        <GameHeader
          coins={gameState.coins}
          premiumCoins={gameState.premiumCoins}
          onShopPress={() => setShowShop(true)}
          onSoundToggle={toggleSound}
          isSoundOn={isSoundOn}
        />

        {/* Game Info Panels */}
        <GameInfo
          score={gameState.score}
          coins={gameState.coins}
          level={gameState.level}
          exp={gameState.exp}
          expToNextLevel={gameState.expToNextLevel}
          currentLocation={currentLocation}
          currentRod={currentRod}
          equipment={equipment}
          castResult={fishingState.castResult}
        />

        {/* Fishing Area */}
        <FishingArea
          fishingState={fishingState}
          hookAnimation={hookAnimation}
          waterAnimation={waterAnimation}
          currentLocation={currentLocation}
          onFishingPress={handleFishingPress}
          onSpecialFishPress={handleSpecialFishPress}
        />

        {/* Control Panel */}
        <ControlPanel
          onShopPress={() => setShowShop(true)}
          onMagentoShopPress={() => setShowMagentoShop(true)}
          onFishingRodShopPress={() => setShowFishingRodShop(true)}
          onMissionsPress={() => setShowMissions(true)}
          onLocationSelectorPress={() => setShowLocationSelector(true)}
          onDonationPress={() => setShowDonation(true)}
        />
      </View>

      {/* Modals */}
      <ShopModal
        visible={showShop}
        onClose={() => setShowShop(false)}
        onPurchase={handleShopPurchase}
      />

      <LocationSelector
        visible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSelectLocation={handleLocationChange}
        currentLocation={currentLocation}
        playerLevel={gameState.level}
        playerCoins={gameState.coins}
      />

      <CastingMechanism
        visible={showCasting}
        onClose={() => setShowCasting(false)}
        onCast={handleCast}
        currentRod={currentRod}
        isFishing={fishingState.isFishing}
        onStartFishing={startFishing}
      />

      <MagentoShop
        visible={showMagentoShop}
        onClose={() => setShowMagentoShop(false)}
        coins={gameState.coins}
        onPurchase={(item) => {
          updateCoins(item.coins || 0);
          Alert.alert('Purchase Successful!', `You bought ${item.name}!`);
        }}
      />

      <FishingRodShop
        visible={showFishingRodShop}
        onClose={() => setShowFishingRodShop(false)}
        coins={gameState.coins}
        ownedRods={ownedRods}
        currentRod={currentRod}
        onPurchaseRod={handleRodPurchase}
        onEquipRod={handleRodEquip}
      />

      <DonationModal
        visible={showDonation}
        onClose={() => setShowDonation(false)}
        onDonate={() => {
          Alert.alert('Thank You! 💝', 'Your support means a lot!');
          setShowDonation(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameContainer: {
    flex: 1,
  },
});

