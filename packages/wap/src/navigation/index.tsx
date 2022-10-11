import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../screens/utility/Loading';
import { AuthContext } from '../provider/AuthProvider';

export default () => {
  const { session } = useContext(AuthContext);
  const userID = session?.user?.id;
  const hasAuth = !!userID;
  return (
    <NavigationContainer>
      {hasAuth == null && <Loading />}
      {hasAuth == false && <Auth />}
      {hasAuth == true && <Main />}
    </NavigationContainer>
  );
};
