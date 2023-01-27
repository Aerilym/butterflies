import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding from '../screens/main/Onboarding';
import type { MainStackParamList } from '../types/navigation';

const MainStack = createNativeStackNavigator<MainStackParamList>();
export default function OnboardingStack() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Onboarding" component={Onboarding} />
    </MainStack.Navigator>
  );
}
