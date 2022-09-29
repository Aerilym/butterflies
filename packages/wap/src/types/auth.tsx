import type { Provider } from '@supabase/gotrue-js';

export type AuthenticationProvider = Provider | 'email' | 'phone';

export interface AuthenticationMethod {
  provider: AuthenticationProvider;
  nameOverride?: string;
  icon?: any;
  weight: number;
}

export type AuthIcons = {
  [key in AuthenticationProvider]: string;
};
