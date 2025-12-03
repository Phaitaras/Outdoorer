import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { HomeIcon, MapIcon, FlagIcon, UserIcon } from 'lucide-react-native';
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
            <FlagIcon size={size} color={color} />
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
    </Tabs>
    </SafeAreaView>
  );
}
