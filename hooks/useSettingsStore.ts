import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // Display settings
  showEquityPercentage: boolean;
  autoSolve: boolean;
  saveHandHistory: boolean;
  
  // Calculation settings
  equityIterations: number;
  gtoIterations: number;
  
  // Actions
  setShowEquityPercentage: (value: boolean) => void;
  setAutoSolve: (value: boolean) => void;
  setSaveHandHistory: (value: boolean) => void;
  setEquityIterations: (value: number) => void;
  setGtoIterations: (value: number) => void;
  resetSettings: () => void;
}

// Default settings
const DEFAULT_SETTINGS = {
  showEquityPercentage: true,
  autoSolve: false,
  saveHandHistory: true,
  equityIterations: 1000,
  gtoIterations: 1000,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      setShowEquityPercentage: (value) => set({ showEquityPercentage: value }),
      setAutoSolve: (value) => set({ autoSolve: value }),
      setSaveHandHistory: (value) => set({ saveHandHistory: value }),
      setEquityIterations: (value) => set({ equityIterations: value }),
      setGtoIterations: (value) => set({ gtoIterations: value }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);