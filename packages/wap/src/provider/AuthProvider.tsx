import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';

import { SupabaseAPI } from '../api/supabase';
import { UserStore } from '../api/UserStore';

export const supabaseAPI = new SupabaseAPI();
export const userStore = new UserStore();

type ContextProps = {
  session: null | Session;
  sessionChecked: boolean;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [session, setSession] = useState<null | Session>(null);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);

  useEffect(() => {
    const { data: authListener } = supabaseAPI.supabase.auth.onAuthStateChange(
      async (event, session) => {
        const userID = session?.user.id ?? null;
        switch (event) {
          case 'SIGNED_OUT':
            setSession(null);
            async () => {
              await AsyncStorage.setItem('@session', JSON.stringify(null));
              userStore.clearUserProfile();
            };
            break;

          default:
            setSession(session);
            async () => {
              await AsyncStorage.setItem('@session', JSON.stringify(session));
            };
            if (userID) {
              supabaseAPI.userID = userID;
              userStore.getStoredProfile();
              userStore.getSocials();
              userStore.getMatchQueue();
            }

            break;
        }
      }
    );
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      authListener!.subscription.unsubscribe();
    };
  });

  /**
   * Check if the user is logged in by checking that a valid refresh token exists
   * in a supabase session, then use the token to set the session. This is run
   * once, when the auth provider is activated. (When the app is launched)
   */
  useEffect(() => {
    supabaseAPI.supabase.auth.getSession().then((res) => {
      if (res.data.session?.refresh_token) {
        supabaseAPI.supabase.auth.setSessionFromToken(res.data.session?.refresh_token).then(() => {
          setSessionChecked(true);
        });
      } else {
        setSessionChecked(true);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        sessionChecked,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
