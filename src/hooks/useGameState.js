import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_SETTINGS } from '../constants';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    coins: GAME_SETTINGS.INITIAL_COINS,
    premiumCoins: GAME_SETTINGS.INITIAL_PREMIUM_COINS,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    adsRemoved: false,
  });

  const saveGameData = async () => {
    try {
      await AsyncStorage.setItem('gameData', JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const loadGameData = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameData');
      if (savedState) {
        const gameState = JSON.parse(savedState);
        setGameState(prevState => ({ ...prevState, ...gameState }));
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  };

  const updateScore = (points) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      exp: prev.exp + points
    }));
  };

  const updateCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount)
    }));
  };

  const updatePremiumCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      premiumCoins: Math.max(0, prev.premiumCoins + amount)
    }));
  };

  const checkLevelUp = () => {
    if (gameState.exp >= gameState.expToNextLevel) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: 0,
        expToNextLevel: prev.expToNextLevel + GAME_SETTINGS.LEVEL_UP_EXP_BONUS
      }));
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    saveGameData();
  }, [gameState]);

  return {
    gameState,
    updateScore,
    updateCoins,
    updatePremiumCoins,
    checkLevelUp,
    saveGameData,
    loadGameData
  };
};

