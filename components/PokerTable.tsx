import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card } from './Card';
import { Card as CardType } from '@/constants/poker';
import { useThemeStore } from '@/hooks/useThemeStore';

interface PokerTableProps {
  communityCards: CardType[];
  playerCards?: CardType[];
  opponentCards?: CardType[];
  potSize?: number;
  showOpponentCards?: boolean;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  communityCards,
  playerCards = [],
  opponentCards = [],
  potSize = 0,
  showOpponentCards = false,
}) => {
  const { colors } = useThemeStore();
  
  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={[styles.table, { 
          backgroundColor: colors.tableBackground, 
          borderColor: colors.tableBorder 
        }]}>
          {/* Opponent's position */}
          <View style={styles.opponentPosition}>
            {opponentCards.length > 0 && (
              <View style={styles.handContainer}>
                {showOpponentCards ? (
                  opponentCards.map((card, index) => (
                    <Card
                      key={`opponent-${index}`}
                      rank={card.rank}
                      suit={card.suit}
                      size="small"
                    />
                  ))
                ) : (
                  <>
                    <View style={[styles.cardBack, { borderColor: colors.border }]} />
                    <View style={[styles.cardBack, { borderColor: colors.border }]} />
                  </>
                )}
              </View>
            )}
          </View>
          
          {/* Community cards */}
          <View style={styles.communityCardsContainer}>
            {potSize > 0 && (
              <View style={styles.potContainer}>
                <Text style={[styles.potText, { color: colors.card }]}>Pot: ${potSize}</Text>
              </View>
            )}
            <View style={styles.communityCards}>
              {communityCards.map((card, index) => (
                <Card
                  key={`community-${index}`}
                  rank={card.rank}
                  suit={card.suit}
                  size="medium"
                />
              ))}
              {Array(5 - communityCards.length).fill(0).map((_, index) => (
                <View key={`empty-${index}`} style={[
                  styles.emptyCardSlot, 
                  { borderColor: 'rgba(255, 255, 255, 0.2)' }
                ]} />
              ))}
            </View>
          </View>
          
          {/* Player's position */}
          <View style={styles.playerPosition}>
            {playerCards.length > 0 && (
              <View style={styles.handContainer}>
                {playerCards.map((card, index) => (
                  <Card
                    key={`player-${index}`}
                    rank={card.rank}
                    suit={card.suit}
                    size="small"
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tableContainer: {
    width: '100%',
    aspectRatio: 1.5,
    padding: 8,
    ...(Platform.OS === 'web' ? { maxWidth: 600, maxHeight: 400 } : {}),
  },
  table: {
    flex: 1,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'space-between',
    padding: 16,
  },
  opponentPosition: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playerPosition: {
    alignItems: 'center',
    marginTop: 16,
  },
  communityCardsContainer: {
    alignItems: 'center',
  },
  communityCards: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  handContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  cardBack: {
    width: 30,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1565C0',
    borderWidth: 1,
  },
  emptyCardSlot: {
    width: 40,
    height: 56,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  potContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  potText: {
    fontWeight: 'bold',
  },
});