import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DEFAULT_RANGES, POSITION_NAMES } from '@/constants/poker';
import { useThemeStore } from '@/hooks/useThemeStore';

interface RangeSelectorProps {
  selectedPosition: string;
  selectedRange: string[];
  onPositionChange: (position: string) => void;
  onRangeChange: (range: string[]) => void;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  selectedPosition,
  selectedRange,
  onPositionChange,
  onRangeChange,
}) => {
  const { colors } = useThemeStore();
  
  const handlePositionSelect = (position: string) => {
    onPositionChange(position);
    // Load default range for this position
    onRangeChange(DEFAULT_RANGES[position as keyof typeof DEFAULT_RANGES] || []);
  };

  const handleClearRange = () => {
    onRangeChange([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text, borderBottomColor: colors.border }]}>
        Range Selector
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.positionsScroll}>
        <View style={styles.positionsContainer}>
          {POSITION_NAMES.map(position => (
            <TouchableOpacity
              key={position}
              style={[
                styles.positionButton,
                { backgroundColor: colors.lightGray },
                selectedPosition === position && { backgroundColor: colors.primary },
              ]}
              onPress={() => handlePositionSelect(position)}
            >
              <Text
                style={[
                  styles.positionText,
                  { color: colors.textSecondary },
                  selectedPosition === position && { color: colors.card },
                ]}
              >
                {position}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={[styles.actionsContainer, { borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.lightGray }]} 
          onPress={handleClearRange}
        >
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Clear</Text>
        </TouchableOpacity>
        
        <View style={styles.rangeInfoContainer}>
          <Text style={[styles.rangeInfoText, { color: colors.textSecondary }]}>
            {selectedRange.length} hands selected ({((selectedRange.length / 169) * 100).toFixed(1)}%)
          </Text>
        </View>
      </View>
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
  positionsScroll: {
    maxHeight: 60,
  },
  positionsContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  positionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rangeInfoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  rangeInfoText: {
    fontSize: 14,
  },
});