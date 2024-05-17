import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import store from '@/app/store';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Contacts',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='user' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='codepen' color={color} />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
