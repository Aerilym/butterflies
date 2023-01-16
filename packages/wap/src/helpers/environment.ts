import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export const isMobileDevice = Platform.OS === 'ios' || Platform.OS === 'android';
