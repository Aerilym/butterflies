import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import Filters from '../screens/profile/Filters';
import Profile from '../screens/profile/Profile';
import Settings from '../screens/settings/Settings';
import { MainStackParamList } from '../types/navigation';

const MainStack = createNativeStackNavigator<MainStackParamList>();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Filters" component={Filters} />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="Settings" component={Settings} />
    </MainStack.Navigator>
  );
};

export default Main;
