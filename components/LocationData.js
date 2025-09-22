// ข้อมูลสถานที่ตกปลาต่างๆ
export const fishingLocations = [
  {
    id: 'lake_beginner',
    name: 'ทะเลสาบเริ่มต้น',
    nameEn: 'Beginner Lake',
    level: 1,
    description: 'สถานที่เหมาะสำหรับผู้เริ่มต้น',
    descriptionEn: 'Perfect for beginners',
    image: '🏞️',
    difficulty: 'ง่าย',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก'],
    baseCatchRate: 0.8,
    specialFishChance: 0.1,
    unlockCost: 0,
    background: '#4A90E2',
    waterColor: '#2E5BBA',
    environment: 'lake',
    rewards: {
      coins: 1.0,
      exp: 1.0,
    }
  },
  {
    id: 'river_forest',
    name: 'แม่น้ำป่า',
    nameEn: 'Forest River',
    level: 3,
    description: 'แม่น้ำในป่าลึก มีปลาหายาก',
    descriptionEn: 'Deep forest river with rare fish',
    image: '🌲',
    difficulty: 'ปานกลาง',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก', 'ม้าน้ำ'],
    baseCatchRate: 0.6,
    specialFishChance: 0.2,
    unlockCost: 500,
    background: '#228B22',
    waterColor: '#006400',
    environment: 'forest',
    rewards: {
      coins: 1.5,
      exp: 1.3,
    }
  },
  {
    id: 'ocean_shore',
    name: 'ชายฝั่งมหาสมุทร',
    nameEn: 'Ocean Shore',
    level: 5,
    description: 'ชายฝั่งมหาสมุทร มีปลาใหญ่',
    descriptionEn: 'Ocean shore with big fish',
    image: '🌊',
    difficulty: 'ยาก',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก', 'ม้าน้ำ', 'ปลาฉลาม'],
    baseCatchRate: 0.4,
    specialFishChance: 0.3,
    unlockCost: 1500,
    background: '#1E90FF',
    waterColor: '#000080',
    environment: 'ocean',
    rewards: {
      coins: 2.0,
      exp: 1.8,
    }
  },
  {
    id: 'mountain_lake',
    name: 'ทะเลสาบภูเขา',
    nameEn: 'Mountain Lake',
    level: 7,
    description: 'ทะเลสาบบนภูเขาสูง ปลาหายากมาก',
    descriptionEn: 'High mountain lake with very rare fish',
    image: '🏔️',
    difficulty: 'ยากมาก',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก', 'ม้าน้ำ', 'ปลาฉลาม'],
    baseCatchRate: 0.3,
    specialFishChance: 0.4,
    unlockCost: 3000,
    background: '#8B4513',
    waterColor: '#2F4F4F',
    environment: 'mountain',
    rewards: {
      coins: 3.0,
      exp: 2.5,
    }
  },
  {
    id: 'deep_ocean',
    name: 'มหาสมุทรลึก',
    nameEn: 'Deep Ocean',
    level: 10,
    description: 'มหาสมุทรลึก มีปลายักษ์',
    descriptionEn: 'Deep ocean with giant fish',
    image: '🌌',
    difficulty: 'ยากที่สุด',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก', 'ม้าน้ำ', 'ปลาฉลาม'],
    baseCatchRate: 0.2,
    specialFishChance: 0.5,
    unlockCost: 5000,
    background: '#191970',
    waterColor: '#000000',
    environment: 'deep_ocean',
    rewards: {
      coins: 5.0,
      exp: 4.0,
    }
  },
  {
    id: 'arctic_sea',
    name: 'ทะเลอาร์กติก',
    nameEn: 'Arctic Sea',
    level: 12,
    description: 'ทะเลน้ำแข็ง มีปลาแอนตาร์กติก',
    descriptionEn: 'Frozen sea with antarctic fish',
    image: '🧊',
    difficulty: 'สุดยอด',
    fishTypes: ['ปลาทอง', 'ปลาไหล', 'ปลาหมึก', 'ม้าน้ำ', 'ปลาฉลาม'],
    baseCatchRate: 0.15,
    specialFishChance: 0.6,
    unlockCost: 8000,
    background: '#B0E0E6',
    waterColor: '#4682B4',
    environment: 'arctic',
    rewards: {
      coins: 8.0,
      exp: 6.0,
    }
  }
];

// ปลาพิเศษสำหรับแต่ละสถานที่
export const locationSpecialFish = {
  lake_beginner: {
    name: 'ปลาทองราชา',
    emoji: '👑',
    points: 100,
    rarity: 0.05,
    color: '#FFD700'
  },
  river_forest: {
    name: 'ปลาแฟนตาซี',
    emoji: '✨',
    points: 200,
    rarity: 0.03,
    color: '#FF69B4'
  },
  ocean_shore: {
    name: 'ปลาโลมาเงิน',
    emoji: '🐬',
    points: 300,
    rarity: 0.02,
    color: '#C0C0C0'
  },
  mountain_lake: {
    name: 'ปลามังกรน้ำแข็ง',
    emoji: '❄️',
    points: 500,
    rarity: 0.015,
    color: '#00BFFF'
  },
  deep_ocean: {
    name: 'ปลาไดโนเสาร์',
    emoji: '🦕',
    points: 800,
    rarity: 0.01,
    color: '#8B4513'
  },
  arctic_sea: {
    name: 'ปลาเพนกวินจักรพรรดิ',
    emoji: '🐧',
    points: 1200,
    rarity: 0.005,
    color: '#FF4500'
  }
};

// ปลาปกติสำหรับแต่ละสถานที่
export const locationFishTypes = {
  lake_beginner: [
    { name: 'ปลาทอง', points: 10, rarity: 0.5, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 20, rarity: 0.3, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 30, rarity: 0.2, emoji: '🦑', color: '#800080' }
  ],
  river_forest: [
    { name: 'ปลาทอง', points: 15, rarity: 0.4, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 25, rarity: 0.3, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 35, rarity: 0.2, emoji: '🦑', color: '#800080' },
    { name: 'ม้าน้ำ', points: 40, rarity: 0.1, emoji: '🐠', color: '#FFA500' }
  ],
  ocean_shore: [
    { name: 'ปลาทอง', points: 20, rarity: 0.3, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 30, rarity: 0.25, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 40, rarity: 0.2, emoji: '🦑', color: '#800080' },
    { name: 'ม้าน้ำ', points: 50, rarity: 0.15, emoji: '🐠', color: '#FFA500' },
    { name: 'ปลาฉลาม', points: 80, rarity: 0.1, emoji: '🦈', color: '#808080' }
  ],
  mountain_lake: [
    { name: 'ปลาทอง', points: 25, rarity: 0.25, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 35, rarity: 0.2, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 45, rarity: 0.2, emoji: '🦑', color: '#800080' },
    { name: 'ม้าน้ำ', points: 55, rarity: 0.15, emoji: '🐠', color: '#FFA500' },
    { name: 'ปลาฉลาม', points: 100, rarity: 0.1, emoji: '🦈', color: '#808080' }
  ],
  deep_ocean: [
    { name: 'ปลาทอง', points: 30, rarity: 0.2, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 40, rarity: 0.2, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 50, rarity: 0.2, emoji: '🦑', color: '#800080' },
    { name: 'ม้าน้ำ', points: 60, rarity: 0.15, emoji: '🐠', color: '#FFA500' },
    { name: 'ปลาฉลาม', points: 120, rarity: 0.15, emoji: '🦈', color: '#808080' }
  ],
  arctic_sea: [
    { name: 'ปลาทอง', points: 35, rarity: 0.15, emoji: '🐟', color: '#FFA500' },
    { name: 'ปลาไหล', points: 45, rarity: 0.15, emoji: '🐍', color: '#8B4513' },
    { name: 'ปลาหมึก', points: 55, rarity: 0.15, emoji: '🦑', color: '#800080' },
    { name: 'ม้าน้ำ', points: 65, rarity: 0.15, emoji: '🐠', color: '#FFA500' },
    { name: 'ปลาฉลาม', points: 150, rarity: 0.2, emoji: '🦈', color: '#808080' }
  ]
};
