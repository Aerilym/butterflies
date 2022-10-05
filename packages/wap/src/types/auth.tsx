import { Provider } from '@supabase/supabase-js';

export type AuthIcons = {
  [key in Provider]: string;
};
