import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Card } from './Card';
import { RANKS, SUITS, Card as CardType } from '@/constants/poker';
import { useThemeStore } from '@/hooks/useThemeStore';

interface CardDeckProps {
  selectedCards: CardType[];
  onCardSelect: (card: CardType) => void;
  maxSelections?: number;
  size?: 'small' | 'medium' | 'large';
}

export const CardDeck: React.FC<CardDeckProps> = ({
  selectedCards,
  onCardSelect,
  maxSelections = 7,
  size = 'medium',
}) => {
  const { colors } = useThemeStore();
  
  const isCardSelected = (rank: string, suit: string) => {
    return selectedCards.some(
      card => card.rank === rank && card.suit === suit
    );
  };

  const isCardDisabled = (rank: string, suit: string) => {
    return (
      selectedCards.length >= maxSelections && !isCardSelected(rank, suit)
    );
  };

  const handleCardPress = (rank: string, suit: string) => {
    const card = { rank, suit } as CardType;
    onCardSelect(card);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <View style={styles.deck}>
        {SUITS.map(suit => (
          <View key={suit} style={styles.suitRow}>
            {RANKS.map(rank => (
              <Card
                key={`${rank}-${suit}`}
                rank={rank}
                suit={suit}
                size={size}
                selected={isCardSelected(rank, suit)}
                disabled={isCardDisabled(rank, suit)}
                onPress={() => handleCardPress(rank, suit)}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    ...(Platform.OS === 'web' ? { maxHeight: 240 } : {}),
  },
  deck: {
    flexDirection: 'column',
    padding: 8,
    gap: 8,
    ...(Platform.OS === 'web' ? { 
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    } : {}),
  },
  suitRow: {
    flexDirection: 'row',
    gap: 4,
    ...(Platform.OS === 'web' ? { 
      marginRight: 12,
    } : {}),
  },
});