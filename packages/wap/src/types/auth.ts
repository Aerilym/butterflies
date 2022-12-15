import type { Provider } from '@supabase/supabase-js';
import type { ImageSourcePropType } from 'react-native';
import { Preferences, Profile } from './database';

export type AuthIcons = {
  [key in Provider]: ImageSourcePropType;
};

export interface OnboardingPayload {
  profileOptions: Omit<Profile, 'user_id' | 'updated_at'>;
  preferenceOptions: Omit<Preferences, 'user_id' | 'updated_at'>;
}

export type FieldValue = string | string[] | boolean | number | number[] | Date;
