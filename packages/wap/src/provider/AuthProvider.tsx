import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { SB_URL, SB_KEY } from '@env';

const isWeb = Platform.OS === 'web';

export const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: AsyncStorage,
    detectSessionInUrl: isWeb ? true : false,
  },
});

type ContextProps = {
  session: null | Session;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [session, setSessionState] = useState<null | Session>(null);

  // Get current auth state from AsyncStorage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSessionState = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('session');
      if (sessionString) {
        setSessionState(JSON.parse(sessionString));
      } else {
        setSessionState(null);
      }
    } catch (err) {
      setSessionState(null);
      Promise.reject(err);
    }
  };

  // Update AsyncStorage & context state
  const setSession = async (session: null | Session) => {
    try {
      setSessionState(session);
      await AsyncStorage.setItem('session', JSON.stringify(session));
    } catch (error) {
      setSessionState(null);
      Promise.reject(error);
    }
  };

  useEffect(() => {
    getSessionState();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        setSession(session);
      }
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion  
      authListener!.subscription.unsubscribe();
    };
  });

  return (
    <AuthContext.Provider
      value={{
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
