import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/auth/Login';
import Onboarding from '../screens/auth/Onboarding';

const AuthStack = createNativeStackNavigator();
export default function Auth() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Onboarding" component={Onboarding} />
    </AuthStack.Navigator>
  );
}
