import { useState, useEffect } from 'react';
import { MISSION_TYPES } from '../constants';

export const useMissions = () => {
  const [missions, setMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState(0);

  const generateDailyMissions = () => {
    const newMissions = MISSION_TYPES.map((mission, index) => ({
      ...mission,
      id: index,
      progress: 0,
      isCompleted: false,
    }));
    setMissions(newMissions);
  };

  const checkMissionProgress = (type, amount = 1) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.type === type && !mission.isCompleted) {
          const newProgress = mission.progress + amount;
          const isCompleted = newProgress >= mission.target;
          
          if (isCompleted && !mission.isCompleted) {
            setCompletedMissions(prev => prev + 1);
            return {
              ...mission,
              progress: Math.min(newProgress, mission.target),
              isCompleted,
              reward: mission.reward
            };
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

  const getCompletedMissions = () => {
    return missions.filter(mission => mission.isCompleted);
  };

  const getActiveMissions = () => {
    return missions.filter(mission => !mission.isCompleted);
  };

  const resetMissions = () => {
    generateDailyMissions();
    setCompletedMissions(0);
  };

  useEffect(() => {
    generateDailyMissions();
  }, []);

  return {
    missions,
    completedMissions,
    checkMissionProgress,
    getCompletedMissions,
    getActiveMissions,
    resetMissions,
    generateDailyMissions
  };
};

