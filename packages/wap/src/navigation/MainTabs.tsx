import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Swipe from '../screens/main/Swipe';
import Dashboard from '../screens/main/Dashboard';
import Matches from '../screens/main/Matches';
import TabBarIcon from '../components/utility/TabBarIcon';
import type { MainStackParamList } from '../types/navigation';

const Tabs = createBottomTabNavigator<MainStackParamList>();
export default function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Swipe"
        component={Swipe}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'albums'} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="Matches"
        component={Matches}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'chatbubble'} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'person'} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs.Navigator>
  );
}
