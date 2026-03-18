import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import StoreScreen from '../screens/StoreScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused, emoji }) => (
  <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
    <Text style={[tabStyles.emoji, { opacity: focused ? 1 : 0.45 }]}>{emoji}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    {focused && <View style={tabStyles.activeDot} />}
  </View>
);

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + (insets.bottom || 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom || 8,
          paddingTop: 6,
          elevation: 16,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} emoji="🏠" /> }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Items" focused={focused} emoji="🎒" /> }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabStyles.centerTabWrapper}>
              <View style={[tabStyles.centerOuter, focused && tabStyles.centerOuterActive]}>
                <View style={[tabStyles.centerInner, focused && tabStyles.centerInnerActive]}>
                  <Text style={tabStyles.centerEmoji}>🏪</Text>
                </View>
              </View>
              <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>Store</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="News" focused={focused} emoji="📰" /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} emoji="👤" /> }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, minWidth: 56,
  },
  iconWrapperActive: { backgroundColor: colors.primary + '1A' },
  emoji: { fontSize: 22, marginBottom: 3 },
  label: { fontSize: 9, color: colors.tabInactive, fontWeight: '600' },
  labelActive: { color: colors.primary },
  activeDot: {
    position: 'absolute', bottom: -2,
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.primary,
  },
  centerTabWrapper: {
    alignItems: 'center', justifyContent: 'center',
    marginTop: -20,
  },
  centerOuter: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 3, elevation: 6,
  },
  centerOuterActive: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  centerInner: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.cardBg,
    alignItems: 'center', justifyContent: 'center',
  },
  centerInnerActive: { backgroundColor: colors.primary },
  centerEmoji: { fontSize: 20 },
});