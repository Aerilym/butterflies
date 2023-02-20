import { User } from '@supabase/supabase-js';
import React, { createContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { supabaseInternalClient } from '../../services/supabase';

type ContextProps = {
  userID: null | string;
  user: null | UserData;
  onLogin: (userID: string, user: User) => void;
  onLogout: () => void;
};

export interface UserData {
  id: string;
  email: string;
  preferred_name: string;
  first_name: string;
  last_name: string;
  initials: string;
  avatar_url: string;
}

const AuthContext = createContext<Partial<ContextProps>>({});

export const AuthProvider = ({
  userData,
  children,
}: {
  userData: UserData | null;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userID, setUserID] = React.useState<string | null>(userData?.id ?? null);
  const [user, setUser] = React.useState<UserData | null>(userData ?? null);
  console.log('Auth Provider initialized', userID);

  const handleLogin = async (userID: string, user: User) => {
    console.log('handleLogin called', userID);
    setUserID(userID);
    window.localStorage.setItem('userID', userID);

    const fullName = user.email ? user.email.split('@')[0].split('.') : ['NA', 'NA'];

    const userData: Partial<UserData> = {
      id: user.id,
      email: user.email ?? 'NA',
      first_name: fullName[0],
      last_name: fullName[1],
      preferred_name: user.user_metadata?.preferred_name ?? fullName[0] ?? 'NA',
      avatar_url: user.user_metadata?.avatar_url ?? 'NA',
    };

    userData.initials =
      userData.first_name && userData.last_name
        ? `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
        : 'NA';

    setUser(userData as UserData);
    window.localStorage.setItem('user', JSON.stringify(userData));

    const origin = location.state?.from?.pathname;
    console.log('origin', origin);
    if (origin) {
      if (origin === '/login') {
        console.log('redirecting to /');
        navigate('/');
      } else {
        console.log('redirecting to ', origin);
        navigate(origin);
      }
    } else {
      console.log('location.pathname', location.pathname);
      if (location.pathname === '/login') {
        navigate('/');
        console.log('redirecting to /');
      }
    }
  };

  const handleLogout = () => {
    supabaseInternalClient.auth.signOut();
    setUserID(null);
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('userID');
  };

  useEffect(() => {
    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabaseInternalClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('event', event);
        console.log('session', session);
        const email = session?.user.email;
        const userID = session?.user.id;
        console.log('session use id', userID);
        if (email && email.substring(email.length - 15) !== 'butterflies.app') {
          supabaseInternalClient.auth.signOut();
        }
        switch (event) {
          case 'SIGNED_IN':
            console.log('Signed in successfully');
            if (!userID) throw new Error('No user ID');
            handleLogin(userID, session.user);
            break;
          case 'SIGNED_OUT':
            console.log('Signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log(`User ${email} updated`);
            break;
          case 'PASSWORD_RECOVERY':
            console.log(`Recovery email sent to ${email}`);
            break;
          case 'USER_DELETED':
            console.log(`User ${email} deleted`);
            break;
          default:
            console.warn('Unknown event', event, session);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userID,
        user,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
