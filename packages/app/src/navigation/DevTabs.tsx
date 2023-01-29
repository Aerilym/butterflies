import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DevHome from '../screens/dev/DevHome';
import DevImages from '../screens/dev/DevImages';
import DevLocation from '../screens/dev/DevLocation';
import DevLogs from '../screens/dev/DevLogs';

import TabBarIcon from '../components/utility/TabBarIcon';
import type { MainStackParamList } from '../types/navigation';

const Tabs = createBottomTabNavigator<MainStackParamList>();
export default function DevTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="DevHome"
        component={DevHome}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'albums'} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="DevImages"
        component={DevImages}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'chatbubble'} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="DevLocation"
        component={DevLocation}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'person'} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="DevLogs"
        component={DevLogs}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon={'person'} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs.Navigator>
  );
}
