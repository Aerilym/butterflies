import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { LoginParams, LoginResponse } from './types/supabase';

export class SupabaseAPI {
  request: SupabaseClient;
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.request = createClient(supabaseUrl, supabaseKey);
  }
  async login({ credentials }: LoginParams): Promise<LoginResponse> {
    return await this.request.auth.signIn(credentials);
  }
}
