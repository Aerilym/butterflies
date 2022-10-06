import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/auth/Login';

const AuthStack = createNativeStackNavigator();
export default function Auth() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}
