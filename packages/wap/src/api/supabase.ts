import { SupabaseClient, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { SB_URL, SB_KEY } from '@env';
import { Profile } from '../types/database';

export class SupabaseAPI {
  supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(SB_URL, SB_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: AsyncStorage,
        detectSessionInUrl: Platform.OS === 'web' ? true : false,
      },
    });
  }
  getProfile = async (userID: string): Promise<Profile> => {
    const { data } = await this.supabase.from('profiles').select('*').eq('user_id', userID);
    const userProfile = data ? data[0] : {};
    return userProfile as Profile;
  };
}
