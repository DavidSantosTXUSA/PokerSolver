import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Suit, Rank } from '@/constants/poker';
import { Heart, Club, Diamond, Spade } from 'lucide-react-native';
import { useThemeStore } from '@/hooks/useThemeStore';

interface CardProps {
  rank: Rank;
  suit: Suit;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  rank,
  suit,
  size = 'medium',
  selected = false,
  disabled = false,
  onPress,
}) => {
  const { colors, getCardColor } = useThemeStore();
  
  const getSuitIcon = () => {
    const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
    const color = getCardColor(suit);
    
    switch (suit) {
      case 'hearts':
        return <Heart size={iconSize} color={color} fill={color} />;
      case 'diamonds':
        return <Diamond size={iconSize} color={color} fill={color} />;
      case 'clubs':
        return <Club size={iconSize} color={color} />;
      case 'spades':
        return <Spade size={iconSize} color={color} />;
    }
  };

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { width: 30, height: 40, borderRadius: 4 };
      case 'medium':
        return { width: 40, height: 56, borderRadius: 6 };
      case 'large':
        return { width: 60, height: 84, borderRadius: 8 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 16;
      case 'large':
        return 24;
    }
  };

  const textColor = getCardColor(suit);

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        getCardSize(),
        { backgroundColor: colors.card, borderColor: colors.border },
        selected && { borderColor: colors.primary, borderWidth: 2, backgroundColor: `${colors.primary}20` },
        disabled && styles.disabled,
      ]} 
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.rank, { color: textColor, fontSize: getFontSize() }]}>
        {rank}
      </Text>
      <View style={styles.suitContainer}>
        {getSuitIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  rank: {
    fontWeight: 'bold',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  suitContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});