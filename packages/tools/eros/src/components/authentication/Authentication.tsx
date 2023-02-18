import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

import { supabaseInternalClient } from '../../services/supabase';

export default function Authentication() {
  return (
    <Auth supabaseClient={supabaseInternalClient} appearance={{ theme: ThemeSupa }} theme="dark" />
  );
}
