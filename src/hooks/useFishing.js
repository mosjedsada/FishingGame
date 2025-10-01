import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { FISH_TYPES, SPECIAL_FISH, GAME_SETTINGS } from '../constants';

export const useFishing = (gameState, currentLocation, currentRod) => {
  const [fishingState, setFishingState] = useState({
    isFishing: false,
    caughtFish: null,
    isWaiting: false,
    castResult: null,
    showSpecialFish: false
  });

  const hookAnimation = useRef(new Animated.Value(0.5)).current;
  const waterAnimation = useRef(new Animated.Value(0)).current;

  const getRandomFish = () => {
    const locationFish = FISH_TYPES; // Simplified for now
    const random = Math.random();
    let cumulativeRarity = 0;
    
    for (const fish of locationFish) {
      const adjustedRarity = fish.rarity + (gameState.equipment?.rod?.level * 0.1) + (gameState.equipment?.bait?.level * 0.05);
      cumulativeRarity += adjustedRarity;
      
      if (random <= cumulativeRarity) {
        return fish;
      }
    }
    
    return null;
  };

  const startFishing = () => {
    if (fishingState.isFishing) {
      setFishingState(prev => ({
        ...prev,
        isFishing: false,
        isWaiting: false,
        caughtFish: null
      }));
      return;
    }

    if (!fishingState.castResult) {
      // Show casting interface
      return;
    }

    setFishingState(prev => ({
      ...prev,
      isFishing: true,
      isWaiting: true,
      caughtFish: null
    }));

    startHookAnimation();
    
    const baseWaitTime = Math.max(1000, GAME_SETTINGS.BASE_WAIT_TIME - (gameState.equipment?.line?.level * 500));
    const rodAccuracyBonus = currentRod ? currentRod.accuracy / 100 : 1;
    const waitTime = Math.max(1000, baseWaitTime * rodAccuracyBonus);
    
    setTimeout(() => {
      setFishingState(prev => ({
        ...prev,
        isWaiting: false
      }));
      
      if (fishingState.showSpecialFish && Math.random() < 0.3) {
        const specialFish = SPECIAL_FISH;
        setFishingState(prev => ({
          ...prev,
          caughtFish: specialFish
        }));
        return { fish: specialFish, isSpecial: true };
      } else {
        const fish = getRandomFish();
        if (fish) {
          setFishingState(prev => ({
            ...prev,
            caughtFish: fish
          }));
          return { fish, isSpecial: false };
        }
      }
      
      return { fish: null, isSpecial: false };
    }, waitTime);
  };

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

  const startSpecialFishTimer = () => {
    const timer = Math.random() * GAME_SETTINGS.SPECIAL_FISH_TIMER + 60000;
    setTimeout(() => {
      if (!fishingState.showSpecialFish) {
        setFishingState(prev => ({
          ...prev,
          showSpecialFish: true
        }));
        
        setTimeout(() => {
          setFishingState(prev => ({
            ...prev,
            showSpecialFish: false
          }));
        }, GAME_SETTINGS.SPECIAL_FISH_DURATION);
      }
      startSpecialFishTimer();
    }, timer);
  };

  const castLine = (result) => {
    setFishingState(prev => ({
      ...prev,
      castResult: result
    }));
  };

  const resetFishing = () => {
    setFishingState({
      isFishing: false,
      caughtFish: null,
      isWaiting: false,
      castResult: null,
      showSpecialFish: false
    });
  };

  return {
    fishingState,
    hookAnimation,
    waterAnimation,
    startFishing,
    startHookAnimation,
    startWaterAnimation,
    startSpecialFishTimer,
    castLine,
    resetFishing,
    getRandomFish
  };
};
