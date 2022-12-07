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

interface FieldSelectorData {
  label: string;
  helperText?: string;
}

type FieldSelectorOptions =
  | {
      selector: 'text';
      defaultValue?: string;
      hint?: string;
      maxChars?: number;
      showCharCounter?: boolean;
    }
  | {
      selector: 'textArea';
      defaultValue?: string;
      hint?: string;
      maxChars?: number;
      showCharCounter?: boolean;
    }
  | {
      selector: 'slider';
      defaultValue?: number;
      hint?: number;
      minNum?: number;
      maxNum?: number;
    }
  | {
      selector: 'rangeSlider';
      defaultValue?: number[];
      hint?: number[];
      minNum?: number;
      maxNum?: number;
    }
  | {
      selector: 'date';
      defaultValue?: Date;
      hint?: Date;
    }
  | {
      selector: 'number';
      defaultValue?: number;
      hint?: number;
    }
  | {
      selector: 'switch';
      defaultValue?: boolean;
    }
  | {
      selector: 'dropdown' | 'radio';
      options: string[];
      defaultValue?: string;
      hint?: string;
    }
  | {
      selector: 'checkboxes';
      options: string[];
      defaultValue?: string[];
      hint?: string[];
    };

export type OnboardingStepItem = (
  | {
      bucket: 'profile';
      field: keyof Profile;
    }
  | {
      bucket: 'preferences';
      field: keyof Preferences;
    }
) &
  FieldSelectorOptions &
  FieldSelectorData;
