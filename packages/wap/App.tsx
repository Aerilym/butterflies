import 'react-native-url-polyfill/auto';
import { NativeBaseProvider } from 'native-base';

import Navigation from './src/navigation';

export default function App() {
  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
}
