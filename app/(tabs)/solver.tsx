import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { PokerTable } from '@/components/PokerTable';
import { ActionButton } from '@/components/ActionButton';
import { CardDeck } from '@/components/CardDeck';
import { usePokerStore } from '@/hooks/usePokerStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { HandStrengthMeter } from '@/components/HandStrengthMeter';
import { solveForGTO } from '@/utils/gtoSolver';
import { Position, Card as CardType } from '@/constants/poker';

export default function SolverScreen() {
  const { colors } = useThemeStore();
  const { gtoIterations } = useSettingsStore();
  const { 
    playerCards, 
    communityCards, 
    potSize, 
    betSize, 
    stackSize,
    isPreflop,
    selectedPosition,
    addPlayerCard,
    removePlayerCard,
    clearPlayerCards,
    addCommunityCard,
    removeCommunityCard,
    clearCommunityCards,
    setPotSize, 
    setBetSize, 
    setStackSize,
    setIsPreflop,
    setSelectedPosition
  } = usePokerStore();
  
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [actionRecommendations, setActionRecommendations] = useState<{action: string; frequency: number; ev: number}[]>([]);
  const [activeTab, setActiveTab] = useState<'player' | 'board'>('player');
  
  // Local state for input values
  const [potSizeInput, setPotSizeInput] = useState(potSize.toString());
  const [betSizeInput, setBetSizeInput] = useState(betSize.toString());
  
  // Update local state when store values change
  useEffect(() => {
    setPotSizeInput(potSize.toString());
  }, [potSize]);
  
  useEffect(() => {
    setBetSizeInput(betSize.toString());
  }, [betSize]);
  
  const handleSolve = () => {
    if (playerCards.length !== 2) return;
    
    setSolving(true);
    setSolved(false);
    
    // Use setTimeout to prevent UI freezing during calculation
    setTimeout(() => {
      // Generate GTO recommendations using our solver
      const gameState = {
        playerCards,
        communityCards,
        position: selectedPosition as Position,
        potSize,
        betSize,
        stackSize,
        isPreflop
      };
      
      const recommendations = solveForGTO(gameState, gtoIterations);
      setActionRecommendations(recommendations);
      
      setSolving(false);
      setSolved(true);
    }, 100);
  };
  
  // Auto-solve when cards change if autoSolve is enabled
  useEffect(() => {
    if (playerCards.length === 2 && useSettingsStore.getState().autoSolve) {
      handleSolve();
    }
  }, [playerCards, communityCards, potSize, betSize, selectedPosition]);
  
  const handlePotSizeChange = (text: string) => {
    setPotSizeInput(text);
    const value = parseInt(text);
    if (!isNaN(value) && value > 0) {
      setPotSize(value);
    }
  };
  
  const handleBetSizeChange = (text: string) => {
    setBetSizeInput(text);
    const value = parseInt(text);
    if (!isNaN(value) && value > 0) {
      setBetSize(value);
    }
  };
  
  const increasePot = () => {
    const newValue = potSize + 25;
    setPotSize(newValue);
    setPotSizeInput(newValue.toString());
  };
  
  const decreasePot = () => {
    const newValue = Math.max(25, potSize - 25);
    setPotSize(newValue);
    setPotSizeInput(newValue.toString());
  };
  
  const increaseBet = () => {
    const newValue = betSize + 25;
    setBetSize(newValue);
    setBetSizeInput(newValue.toString());
  };
  
  const decreaseBet = () => {
    const newValue = Math.max(25, betSize - 25);
    setBetSize(newValue);
    setBetSizeInput(newValue.toString());
  };
  
  const toggleIsPreflop = () => {
    setIsPreflop(!isPreflop);
  };

  const handleCardSelect = (card: CardType) => {
    if (activeTab === 'player') {
      if (playerCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
        removePlayerCard(card);
      } else {
        addPlayerCard(card);
      }
    } else {
      if (communityCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
        removeCommunityCard(card);
      } else {
        addCommunityCard(card);
      }
    }
  };

  const handleClearActive = () => {
    if (activeTab === 'player') {
      clearPlayerCards();
    } else {
      clearCommunityCards();
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'GTO Solver' }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.webLayout}>
          <View style={styles.webMainColumn}>
            <PokerTable
              communityCards={communityCards}
              playerCards={playerCards}
              potSize={potSize}
            />
            
            <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>Game Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Position</Text>
                <View style={styles.positionSelector}>
                  {['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'].map(pos => (
                    <TouchableOpacity
                      key={pos}
                      style={[
                        styles.positionButton,
                        { backgroundColor: colors.lightGray },
                        selectedPosition === pos && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => setSelectedPosition(pos as Position)}
                    >
                      <Text
                        style={[
                          styles.positionText,
                          { color: colors.textSecondary },
                          selectedPosition === pos && { color: colors.card }
                        ]}
                      >
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Street</Text>
                <TouchableOpacity
                  style={[
                    styles.streetButton,
                    { backgroundColor: colors.lightGray }
                  ]}
                  onPress={toggleIsPreflop}
                >
                  <Text style={[styles.streetText, { color: colors.text }]}>
                    {isPreflop ? 'Preflop' : communityCards.length === 3 ? 'Flop' : 
                      communityCards.length === 4 ? 'Turn' : 'River'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Pot Size ($)</Text>
                <View style={styles.settingControls}>
                  <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: colors.lightGray }]} 
                    onPress={decreasePot}
                  >
                    <Text style={[styles.controlButtonText, { color: colors.textSecondary }]}>-</Text>
                  </TouchableOpacity>
                  
                  <TextInput
                    style={[styles.settingInput, { color: colors.text, borderColor: colors.border }]}
                    value={potSizeInput}
                    onChangeText={handlePotSizeChange}
                    keyboardType="numeric"
                  />
                  
                  <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: colors.lightGray }]} 
                    onPress={increasePot}
                  >
                    <Text style={[styles.controlButtonText, { color: colors.textSecondary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Bet Size ($)</Text>
                <View style={styles.settingControls}>
                  <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: colors.lightGray }]} 
                    onPress={decreaseBet}
                  >
                    <Text style={[styles.controlButtonText, { color: colors.textSecondary }]}>-</Text>
                  </TouchableOpacity>
                  
                  <TextInput
                    style={[styles.settingInput, { color: colors.text, borderColor: colors.border }]}
                    value={betSizeInput}
                    onChangeText={handleBetSizeChange}
                    keyboardType="numeric"
                  />
                  
                  <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: colors.lightGray }]} 
                    onPress={increaseBet}
                  >
                    <Text style={[styles.controlButtonText, { color: colors.textSecondary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.betSizePercentage}>
                <Text style={[styles.betSizeText, { color: colors.textSecondary }]}>
                  {Math.round((betSize / potSize) * 100)}% of pot
                </Text>
              </View>
            </View>

            {/* Card selection in solver tab */}
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
                  {activeTab === 'player' ? 'Select Your Hand' : 'Select Board Cards'}
                </Text>
                
                <ActionButton
                  label="Clear"
                  onPress={handleClearActive}
                  variant="outline"
                  size="small"
                />
              </View>
              
              <CardDeck
                selectedCards={activeTab === 'player' ? playerCards : communityCards}
                onCardSelect={handleCardSelect}
                maxSelections={activeTab === 'board' ? 5 : 2}
              />
            </View>
          </View>
          
          <View style={styles.webSideColumn}>
            <ActionButton
              label={solving ? "Solving..." : "Solve for GTO Play"}
              onPress={handleSolve}
              variant="primary"
              fullWidth
              disabled={solving || playerCards.length !== 2}
            />
            
            {solving && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Running GTO calculations...
                </Text>
              </View>
            )}
            
            {solved && (
              <View style={[styles.resultsContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>GTO Recommendations</Text>
                
                {actionRecommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationHeader}>
                      <Text style={[styles.actionName, { color: colors.text }]}>{rec.action}</Text>
                      <Text style={[styles.actionFrequency, { color: colors.primary }]}>
                        {rec.frequency}%
                      </Text>
                    </View>
                    <HandStrengthMeter 
                      strength={rec.frequency / 100} 
                      label="" 
                      showPercentage={false} 
                    />
                    <Text style={[styles.evText, { color: colors.textSecondary }]}>
                      EV: {rec.ev > 0 ? '+' : ''}{rec.ev.toFixed(2)}
                    </Text>
                  </View>
                ))}
                
                <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
                  Note: These recommendations arent perfected yet. I will continue to update and improve the algorithm!  
                </Text>
              </View>
            )}
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
  settingsContainer: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  settingInput: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 60,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  betSizePercentage: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  betSizeText: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  resultsContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendationItem: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  actionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionFrequency: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  evText: {
    fontSize: 12,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
  },
  positionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 4,
  },
  positionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  positionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  streetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  streetText: {
    fontSize: 14,
    fontWeight: '500',
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