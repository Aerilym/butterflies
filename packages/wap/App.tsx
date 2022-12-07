import 'react-native-url-polyfill/auto';
import { NativeBaseProvider } from 'native-base';

import Navigation from './src/navigation';
import { AuthProvider } from './src/provider/AuthProvider';

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
