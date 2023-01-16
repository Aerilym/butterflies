import 'react-native-url-polyfill/auto';
import { NativeBaseProvider } from 'native-base';

import './src/services/log/sentry';
import Navigation from './src/navigation';
import { log } from './src/services/log/logger';

export default function App() {
  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
}

log.info('App started', { __DEV__, node_env: process.env.NODE_ENV });
