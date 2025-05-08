import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Card as CardType, formatHand, getHandCategory, getHandStrengthCategory } from '@/constants/poker';
import { HandStrengthMeter } from './HandStrengthMeter';
import { useThemeStore } from '@/hooks/useThemeStore';
import { getHandCategoryName, calculateEquity } from '@/utils/pokerEquity';

interface HandAnalysisProps {
  playerCards: CardType[];
  communityCards: CardType[];
  equity?: number;
}

export const HandAnalysis: React.FC<HandAnalysisProps> = ({
  playerCards,
  communityCards,
  equity,
}) => {
  const { colors } = useThemeStore();
  
  if (playerCards.length !== 2) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text, borderBottomColor: colors.border }]}>
          Hand Analysis
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Select your hand to see analysis
        </Text>
      </View>
    );
  }

  const handString = formatHand(playerCards);
  const handCategory = getHandCategory(handString);
  const strengthCategory = getHandStrengthCategory(handString);
  
  // Calculate hand strength
  const isPreflop = communityCards.length === 0;
  
  // Get preflop hand strength by running a quick equity calculation
  const getPreflopHandStrength = (cards: CardType[]): number => {
    if (cards.length !== 2) return 0;
    const { playerEquity } = calculateEquity(cards, [], [], 200);
    return playerEquity;
  };
  
  // Get postflop hand strength based on current equity
  const getPostflopHandStrength = (playerCards: CardType[], communityCards: CardType[]): number => {
    if (equity !== undefined) return equity;
    if (playerCards.length !== 2 || communityCards.length < 3) return 0;
    const { playerEquity } = calculateEquity(playerCards, [], communityCards, 200);
    return playerEquity;
  };
  
  const handStrength = isPreflop 
    ? getPreflopHandStrength(playerCards)
    : getPostflopHandStrength(playerCards, communityCards);
  
  // Get current hand category name
  const currentHandCategory = isPreflop 
    ? "Preflop" 
    : getHandCategoryName([...playerCards, ...communityCards]);

  // Get recommendations based on hand strength and stage
  const getRecommendations = () => {
    const recommendations = [];
    
    if (isPreflop) {
      // Preflop recommendations
      if (strengthCategory === 'Premium' || strengthCategory === 'Strong') {
        recommendations.push('Consider raising 3-4x the big blind');
        recommendations.push('Play aggressively from any position');
        recommendations.push('Re-raise (3-bet) if facing a raise');
      } else if (strengthCategory === 'Medium') {
        recommendations.push('Raise from late position');
        recommendations.push('Call raises from early position');
        recommendations.push('Consider folding to 3-bets unless you have position');
      } else if (strengthCategory === 'Playable') {
        recommendations.push('Play cautiously from late position');
        recommendations.push('Consider folding from early position');
        recommendations.push('Look for favorable flops with straight/flush potential');
      } else {
        recommendations.push('Play only in late position or blinds');
        recommendations.push('Consider folding to any raise');
        recommendations.push('Only continue if you hit the flop well');
      }
    } else {
      // Postflop recommendations
      if (equity !== undefined) {
        if (equity > 0.7) {
          recommendations.push('Your hand is very strong - consider value betting');
          recommendations.push('Aim to build the pot with bets and raises');
          recommendations.push('Be cautious of board texture changes on later streets');
        } else if (equity > 0.5) {
          recommendations.push('You have a good hand - consider betting for value');
          recommendations.push('Be prepared to call reasonable raises');
          recommendations.push('Watch for draws completing on later streets');
        } else if (equity > 0.3) {
          recommendations.push('Your hand is marginal - consider checking');
          recommendations.push('Call small bets if pot odds are favorable');
          recommendations.push('Be prepared to fold to significant pressure');
        } else {
          recommendations.push('Your hand is weak - consider checking and folding');
          recommendations.push('Look for cheap opportunities to improve');
          recommendations.push('Avoid committing chips without significant improvement');
        }
      }
    }
    
    return recommendations;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text, borderBottomColor: colors.border }]}>
        Hand Analysis
      </Text>
      
      <ScrollView style={styles.content}>
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hand Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hand:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{handString}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Category:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{handCategory}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Strength:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{strengthCategory}</Text>
          </View>
          {!isPreflop && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Current Hand:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{currentHandCategory}</Text>
            </View>
          )}
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hand Strength</Text>
          <HandStrengthMeter 
            strength={equity !== undefined ? equity : handStrength} 
            label={equity !== undefined ? "Current Equity" : "Hand Strength"} 
          />
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendations</Text>
          {getRecommendations().map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={[styles.recommendationText, { color: colors.text }]}>
                • {recommendation}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
  },
  content: {
    maxHeight: 300,
    ...(Platform.OS === 'web' ? { maxHeight: 400 } : {}),
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});