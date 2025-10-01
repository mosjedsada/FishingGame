import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  constructor() {
    this.keys = {
      GAME_DATA: 'gameData',
      EQUIPMENT: 'equipment',
      FISHING_RODS: 'fishingRods',
      MISSIONS: 'missions',
      SETTINGS: 'settings'
    };
  }

  async save(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }

  async load(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return null;
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  async saveGameData(gameData) {
    return this.save(this.keys.GAME_DATA, gameData);
  }

  async loadGameData() {
    return this.load(this.keys.GAME_DATA);
  }

  async saveEquipment(equipment) {
    return this.save(this.keys.EQUIPMENT, equipment);
  }

  async loadEquipment() {
    return this.load(this.keys.EQUIPMENT);
  }

  async saveFishingRods(rods) {
    return this.save(this.keys.FISHING_RODS, rods);
  }

  async loadFishingRods() {
    return this.load(this.keys.FISHING_RODS);
  }

  async saveMissions(missions) {
    return this.save(this.keys.MISSIONS, missions);
  }

  async loadMissions() {
    return this.load(this.keys.MISSIONS);
  }

  async saveSettings(settings) {
    return this.save(this.keys.SETTINGS, settings);
  }

  async loadSettings() {
    return this.load(this.keys.SETTINGS);
  }
}

export default new StorageService();

