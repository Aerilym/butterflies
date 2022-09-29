import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SB_URL, SB_KEY } from '@env';

// Better put your these secret keys in .env file
export const supabase = createClient(SB_URL, SB_KEY, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  detectSessionInUrl: false,
  persistSession: true,
});
