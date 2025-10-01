import { Audio } from 'expo-av';
import { SOUND_SETTINGS } from '../constants';

class SoundService {
  constructor() {
    this.sound = null;
    this.isEnabled = true;
  }

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async playSound(soundName) {
    if (!this.isEnabled) return;
    
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/click.mp3')
      );
      this.sound = sound;
      await sound.playAsync();
    } catch (error) {
      console.log('Sound error:', error);
    }
  }

  async playClick() {
    await this.playSound('click');
  }

  async playSuccess() {
    await this.playSound('success');
  }

  async playMiss() {
    await this.playSound('miss');
  }

  async playSpecial() {
    await this.playSound('special');
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export default new SoundService();

