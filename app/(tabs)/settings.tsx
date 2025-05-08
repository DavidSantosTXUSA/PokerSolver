import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { usePokerStore } from '@/hooks/usePokerStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { ActionButton } from '@/components/ActionButton';
import { Info, Heart, ExternalLink, Moon, Sun } from 'lucide-react-native';

/** Will add unsued settings later like reset settings, setAutoSolve etc */
export default function SettingsScreen() {
  const { resetAll } = usePokerStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const { 
    showEquityPercentage, 
    autoSolve, 
    saveHandHistory,
    equityIterations,
    gtoIterations,
    setShowEquityPercentage,
    setAutoSolve,
    setSaveHandHistory,
    setEquityIterations,
    setGtoIterations,
    resetSettings
  } = useSettingsStore();
  
  
  
  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLabelContainer}>
              {isDarkMode ? 
                <Moon size={20} color={colors.textSecondary} style={styles.settingIcon} /> : 
                <Sun size={20} color={colors.textSecondary} style={styles.settingIcon} />
              }
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Calculator Settings</Text>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Equity Iterations</Text>
            <View style={styles.iterationSelector}>
              {[500, 1000, 5000, 10000].map(value => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.iterationButton,
                    { backgroundColor: colors.lightGray },
                    equityIterations === value && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setEquityIterations(value)}
                >
                  <Text
                    style={[
                      styles.iterationText,
                      { color: colors.textSecondary },
                      equityIterations === value && { color: colors.card }
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>GTO Iterations</Text>
            <View style={styles.iterationSelector}>
              {[500, 1000, 5000, 10000].map(value => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.iterationButton,
                    { backgroundColor: colors.lightGray },
                    gtoIterations === value && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setGtoIterations(value)}
                >
                  <Text
                    style={[
                      styles.iterationText,
                      { color: colors.textSecondary },
                      gtoIterations === value && { color: colors.card }
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
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
    ...(Platform.OS === 'web' ? { maxWidth: 800, alignSelf: 'center', width: '100%' } : {}),
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 14,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutText: {
    fontSize: 14,
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 12,
  },
  buttonsContainer: {
    gap: 8,
  },
  resetButton: {
    marginVertical: 4,
  },
  iterationSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  iterationButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  iterationText: {
    fontSize: 12,
    fontWeight: '500',
  },
});