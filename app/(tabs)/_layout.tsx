import { Tabs } from 'expo-router';
import { HomeIcon, LandPlot, MapIcon, UserIcon } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFAE00]" edges={['top']}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          height: '10%',
          paddingTop: 10,
          paddingHorizontal: 10,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        },
        tabBarLabelStyle: {
          marginTop: 1,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MapIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => (
            <LandPlot size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'You',
          tabBarIcon: ({ color, size }) => (
            <UserIcon size={size} color={color} />
          ),
        }}
      />
      {/* Hidden tab for activity detail so all tabs can push to it without adding per-tab routes */}
      <Tabs.Screen
        name="activity"
        options={{
          href: null,
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
