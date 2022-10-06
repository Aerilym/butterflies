import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import Navigation from './src/navigation';
import { AuthProvider } from './src/provider/AuthProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
