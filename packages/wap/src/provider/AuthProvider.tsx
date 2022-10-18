import React, { createContext, useState, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';

import { SupabaseAPI } from '../api/supabase';
import { Profile } from '../types/database';

export const supabaseAPI = new SupabaseAPI();

type ContextProps = {
  session: null | Session;
  profile: null | Profile;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [session, setSession] = useState<null | Session>(null);
  const [profile, setProfile] = useState<null | Profile>(null);

  //TODO: Reimplement AsyncStorage or storage or some kind (it was breaking the app)

  useEffect(() => {
    const { data: authListener } = supabaseAPI.supabase.auth.onAuthStateChange(
      async (event, session) => {
        const userID = session?.user.id ?? null;
        switch (event) {
          case 'SIGNED_OUT':
            setSession(null);
            setProfile(null);
            break;

          default:
            setSession(session);
            if (userID) {
              supabaseAPI.getProfile(userID).then((profile) => {
                setProfile(profile);
              });
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

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
