// Game Types
export const FishType = {
  GOLDFISH: 'goldfish',
  SHARK: 'shark',
  EEL: 'eel',
  SQUID: 'squid',
  SEAHORSE: 'seahorse',
  DRAGON: 'dragon'
};

export const MissionType = {
  CATCH_FISH: 'catch_fish',
  EARN_POINTS: 'earn_points',
  PLAY_COUNT: 'play_count'
};

export const EquipmentType = {
  ROD: 'rod',
  BAIT: 'bait',
  LINE: 'line'
};

export const GameState = {
  IDLE: 'idle',
  CASTING: 'casting',
  FISHING: 'fishing',
  WAITING: 'waiting',
  REELING: 'reeling'
};

// Fish data structure
export const createFish = (name, points, rarity, emoji, color) => ({
  name,
  points,
  rarity,
  emoji,
  color
});

// Mission data structure
export const createMission = (type, target, reward, description) => ({
  type,
  target,
  reward,
  description,
  progress: 0,
  isCompleted: false
});

// Equipment data structure
export const createEquipment = (type, level, cost, stats) => ({
  type,
  level,
  cost,
  stats
});

// Game state structure
export const createGameState = () => ({
  score: 0,
  coins: 100,
  premiumCoins: 10,
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  adsRemoved: false,
  equipment: {
    rod: { level: 1, cost: 200 },
    bait: { level: 1, cost: 100 },
    line: { level: 1, cost: 150 }
  },
  fishing: {
    isFishing: false,
    caughtFish: null,
    isWaiting: false,
    castResult: null
  },
  location: null,
  missions: [],
  sound: {
    isOn: true
  }
});

