import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Card as CardType } from '@/constants/poker';
import { ActionButton } from './ActionButton';
import { useThemeStore } from '@/hooks/useThemeStore';
import { calculateEquity } from '@/utils/pokerEquity';
import { useSettingsStore } from '@/hooks/useSettingsStore';

interface EquityCalculatorProps {
  playerCards: CardType[];
  opponentCards: CardType[];
  communityCards: CardType[];
  onCalculate?: (playerEquity: number, opponentEquity: number, tieEquity: number) => void;
}

export const EquityCalculator: React.FC<EquityCalculatorProps> = ({
  playerCards,
  opponentCards,
  communityCards,
  onCalculate,
}) => {
  const { colors } = useThemeStore();
  const { equityIterations, setEquityIterations } = useSettingsStore();
  
  const [calculating, setCalculating] = useState(false);
  const [playerEquity, setPlayerEquity] = useState<number | null>(null);
  const [opponentEquity, setOpponentEquity] = useState<number | null>(null);
  const [tieEquity, setTieEquity] = useState<number | null>(null);

  const handleCalculate = () => {
    if (playerCards.length !== 2) return;
    
    setCalculating(true);
    
    // Use setTimeout to prevent UI freezing during calculation
    setTimeout(() => {
      try {
        const result = calculateEquity(
          playerCards,
          opponentCards,
          communityCards,
          equityIterations
        );
        
        setPlayerEquity(result.playerEquity);
        setOpponentEquity(result.opponentEquity);
        setTieEquity(result.tie);
        
        if (onCalculate) {
          onCalculate(result.playerEquity, result.opponentEquity, result.tie);
        }
      } catch (error) {
        console.error("Error calculating equity:", error);
      } finally {
        setCalculating(false);
      }
    }, 100);
  };

  const increaseIterations = () => {
    setEquityIterations(Math.min(equityIterations * 2, 100000));
  };

  const decreaseIterations = () => {
    setEquityIterations(Math.max(equityIterations / 2, 100));
  };

  useEffect(() => {
    // Reset equity when cards change
    setPlayerEquity(null);
    setOpponentEquity(null);
    setTieEquity(null);
  }, [playerCards, opponentCards, communityCards]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.card }]}>Equity Calculator</Text>
      </View>
      
      <View style={styles.content}>
        {calculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Calculating equity...
            </Text>
          </View>
        ) : (
          <>
            {playerEquity !== null && (
              <View style={styles.resultsContainer}>
                <View style={[styles.equityItem, { backgroundColor: colors.lightGray }]}>
                  <Text style={[styles.equityLabel, { color: colors.textSecondary }]}>
                    Your Equity
                  </Text>
                  <Text style={[styles.equityValue, { color: colors.text }]}>
                    {(playerEquity * 100).toFixed(2)}%
                  </Text>
                </View>
                
                <View style={[styles.equityItem, { backgroundColor: colors.lightGray }]}>
                  <Text style={[styles.equityLabel, { color: colors.textSecondary }]}>
                    Opponent Equity
                  </Text>
                  <Text style={[styles.equityValue, { color: colors.text }]}>
                    {(opponentEquity! * 100).toFixed(2)}%
                  </Text>
                </View>
                
                {tieEquity! > 0 && (
                  <View style={[styles.equityItem, { backgroundColor: colors.lightGray }]}>
                    <Text style={[styles.equityLabel, { color: colors.textSecondary }]}>
                      Tie Equity
                    </Text>
                    <Text style={[styles.equityValue, { color: colors.text }]}>
                      {(tieEquity! * 100).toFixed(2)}%
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <View style={styles.iterationsContainer}>
              <Text style={[styles.iterationsLabel, { color: colors.textSecondary }]}>
                Iterations: {equityIterations.toLocaleString()}
              </Text>
              <View style={styles.iterationsButtons}>
                <ActionButton
                  label="-"
                  onPress={decreaseIterations}
                  variant="outline"
                  size="small"
                  disabled={equityIterations <= 100}
                />
                <ActionButton
                  label="+"
                  onPress={increaseIterations}
                  variant="outline"
                  size="small"
                  disabled={equityIterations >= 100000}
                />
              </View>
            </View>
            
            <ActionButton
              label="Calculate Equity"
              onPress={handleCalculate}
              variant="primary"
              fullWidth
              disabled={playerCards.length !== 2}
              testID="calculate-equity-button"
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    ...(Platform.OS === 'web' ? { maxWidth: '100%' } : {}),
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  equityItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 100,
  },
  equityLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  equityValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iterationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iterationsLabel: {
    fontSize: 14,
  },
  iterationsButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});