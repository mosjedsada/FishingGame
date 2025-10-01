import { FISH_TYPES, SPECIAL_FISH, GAME_SETTINGS } from '../constants';

export const calculateFishPoints = (fish, location, isSpecial = false) => {
  const basePoints = fish.points;
  const locationMultiplier = location?.rewards?.coins || 1;
  const specialMultiplier = isSpecial ? 2 : 1;
  
  return Math.round(basePoints * locationMultiplier * specialMultiplier);
};

export const calculateExpGain = (points, location) => {
  const locationMultiplier = location?.rewards?.exp || 1;
  return Math.round(points * locationMultiplier);
};

export const calculateWaitTime = (lineLevel, rodAccuracy) => {
  const baseWaitTime = Math.max(1000, GAME_SETTINGS.BASE_WAIT_TIME - (lineLevel * 500));
  const accuracyBonus = rodAccuracy ? rodAccuracy / 100 : 1;
  return Math.max(1000, baseWaitTime * accuracyBonus);
};

export const getRandomFish = (locationFish, rodLevel, baitLevel) => {
  const fishList = locationFish || FISH_TYPES;
  const random = Math.random();
  let cumulativeRarity = 0;
  
  for (const fish of fishList) {
    const adjustedRarity = fish.rarity + (rodLevel * 0.1) + (baitLevel * 0.05);
    cumulativeRarity += adjustedRarity;
    
    if (random <= cumulativeRarity) {
      return fish;
    }
  }
  
  return null;
};

export const checkLevelUp = (currentExp, expToNextLevel) => {
  return currentExp >= expToNextLevel;
};

export const calculateNextLevelExp = (currentLevel) => {
  return 100 + (currentLevel * GAME_SETTINGS.LEVEL_UP_EXP_BONUS);
};

export const getEquipmentBonus = (equipmentType, level) => {
  const bonuses = {
    rod: { accuracy: 70 + (level * 10), durability: 100 + (level * 20) },
    bait: { attraction: 50 + (level * 15), duration: 60 + (level * 10) },
    line: { strength: 80 + (level * 12), length: 100 + (level * 25) }
  };
  
  return bonuses[equipmentType] || {};
};

export const formatCurrency = (amount, currency = 'coins') => {
  if (currency === 'premium') {
    return `${amount} 💎`;
  }
  return `${amount} 🪙`;
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getRarityColor = (rarity) => {
  if (rarity >= 0.8) return '#FFD700'; // Gold
  if (rarity >= 0.6) return '#C0C0C0'; // Silver
  if (rarity >= 0.4) return '#CD7F32'; // Bronze
  if (rarity >= 0.2) return '#4CAF50'; // Green
  return '#2196F3'; // Blue
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    'Easy': '#4CAF50',
    'Medium': '#FF9800',
    'Hard': '#F44336',
    'Expert': '#9C27B0',
    'Master': '#FF5722'
  };
  return colors[difficulty] || '#666';
};

