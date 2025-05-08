import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { CardDeck } from '@/components/CardDeck';
import { PokerTable } from '@/components/PokerTable';
import { EquityCalculator } from '@/components/EquityCalculator';
import { HandAnalysis } from '@/components/HandAnalysis';
import { ActionButton } from '@/components/ActionButton';
import { usePokerStore } from '@/hooks/usePokerStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { Trash2 } from 'lucide-react-native';

export default function CalculatorScreen() {
  const [activeTab, setActiveTab] = useState<'player' | 'opponent' | 'board'>('player');
  const { colors } = useThemeStore();
  const { autoSolve } = useSettingsStore();
  
  const {
    playerCards,
    opponentCards,
    communityCards,
    playerEquity,
    addPlayerCard,
    removePlayerCard,
    clearPlayerCards,
    addOpponentCard,
    removeOpponentCard,
    clearOpponentCards,
    addCommunityCard,
    removeCommunityCard,
    clearCommunityCards,
    setEquity,
    resetAll,
  } = usePokerStore();

  const handleCardSelect = (card: any) => {
    switch (activeTab) {
      case 'player':
        if (playerCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
          removePlayerCard(card);
        } else {
          addPlayerCard(card);
        }
        break;
      case 'opponent':
        if (opponentCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
          removeOpponentCard(card);
        } else {
          addOpponentCard(card);
        }
        break;
      case 'board':
        if (communityCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
          removeCommunityCard(card);
        } else {
          addCommunityCard(card);
        }
        break;
    }
  };

  const handleClearActive = () => {
    switch (activeTab) {
      case 'player':
        clearPlayerCards();
        break;
      case 'opponent':
        clearOpponentCards();
        break;
      case 'board':
        clearCommunityCards();
        break;
    }
  };

  const handleCalculateEquity = (playerEq: number, opponentEq: number, tieEq: number) => {
    setEquity(playerEq, opponentEq, tieEq);
  };
  
  // Auto-calculate equity when cards change if autoSolve is enabled
  useEffect(() => {
    if (autoSolve && playerCards.length === 2) {
      // Small delay to avoid excessive calculations
      const timer = setTimeout(() => {
        // This will trigger the equity calculation in the EquityCalculator component
        const button = document.getElementById('calculate-equity-button');
        if (button) {
          button.click();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [playerCards, opponentCards, communityCards, autoSolve]);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Poker Calculator',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetAll}
            >
              <Trash2 size={20} color={colors.danger} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.webLayout}>
          <View style={styles.webMainColumn}>
            <PokerTable
              communityCards={communityCards}
              playerCards={playerCards}
              opponentCards={opponentCards}
              showOpponentCards={true}
            />
            
            <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={[
                  styles.tab, 
                  activeTab === 'player' && [styles.activeTab, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('player')}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  activeTab === 'player' && [styles.activeTabText, { color: colors.card }]
                ]}>
                  Your Hand
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab, 
                  activeTab === 'opponent' && [styles.activeTab, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('opponent')}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  activeTab === 'opponent' && [styles.activeTabText, { color: colors.card }]
                ]}>
                  Opponent
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab, 
                  activeTab === 'board' && [styles.activeTab, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('board')}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  activeTab === 'board' && [styles.activeTabText, { color: colors.card }]
                ]}>
                  Board
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.deckContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.deckHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.deckTitle, { color: colors.text }]}>
                  {activeTab === 'player' 
                    ? 'Select Your Hand' 
                    : activeTab === 'opponent' 
                      ? 'Select Opponent Hand' 
                      : 'Select Board Cards'}
                </Text>
                
                <ActionButton
                  label="Clear"
                  onPress={handleClearActive}
                  variant="outline"
                  size="small"
                />
              </View>
              
              <CardDeck
                selectedCards={
                  activeTab === 'player' 
                    ? playerCards 
                    : activeTab === 'opponent' 
                      ? opponentCards 
                      : communityCards
                }
                onCardSelect={handleCardSelect}
                maxSelections={activeTab === 'board' ? 5 : 2}
              />
            </View>
          </View>
          
          <View style={styles.webSideColumn}>
            <EquityCalculator
              playerCards={playerCards}
              opponentCards={opponentCards}
              communityCards={communityCards}
              onCalculate={handleCalculateEquity}
            />
            
            <HandAnalysis
              playerCards={playerCards}
              communityCards={communityCards}
              equity={playerEquity !== null ? playerEquity : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    ...(Platform.OS === 'web' ? { maxWidth: 1200, alignSelf: 'center', width: '100%' } : {}),
  },
  webLayout: {
    ...(Platform.OS === 'web' ? { 
      flexDirection: 'row', 
      flexWrap: 'wrap',
      gap: 16,
    } : {}),
  },
  webMainColumn: {
    ...(Platform.OS === 'web' ? { 
      flex: 3,
      minWidth: 300,
    } : {}),
  },
  webSideColumn: {
    ...(Platform.OS === 'web' ? { 
      flex: 2,
      minWidth: 300,
    } : {}),
  },
  resetButton: {
    padding: 8,
    marginRight: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
  },
  deckContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});