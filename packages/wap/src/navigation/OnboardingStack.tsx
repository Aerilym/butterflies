import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Information from '../screens/onboarding/Information';

const OnboardingStack = createNativeStackNavigator();
const Onboarding = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OnboardingStack.Screen name="Information" component={Information} />
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
