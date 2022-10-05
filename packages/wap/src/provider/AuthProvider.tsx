import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session } from '@supabase/supabase-js';

import { SB_URL, SB_KEY } from '@env';

export const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: AsyncStorage,
  },
});

type ContextProps = {
  hasAuth: null | boolean;
  session: null | Session;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [hasAuth, setHasAuthState] = useState<null | boolean>(null);
  const [session, setSessionState] = useState<null | Session>(null);

  // Get current auth state from AsyncStorage
  const getHasAuthState = async () => {
    try {
      const authDataString = await AsyncStorage.getItem('auth');
      setHasAuthState(JSON.parse(authDataString || 'false'));
    } catch (err) {
      setHasAuthState(false);
    }
  };

  // Update AsyncStorage & context state
  const setHasAuth = async (hasAuth: null | boolean) => {
    try {
      await AsyncStorage.setItem('auth', JSON.stringify(hasAuth));
      setHasAuthState(hasAuth);
    } catch (error) {
      Promise.reject(error);
    }
  };

  // Get current auth state from AsyncStorage
  const getSessionState = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('session');
      setSessionState(JSON.parse(sessionString || '') as Session);
    } catch (err) {
      setSessionState(null);
    }
  };

  // Update AsyncStorage & context state
  const setSession = async (session: null | Session) => {
    try {
      await AsyncStorage.setItem('session', JSON.stringify(session));
      setSessionState(session);
    } catch (error) {
      Promise.reject(error);
    }
  };

  useEffect(() => {
    getHasAuthState();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);

      switch (event) {
        case 'SIGNED_IN':
          session ? setHasAuth(true) : setHasAuth(false);
          session ? setSession(session) : setSession(null);
          break;

        default:
          setHasAuth(false);
          setSession(null);
          break;
      }
    });
    return () => {
      authListener!.subscription.unsubscribe();
    };
  });

  return (
    <AuthContext.Provider
      value={{
        hasAuth,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
