import { createClient } from '@supabase/supabase-js';

const supabaseButterfliesUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL_BUTTERFLIES;
const supabaseButterfliesAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY_BUTTERFLIES;
const supabaseButterfliesServiceKey = import.meta.env
  .VITE_REACT_APP_SUPABASE_SERVICE_KEY_BUTTERFLIES;

const supabaseInternalUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL_INTERNAL;
const supabaseInternalAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY_INTERNAL;

const supabaseButterflies = createClient(supabaseButterfliesUrl, supabaseButterfliesServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const supabaseInternal = createClient(supabaseInternalUrl, supabaseInternalAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Access auth admin api
export const supabaseAdminAuthClient = supabaseButterflies.auth.admin;
export const supabaseAdminClient = supabaseButterflies;
export const supabaseInternalClient = supabaseInternal;
