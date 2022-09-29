import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Filters from '../screens/Filters';
import Settings from '../screens/Settings';
import AddAccount from '../screens/AddAccount';
import MainTabs from './MainTabs';

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Filters" component={Filters} />
      <MainStack.Screen name="Settings" component={Settings} />
      <MainStack.Screen name="AddAccount" component={AddAccount} />
    </MainStack.Navigator>
  );
};

export default Main;
