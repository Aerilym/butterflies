import type { Provider } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { View } from 'react-native-ui-lib';
import { supabaseAPI } from '../../provider/AuthProvider';

import type { AuthIcons } from '../../types/auth';
import { AuthButton } from './AuthButton';

const icons: AuthIcons = {
  apple: require('../../../assets/icons/apple.png'),
  azure: require('../../../assets/icons/azure.png'),
  bitbucket: require('../../../assets/icons/bitbucket.png'),
  discord: require('../../../assets/icons/discord.png'),
  facebook: require('../../../assets/icons/facebook.png'),
  github: require('../../../assets/icons/github.png'),
  gitlab: require('../../../assets/icons/gitlab.png'),
  google: require('../../../assets/icons/google.png'),
  slack: require('../../../assets/icons/slack.png'),
  spotify: require('../../../assets/icons/spotify.png'),
  twitch: require('../../../assets/icons/twitch.png'),
  twitter: require('../../../assets/icons/twitter.png'),
  keycloak: '' as ImageSourcePropType,
  linkedin: '' as ImageSourcePropType,
  notion: '' as ImageSourcePropType,
  workos: '' as ImageSourcePropType,
};

export function SupabaseAuth() {
  const [enabledProviders, setEnabledProviders] = useState<Provider[]>([]);

  useEffect(() => {
    supabaseAPI.getEnabledAuthProviders().then((providers) => {
      setEnabledProviders(providers);
    });
  }, []);
  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {enabledProviders.map((provider) => {
        return <AuthButton key={provider} provider={provider} icon={icons[provider]} />;
      })}
    </View>
  );
}
