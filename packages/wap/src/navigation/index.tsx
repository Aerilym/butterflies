import { createContext, useEffect, useMemo, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import Main from './MainStack';
import { supabaseAPI, userStore } from '../provider/AuthProvider';
import Loading from '../screens/utility/Loading';
import Auth from './AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import OnboardingStack from './OnboardingStack';

const AuthContext = createContext({});

// TODO: Separate the Auth Provider into its own file.
export default () => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const isMobileDevice = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const { data, error } = await supabaseAPI.supabase.auth.getSession();

      if (error || !data) return dispatch({ type: 'SIGN_IN', token: null });

      dispatch({ type: 'RESTORE_TOKEN', token: data.session?.access_token });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (session: Session) => {
        await AsyncStorage.setItem('@session', JSON.stringify(session));
        supabaseAPI.userID = session.user.id;
        await userStore.refreshProfile();
        await userStore.getStoredProfile();
        userStore.getSocials();
        userStore.getMatchQueue();
        dispatch({ type: 'SIGN_IN', token: session.access_token });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('@session');
        userStore.clearUserProfile();
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  useEffect(() => {
    const { data: authListener } = supabaseAPI.supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event, session);
        switch (event) {
          case 'SIGNED_OUT':
            authContext.signOut();
            break;

          default:
            if (session) authContext.signIn(session);
            break;
        }
      }
    );
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      authListener!.subscription.unsubscribe();
    };
  });

  console.log('stateofStuff', {
    isLoading: state.isLoading,
    userToken: state.userToken,
    onboarded: userStore.profile.onboarded,
  });

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <SafeAreaProvider
          style={{
            paddingTop: isMobileDevice ? 25 : 0,
            shadowRadius: isMobileDevice ? undefined : 10,
            maxWidth: isMobileDevice ? '100%' : 412,
            maxHeight: isMobileDevice ? '100%' : 915,
          }}
        >
          {state.isLoading ? (
            <Loading />
          ) : state.userToken ? (
            userStore.profile.onboarded ? (
              <Main />
            ) : (
              <OnboardingStack />
            )
          ) : (
            <Auth />
          )}
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
