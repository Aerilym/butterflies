import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
import { supabaseAdminAuthClient } from './supabase';
import { TableColumn, TableData } from './components/Table';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <RootBase />,
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

              const cols: TableColumn[] = [];
              const users = data;

              for (const key in users.users[0]) {
                cols.push({ Header: key, accessor: key });
              }

              const formatedData = users.users.map((user: User) => {
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
                data: formatedData,
              };
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
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
