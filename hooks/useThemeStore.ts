import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Define light and dark theme colors
export const lightTheme = {
  primary: "#3366FF",
  secondary: "#FF6B6B",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6E7A8A",
  border: "#E1E4E8",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",
  info: "#2196F3",
  lightGray: "#F1F3F5",
  darkGray: "#343A40",
  overlay: "rgba(0, 0, 0, 0.5)",
  cardRed: "#E53935",
  cardBlack: "#212121",
  rangeStrong: "#4CAF50",
  rangeMedium: "#FFC107",
  rangeWeak: "#F44336",
  transparent: "transparent",
  tableBackground: "#2E7D32",
  tableBorder: "#4E342E",
};

export const darkTheme = {
  primary: "#5C7CFA",
  secondary: "#FF8787",
  background: "#121212",
  card: "#1E1E1E",
  text: "#F8F9FA",
  textSecondary: "#ADB5BD",
  border: "#343A40",
  success: "#66BB6A",
  warning: "#FFCA28",
  danger: "#EF5350",
  info: "#42A5F5",
  lightGray: "#343A40",
  darkGray: "#212529",
  overlay: "rgba(0, 0, 0, 0.7)",
  cardRed: "#EF5350",
  cardBlack: "#F8F9FA",
  rangeStrong: "#66BB6A",
  rangeMedium: "#FFCA28",
  rangeWeak: "#EF5350",
  transparent: "transparent",
  tableBackground: "#1B5E20",
  tableBorder: "#3E2723",
};

// Card colors for both themes
export const cardColors = {
  light: {
    spades: "#212121",
    clubs: "#212121",
    hearts: "#E53935",
    diamonds: "#E53935",
  },
  dark: {
    spades: "#F8F9FA",
    clubs: "#F8F9FA",
    hearts: "#EF5350",
    diamonds: "#EF5350",
  }
};

interface ThemeState {
  isDarkMode: boolean;
  colors: typeof lightTheme;
  toggleTheme: () => void;
  getCardColor: (suit: string) => string;
}

// Check if we should use dark mode by default based on system preference
const getDefaultDarkMode = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Initialize with default values to prevent undefined errors
const initialState = {
  isDarkMode: getDefaultDarkMode(),
  colors: getDefaultDarkMode() ? darkTheme : lightTheme,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleTheme: () => set(state => {
        const newIsDarkMode = !state.isDarkMode;
        return {
          isDarkMode: newIsDarkMode,
          colors: newIsDarkMode ? darkTheme : lightTheme
        };
      }),
      getCardColor: (suit: string) => {
        const { isDarkMode } = get();
        const themeColors = isDarkMode ? cardColors.dark : cardColors.light;
        return themeColors[suit as keyof typeof themeColors] || "#000000";
      }
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these specific keys
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);