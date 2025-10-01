// Fish data
export const FISH_TYPES = [
  { name: 'Goldfish', points: 10, rarity: 0.5, emoji: '🐟', color: '#FFA500' },
  { name: 'Shark', points: 50, rarity: 0.1, emoji: '🦈', color: '#808080' },
  { name: 'Eel', points: 20, rarity: 0.3, emoji: '🐍', color: '#8B4513' },
  { name: 'Squid', points: 30, rarity: 0.2, emoji: '🦑', color: '#800080' },
  { name: 'Seahorse', points: 25, rarity: 0.4, emoji: '🐠', color: '#FFA500' },
];

export const SPECIAL_FISH = { 
  name: 'Golden Dragon Fish', 
  points: 500, 
  rarity: 0.05, 
  emoji: '🐉', 
  color: '#FFD700' 
};

// Mission types
export const MISSION_TYPES = [
  { type: 'catch_fish', target: 5, reward: 100, description: 'Catch 5 fish' },
  { type: 'earn_points', target: 100, reward: 150, description: 'Earn 100 points' },
  { type: 'play_count', target: 10, reward: 80, description: 'Play 10 times' },
];

// Equipment costs
export const UPGRADE_COSTS = {
  rod: [200, 500, 1000, 2000],
  bait: [100, 300, 600, 1200],
  line: [150, 400, 800, 1500],
};

// Game settings
export const GAME_SETTINGS = {
  MAX_LEVEL: 5,
  BASE_WAIT_TIME: 3000,
  SPECIAL_FISH_TIMER: 120000, // 2 minutes
  SPECIAL_FISH_DURATION: 10000, // 10 seconds
  LEVEL_UP_EXP_BONUS: 50,
  INITIAL_COINS: 100,
  INITIAL_PREMIUM_COINS: 10,
};

// Animation settings
export const ANIMATION_SETTINGS = {
  WATER_DURATION: 2000,
  HOOK_DURATION: 1000,
  FISHING_LINE_HEIGHT: 0.4, // 40% of screen height
};

// Sound settings
export const SOUND_SETTINGS = {
  CLICK_SOUND: './assets/sounds/click.mp3',
  SUCCESS_SOUND: './assets/sounds/success.mp3',
  MISS_SOUND: './assets/sounds/miss.mp3',
};

// UI Constants
export const UI_CONSTANTS = {
  MODAL_WIDTH: 0.9,
  MODAL_MAX_HEIGHT: 0.8,
  CONTROL_BUTTON_SIZE: 50,
  FISHING_BUTTON_WIDTH: 150,
  FISHING_BUTTON_HEIGHT: 60,
};

