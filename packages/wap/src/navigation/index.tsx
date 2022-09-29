import React, { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

import { NavigationContainer } from '@react-navigation/native';

import Main from './MainStack';
import Auth from './AuthStack';
import Onboarding from './OnboardingStack';
import Loading from '../screens/utils/Loading';

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  const newUser = auth.newUser;

  function isNewUser(creationDate: string): boolean {
    if (creationDate === null) return true;
    const cDate = new Date().valueOf();
    const userDate = new Date(creationDate || '').valueOf();
    const diff = cDate - userDate;
    if (diff < 300000) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
    </NavigationContainer>
  );
};
