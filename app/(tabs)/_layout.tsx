import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Calculator, BarChart, Settings, Zap } from "lucide-react-native";
import { useThemeStore } from "@/hooks/useThemeStore";

export default function TabLayout() {
  const { colors, isDarkMode } = useThemeStore();
  
  
  useEffect(() => {
   
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          //tabBarIcon: ({ color }) => <Calculator size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ranges"
        options={{
          title: "Ranges",
          tabBarIcon: ({ color }) => <BarChart size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="solver"
        options={{
          title: "Solver",
          tabBarIcon: ({ color }) => <Zap size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}