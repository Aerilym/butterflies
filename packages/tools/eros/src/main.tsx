import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from './ErrorPage';
import Root from './routes/Root';
import Config from './routes/Config';
import Analytics from './routes/Analytics';
import GodView from './routes/GodView';
import Onboarding from './routes/configs/Onboarding';
import Authentication from './routes/configs/Authentication';
import UserFields from './routes/configs/UserFields';
import KVOverride from './routes/configs/KVOverride';
import Internal from './routes/Internal';
import DashboardManager from './routes/internal/DashboardManager';
import SSOAuthenticationManager from './routes/internal/SSOAuthenticationManager';
import SSOUserManager from './routes/internal/SSOUserManager';
import RootBase from './routes/base/RootBase';
import ConfigBase from './routes/base/ConfigBase';
import InternalBase from './routes/base/InternalBase';
import Profile from './routes/Profile';
import Users from './routes/Users';
import UsersBase from './routes/base/UsersBase';
import UsersList from './routes/users/UsersList';
import { User } from '@supabase/supabase-js';
import {
  supabaseAdminAuthClient,
  supabaseAdminClient,
  supabaseInternalClient,
} from './services/supabase';
import { TableColumn, TableData } from './components/utility/Table';
import ProfileList from './routes/users/ProfileList';
import MatchesList from './routes/users/MatchesList';
import CustomList from './routes/users/CustomList';
import PreferenceList from './routes/users/PreferenceList';
import Meet from './routes/Meet';
import MeetBase from './routes/base/MeetBase';
import Room from './routes/meet/Room';
import CreateRoom from './routes/meet/CreateRoom';
import { ProtectedRoute } from './components/authentication/ProtectedRoute';
import Login from './routes/Login';
import { AuthLayout } from './routes/AuthLayout';
import { UserData } from './components/authentication/AuthProvider';
import { DashboardItem } from '../../../types/dashboard';

import './styles/index.css';
import WebhookManager from './routes/internal/WebhookManager';

const getUserData = async () => {
  const userString = window.localStorage.getItem('user');

  const user = userString ? (JSON.parse(userString) as UserData) : null;

  if (!user) {
    return Promise.resolve(null);
  }
  return Promise.resolve(user);
};

export type NavMap = Record<string, NavMapItem>;

export interface NavMapItem {
  name: string;
  path?: string;
  strictPath?: boolean;
  subpages?: NavMap;
}

export const navMap: NavMap = {
  app: {
    name: 'Butterflies App',
    subpages: {
      config: {
        name: 'Configuration',
        path: 'config',
        subpages: {
          onboarding: {
            name: 'Onboarding',
            path: 'onboarding',
          },
          authentication: {
            name: 'Authentication',
            path: 'authentication',
          },
          users: {
            name: 'User Fields',
            path: 'users',
          },
          kvoverride: {
            name: 'KV Override',
            path: 'kvoverride',
          },
        },
      },
      users: {
        name: 'Users',
        path: 'users',
        subpages: {
          list: {
            name: 'List',
            path: 'list',
          },
          profiles: {
            name: 'Profiles',
            path: 'profiles',
          },
          matches: {
            name: 'Matches',
            path: 'matches',
          },
          preferences: {
            name: 'Preferences',
            path: 'preferences',
          },
          custom: {
            name: 'Custom',
            path: 'custom',
          },
        },
      },
      godview: {
        name: 'God View',
        path: 'godview',
      },
      analytics: {
        name: 'Analytics',
        path: 'analytics',
      },
    },
  },
  internal: {
    name: 'Internal Settings',
    path: 'internal',
    subpages: {
      dashboard: {
        name: 'Dashboard',
        path: 'dashboard',
      },
      webhook: {
        name: 'Webhooks',
        path: 'webhooks',
      },
    },
  },
  meet: {
    name: 'Meeting Platform',
    path: 'meet',
  },
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    loader: () => getUserData().then((user) => ({ userPromise: Promise.resolve(user) })),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <></>,
        loader: async () => {
          await supabaseInternalClient.auth.signOut();
          window.localStorage.removeItem('userID');
          window.localStorage.removeItem('user');
          window.location.href = '/';
          return {};
        },
      },
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: '',
            element: <RootBase />,
            loader: async () => {
              const res = await fetch(
                'https://field-manager.butterfliesapp.workers.dev/options?key=dashboardItems'
              );
              const { value } = await res.json();
              const parsedValue = JSON.parse(value) as DashboardItem[];
              return { dashboardItems: parsedValue };
            },
          },
          {
            path: 'meet',
            element: <Meet />,
            children: [
              {
                path: '',
                element: <MeetBase />,
              },
              {
                path: 'create',
                element: <CreateRoom />,
              },
              {
                path: ':roomId',
                element: <Room />,
              },
            ],
          },
          {
            path: 'config',
            element: <Config />,
            children: [
              {
                path: '',
                element: <ConfigBase />,
              },
              {
                path: 'onboarding',
                element: <Onboarding />,
              },
              {
                path: 'authentication',
                element: <Authentication />,
              },
              {
                path: 'users',
                element: <UserFields />,
              },
              {
                path: 'kvoverride',
                element: <KVOverride />,
              },
            ],
          },
          {
            path: 'users',
            element: <Users />,
            children: [
              {
                path: '',
                element: <UsersBase />,
              },
              {
                path: 'list',
                element: <UsersList />,
                loader: async () => {
                  const { data, error } = await supabaseAdminAuthClient.listUsers();

                  if (error) console.error(error);

                  const cols: TableColumn[] = [];
                  const users = data;

                  for (const key in users.users[0]) {
                    cols.push({ Header: key, accessor: key });
                  }

                  const formattedData = users.users.map((user: User) => {
                    const userData: TableData = {};
                    for (const key in user) {
                      const value = user[key as keyof User];
                      if (typeof value === 'string' || typeof value === 'number') {
                        userData[key] = value;
                      } else if (typeof value === 'object') {
                        userData[key] = JSON.stringify(value);
                      } else {
                        userData[key] = '';
                      }
                    }
                    return userData;
                  });

                  return {
                    columns: cols,
                    data: formattedData,
                  };
                },
              },
              {
                path: 'profiles',
                element: <ProfileList />,
                loader: async () => {
                  return supabaseTableGet('profiles');
                },
              },
              {
                path: 'matches',
                element: <MatchesList />,
                loader: async () => {
                  return supabaseTableGet('matches');
                },
              },
              {
                path: 'preferences',
                element: <PreferenceList />,
                loader: async () => {
                  return supabaseTableGet('preferences');
                },
              },
              {
                path: 'custom',
                element: <CustomList />,
                loader: async () => {
                  const tableName = prompt('Enter table name');
                  if (!tableName) throw 'Enter a table name!';
                  return supabaseTableGet(tableName);
                },
              },
            ],
          },
          {
            path: 'godview',
            element: <GodView />,
          },
          {
            path: 'analytics',
            element: <Analytics />,
          },
          {
            path: 'internal',
            element: <Internal />,
            children: [
              {
                path: '',
                element: <InternalBase />,
              },
              {
                path: 'dashboard',
                element: <DashboardManager />,
              },
              {
                path: 'webhooks',
                element: <WebhookManager />,
              },
              {
                path: 'authentication',
                element: <SSOAuthenticationManager />,
              },
              {
                path: 'users',
                element: <SSOUserManager />,
              },
            ],
          },
          {
            path: 'profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

async function supabaseTableGet(table: string) {
  const { data, error } = await supabaseAdminClient.from(table).select('*');

  if (error) throw error;
  if (!data) return;

  const cols: TableColumn[] = [];

  for (const key in data[0]) {
    cols.push({ Header: key, accessor: key });
  }

  const formattedData = data.map((row) => {
    const profileData: TableData = {};
    for (const key in row) {
      const value = row[key];
      console.log(typeof value);
      if (typeof value === 'string' || typeof value === 'number') {
        profileData[key] = value as string;
      } else if (typeof value === 'boolean') {
        profileData[key] = value ? 'true' : 'false';
      } else if (typeof value === 'object') {
        profileData[key] = JSON.stringify(value);
      } else {
        profileData[key] = '';
      }
    }
    return profileData;
  });

  return {
    columns: cols,
    data: formattedData,
  };
}
