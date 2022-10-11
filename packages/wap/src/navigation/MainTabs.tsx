import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Swipe from '../screens/main/Swipe';
import Dashboard from '../screens/main/Dashboard';
import Matches from '../screens/main/Matches';
import TabBarText from '../components/utility/TabBarText';
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
          tabBarLabel: ({ focused }) => <TabBarText focused={focused} title="Swipe" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'albums-outline'} />,
        }}
      />
      <Tabs.Screen
        name="Matches"
        component={Matches}
        options={{
          tabBarLabel: ({ focused }) => <TabBarText focused={focused} title="Matches" />,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={'chatbubble-ellipses-outline'} />
          ),
        }}
      />
      <Tabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: ({ focused }) => <TabBarText focused={focused} title="Dashboard" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'person'} />,
        }}
      />
    </Tabs.Navigator>
  );
}
