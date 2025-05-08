import { create } from 'zustand';
import { Card, BoardCards, Position } from '@/constants/poker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PokerState {
  // Cards
  playerCards: Card[];
  opponentCards: Card[];
  communityCards: Card[];
  
  // Ranges
  selectedPosition: Position;
  selectedRange: string[];
  
  // Equity
  playerEquity: number | null;
  opponentEquity: number | null;
  tieEquity: number | null;
  
  // Game state
  potSize: number;
  betSize: number;
  stackSize: number;
  isPreflop: boolean;
  
  // Hand history
  handHistory: {
    playerCards: Card[];
    communityCards: Card[];
    result?: string;
    timestamp: number;
  }[];
  
  // Actions
  addPlayerCard: (card: Card) => void;
  removePlayerCard: (card: Card) => void;
  clearPlayerCards: () => void;
  
  addOpponentCard: (card: Card) => void;
  removeOpponentCard: (card: Card) => void;
  clearOpponentCards: () => void;
  
  addCommunityCard: (card: Card) => void;
  removeCommunityCard: (card: Card) => void;
  clearCommunityCards: () => void;
  
  setSelectedPosition: (position: Position) => void;
  setSelectedRange: (range: string[]) => void;
  
  setEquity: (playerEquity: number, opponentEquity: number, tieEquity: number) => void;
  clearEquity: () => void;
  
  setPotSize: (size: number) => void;
  setBetSize: (size: number) => void;
  setStackSize: (size: number) => void;
  setIsPreflop: (isPreflop: boolean) => void;
  
  addHandToHistory: (result?: string) => void;
  clearHandHistory: () => void;
  
  // Reset all
  resetAll: () => void;
}

export const usePokerStore = create<PokerState>()(
  persist(
    (set, get) => ({
      // Initial state
      playerCards: [],
      opponentCards: [],
      communityCards: [],
      selectedPosition: 'BTN',
      selectedRange: [],
      playerEquity: null,
      opponentEquity: null,
      tieEquity: null,
      potSize: 100,
      betSize: 75,
      stackSize: 1000,
      isPreflop: true,
      handHistory: [],
      
      // Player cards actions
      addPlayerCard: (card) => set((state) => {
        if (state.playerCards.length >= 2) return state;
        if (state.playerCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.opponentCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.communityCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        
        return { playerCards: [...state.playerCards, card] };
      }),
      
      removePlayerCard: (card) => set((state) => ({
        playerCards: state.playerCards.filter(
          c => !(c.rank === card.rank && c.suit === card.suit)
        ),
      })),
      
      clearPlayerCards: () => set({ playerCards: [] }),
      
      // Opponent cards actions
      addOpponentCard: (card) => set((state) => {
        if (state.opponentCards.length >= 2) return state;
        if (state.playerCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.opponentCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.communityCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        
        return { opponentCards: [...state.opponentCards, card] };
      }),
      
      removeOpponentCard: (card) => set((state) => ({
        opponentCards: state.opponentCards.filter(
          c => !(c.rank === card.rank && c.suit === card.suit)
        ),
      })),
      
      clearOpponentCards: () => set({ opponentCards: [] }),
      
      // Community cards actions
      addCommunityCard: (card) => set((state) => {
        if (state.communityCards.length >= 5) return state;
        if (state.playerCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.opponentCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        if (state.communityCards.some(c => c.rank === card.rank && c.suit === card.suit)) return state;
        
        const newCommunityCards = [...state.communityCards, card];
        
        // Update isPreflop based on community cards
        const isPreflop = newCommunityCards.length === 0;
        
        return { 
          communityCards: newCommunityCards,
          isPreflop
        };
      }),
      
      removeCommunityCard: (card) => set((state) => {
        const newCommunityCards = state.communityCards.filter(
          c => !(c.rank === card.rank && c.suit === card.suit)
        );
        
        // Update isPreflop based on community cards
        const isPreflop = newCommunityCards.length === 0;
        
        return { 
          communityCards: newCommunityCards,
          isPreflop
        };
      }),
      
      clearCommunityCards: () => set({ 
        communityCards: [],
        isPreflop: true
      }),
      
      // Range actions
      setSelectedPosition: (position) => set({ selectedPosition: position }),
      setSelectedRange: (range) => set({ selectedRange: range }),
      
      // Equity actions
      setEquity: (playerEquity, opponentEquity, tieEquity) => set({ 
        playerEquity, 
        opponentEquity,
        tieEquity
      }),
      
      clearEquity: () => set({ 
        playerEquity: null, 
        opponentEquity: null,
        tieEquity: null
      }),
      
      // Game state actions
      setPotSize: (potSize) => set({ potSize }),
      setBetSize: (betSize) => set({ betSize }),
      setStackSize: (stackSize) => set({ stackSize }),
      setIsPreflop: (isPreflop) => set({ isPreflop }),
      
      // Hand history actions
      addHandToHistory: (result) => set((state) => {
        if (state.playerCards.length !== 2) return state;
        
        const newHistory = [
          {
            playerCards: [...state.playerCards],
            communityCards: [...state.communityCards],
            result,
            timestamp: Date.now()
          },
          ...state.handHistory
        ].slice(0, 50); // Keep only the last 50 hands
        
        return { handHistory: newHistory };
      }),
      
      clearHandHistory: () => set({ handHistory: [] }),
      
      // Reset all
      resetAll: () => set({
        playerCards: [],
        opponentCards: [],
        communityCards: [],
        playerEquity: null,
        opponentEquity: null,
        tieEquity: null,
        potSize: 100,
        betSize: 75,
        stackSize: 1000,
        isPreflop: true,
      }),
    }),
    {
      name: 'poker-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);