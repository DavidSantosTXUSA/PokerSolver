import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { HandRange } from '@/components/HandRange';
import { RangeSelector } from '@/components/RangeSelector';
import { ActionButton } from '@/components/ActionButton';
import { usePokerStore } from '@/hooks/usePokerStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { generateStartingHands, Position } from '@/constants/poker';

export default function RangesScreen() {
  const { colors } = useThemeStore();
  const { selectedPosition, selectedRange, setSelectedPosition, setSelectedRange } = usePokerStore();
  const [showingInfo, setShowingInfo] = useState(false);
  
  const allHands = generateStartingHands();
  
  const handleHandSelect = (hand: string) => {
    try {
      const newRange = selectedRange.includes(hand)
        ? selectedRange.filter(h => h !== hand)
        : [...selectedRange, hand];
      
      setSelectedRange(newRange);
    } catch (error) {
      console.error("Error selecting hand:", error);
      Alert.alert("Error", "There was an error selecting this hand. Please try again.");
    }
  };
  
  const handleSelectAll = () => {
    setSelectedRange(allHands);
  };
  
  const handleClearAll = () => {
    setSelectedRange([]);
  };
  
  const handleToggleInfo = () => {
    setShowingInfo(prev => !prev);
  };

  // Type-safe position change handler
  const handlePositionChange = (pos: string) => {
    setSelectedPosition(pos as Position);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Hand Ranges' }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <RangeSelector
          selectedPosition={selectedPosition}
          selectedRange={selectedRange}
          onPositionChange={handlePositionChange}
          onRangeChange={setSelectedRange}
        />
        
        <View style={styles.actionsContainer}>
          <ActionButton
            label="Select All"
            onPress={handleSelectAll}
            variant="outline"
            size="small"
          />
          
          <ActionButton
            label="Clear All"
            onPress={handleClearAll}
            variant="outline"
            size="small"
          />
          
          <ActionButton
            label={showingInfo ? "Hide Info" : "Show Info"}
            onPress={handleToggleInfo}
            variant="outline"
            size="small"
          />
        </View>
        
        {showingInfo && (
          <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Range Colors</Text>
            <View style={styles.infoItem}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.rangeStrong }]} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Strong hands (AA, KK, AK, etc.)
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.rangeMedium }]} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Medium hands (TT-77, AJ, KQ, etc.)
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.rangeWeak }]} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Weak hands (small pairs, weak suited, etc.)
              </Text>
            </View>
          </View>
        )}
        
        <View style={[styles.rangeContainer, { backgroundColor: colors.card }]}>
          <HandRange
            selectedHands={selectedRange}
            onHandSelect={handleHandSelect}
          />
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  rangeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    marginVertical: 8,
    ...(Platform.OS === 'web' ? { maxHeight: 500 } : {}),
  },
  infoContainer: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
  },
});