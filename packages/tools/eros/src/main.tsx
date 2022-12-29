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
import Users from './routes/configs/Users';
import KVOverride from './routes/configs/KVOverride';
import Internal from './routes/Internal';
import DashboardManager from './routes/internal/DashboardManager';
import AuthenticationManager from './routes/internal/AuthenticationManager';
import UserManager from './routes/internal/UserManager';
import RootBase from './routes/base/RootBase';
import ConfigBase from './routes/base/ConfigBase';
import InternalBase from './routes/base/InternalBase';

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
            element: <Users />,
          },
          {
            path: 'kvoverride',
            element: <KVOverride />,
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
            element: <AuthenticationManager />,
          },
          {
            path: 'users',
            element: <UserManager />,
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
