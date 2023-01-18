import 'react-native-url-polyfill/auto';
import { NativeBaseProvider } from 'native-base';

import './src/services/log/sentry';
import Navigation from './src/navigation';
import { log } from './src/services/log/logger';

import { appTheme } from './src/styles/theme';

export default function App() {
  return (
    <NativeBaseProvider theme={appTheme}>
      <Navigation />
    </NativeBaseProvider>
  );
}

log.info('App started', { __DEV__, node_env: process.env.NODE_ENV });
