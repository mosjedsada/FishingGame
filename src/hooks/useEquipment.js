import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPGRADE_COSTS, GAME_SETTINGS } from '../constants';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState({
    rod: { level: 1, cost: 200 },
    bait: { level: 1, cost: 100 },
    line: { level: 1, cost: 150 }
  });

  const [currentRod, setCurrentRod] = useState(null);
  const [ownedRods, setOwnedRods] = useState([]);

  const loadEquipment = async () => {
    try {
      const savedEquipment = await AsyncStorage.getItem('equipment');
      if (savedEquipment) {
        const equipmentData = JSON.parse(savedEquipment);
        setEquipment(equipmentData);
      }
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const saveEquipment = async () => {
    try {
      await AsyncStorage.setItem('equipment', JSON.stringify(equipment));
    } catch (error) {
      console.error('Error saving equipment:', error);
    }
  };

  const upgradeEquipment = (type, coins) => {
    const currentLevel = equipment[type]?.level || 1;
    const cost = UPGRADE_COSTS[type]?.[currentLevel - 1];
    
    if (currentLevel < GAME_SETTINGS.MAX_LEVEL && coins >= cost) {
      setEquipment(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          level: prev[type].level + 1,
          cost: UPGRADE_COSTS[type]?.[prev[type].level] || prev[type].cost
        }
      }));
      return { success: true, cost };
    }
    return { success: false, cost: 0 };
  };

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

  const purchaseRod = (rod, coins) => {
    if (coins >= rod.price) {
      const updatedRods = [...ownedRods];
      const rodIndex = updatedRods.findIndex(r => r.id === rod.id);
      if (rodIndex >= 0) {
        updatedRods[rodIndex] = { ...updatedRods[rodIndex], owned: true };
      } else {
        updatedRods.push({ ...rod, owned: true });
      }
      setOwnedRods(updatedRods);
      AsyncStorage.setItem('fishingRods', JSON.stringify(updatedRods));
      return { success: true, cost: rod.price };
    }
    return { success: false, cost: 0 };
  };

  const equipRod = (rod) => {
    const updatedRods = ownedRods.map(r => ({
      ...r,
      equipped: r.id === rod.id
    }));
    setOwnedRods(updatedRods);
    setCurrentRod(rod);
    AsyncStorage.setItem('fishingRods', JSON.stringify(updatedRods));
  };

  const getEquipmentStats = (type) => {
    const level = equipment[type]?.level || 1;
    const baseStats = {
      rod: { accuracy: 70, durability: 100 },
      bait: { attraction: 50, duration: 60 },
      line: { strength: 80, length: 100 }
    };
    
    const stats = baseStats[type] || {};
    return Object.keys(stats).reduce((acc, key) => {
      acc[key] = stats[key] + (level - 1) * 10;
      return acc;
    }, {});
  };

  useEffect(() => {
    loadEquipment();
    loadFishingRods();
  }, []);

  useEffect(() => {
    saveEquipment();
  }, [equipment]);

  return {
    equipment,
    currentRod,
    ownedRods,
    upgradeEquipment,
    purchaseRod,
    equipRod,
    getEquipmentStats,
    loadEquipment,
    saveEquipment
  };
};

