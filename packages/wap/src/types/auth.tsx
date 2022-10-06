import type { Provider } from '@supabase/supabase-js';
import type { ImageSourcePropType } from 'react-native';

export type AuthIcons = {
  [key in Provider]: ImageSourcePropType;
};
