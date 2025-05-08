import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RANKS } from '@/constants/poker';
import { useThemeStore } from '@/hooks/useThemeStore';

interface HandRangeProps {
  selectedHands: string[];
  onHandSelect: (hand: string) => void;
}

export const HandRange: React.FC<HandRangeProps> = ({
  selectedHands,
  onHandSelect,
}) => {
  const { colors } = useThemeStore();
  
  const getHandColor = (hand: string) => {
    if (!selectedHands.includes(hand)) {
      return colors.lightGray;
    }
    
    // Determine color based on hand strength
    if (hand.length === 2) { // Pocket pairs
      const rank = hand[0];
      const rankIndex = RANKS.indexOf(rank as any);
      
      if (rankIndex <= 3) return colors.rangeStrong; // AA, KK, QQ, JJ
      if (rankIndex <= 7) return colors.rangeMedium; // TT, 99, 88, 77
      return colors.rangeWeak; // 66 and lower
    } else {
      const rank1 = hand[0];
      const rank2 = hand[1];
      const isSuited = hand.endsWith('s');
      
      const rank1Index = RANKS.indexOf(rank1 as any);
      const rank2Index = RANKS.indexOf(rank2 as any);
      
      if (rank1Index <= 1 && rank2Index <= 3) return colors.rangeStrong; // AK, AQ, KQ
      if (rank1Index <= 3 && rank2Index <= 5 && isSuited) return colors.rangeMedium; // Suited connectors and broadway
      return colors.rangeWeak;
    }
  };
  
  // Generate the 13x13 grid of starting hands
  const renderHandGrid = () => {
    const grid = [];
    
    for (let i = 0; i < RANKS.length; i++) {
      const row = [];
      
      for (let j = 0; j < RANKS.length; j++) {
        const rank1 = RANKS[i];
        const rank2 = RANKS[j];
        
        let hand: string;
        if (i === j) {
          // Pocket pair
          hand = `${rank1}${rank1}`;
        } else if (i < j) {
          // Suited hand
          hand = `${rank1}${rank2}s`;
        } else {
          // Offsuit hand
          hand = `${rank1}${rank2}o`;
        }
        
        const backgroundColor = getHandColor(hand);
        
        row.push(
          <TouchableOpacity
            key={hand}
            style={[styles.handCell, { backgroundColor }]}
            onPress={() => onHandSelect(hand)}
          >
            <Text style={[styles.handText, { color: colors.text }]}>
              {i === j ? rank1 + rank1 : rank1 + rank2 + (i < j ? 's' : 'o')}
            </Text>
          </TouchableOpacity>
        );
      }
      
      grid.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {row}
        </View>
      );
    }
    
    return grid;
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.grid}>
        {renderHandGrid()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 4,
  },
  gridRow: {
    flexDirection: 'row',
  },
  handCell: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 2,
  },
  handText: {
    fontSize: 10,
    fontWeight: '500',
  },
});