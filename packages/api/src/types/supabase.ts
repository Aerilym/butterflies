import { UserCredentials, Session, User, Provider, ApiError } from '@supabase/supabase-js';

export interface LoginParams {
  credentials: UserCredentials;
  options: {
    redirectTo?: string;
    shouldCreateUser?: boolean;
    scopes?: string;
    captchaToken?: string;
    queryParams?: { [key: string]: string };
  };
}

export interface LoginResponse {
  session: Session | null;
  user: User | null;
  provider?: Provider;
  url?: string | null;
  error: ApiError | null;
}
