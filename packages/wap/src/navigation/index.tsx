import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../screens/utility/Loading';
import { AuthContext } from '../provider/AuthProvider';

export default () => {
  const { session, sessionChecked } = useContext(AuthContext);
  const userID = session?.user?.id;
  const hasAuth = !!userID;

  const isReady = sessionChecked;

  const isMobileDevice = Platform.OS === 'ios' || Platform.OS === 'android';

  return (
    <NavigationContainer>
      <SafeAreaProvider
        style={{
          shadowRadius: isMobileDevice ? undefined : 10,
          maxWidth: isMobileDevice ? '100%' : 412,
          maxHeight: isMobileDevice ? '100%' : 915,
        }}
      >
        {!isReady ? <Loading /> : hasAuth ? <Main /> : <Auth />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
