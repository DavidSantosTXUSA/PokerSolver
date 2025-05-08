import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/hooks/useThemeStore';

interface HandStrengthMeterProps {
  strength: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
}

export const HandStrengthMeter: React.FC<HandStrengthMeterProps> = ({
  strength,
  label = 'Hand Strength',
  showPercentage = true,
}) => {
  const { colors } = useThemeStore();
  
  // Get color based on strength
  const getColor = () => {
    if (strength >= 0.7) return colors.success;
    if (strength >= 0.5) return colors.warning;
    return colors.danger;
  };

  // Get label based on strength
  const getStrengthLabel = () => {
    if (strength >= 0.8) return 'Very Strong';
    if (strength >= 0.65) return 'Strong';
    if (strength >= 0.5) return 'Medium';
    if (strength >= 0.35) return 'Weak';
    return 'Very Weak';
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        {showPercentage && (
          <Text style={[styles.percentage, { color: colors.text }]}>
            {(strength * 100).toFixed(1)}%
          </Text>
        )}
      </View>
      
      <View style={[styles.meterContainer, { backgroundColor: colors.lightGray }]}>
        <View 
          style={[
            styles.meterFill, 
            { width: `${strength * 100}%`, backgroundColor: getColor() }
          ]} 
        />
      </View>
      
      <Text style={[styles.strengthLabel, { color: colors.textSecondary }]}>
        {getStrengthLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  meterContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  strengthLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});