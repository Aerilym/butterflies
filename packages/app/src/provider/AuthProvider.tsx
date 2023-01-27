import { SupabaseAPI } from '../api/supabase';
import { UserStore } from '../api/UserStore';

export const supabaseAPI = new SupabaseAPI();
export const userStore = new UserStore(supabaseAPI);

//TODO: Move auth provider stuff from navigation/index.tsx to here
