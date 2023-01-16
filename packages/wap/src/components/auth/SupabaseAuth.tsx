import { useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { Image, Text } from 'native-base';
import type { Provider } from '@supabase/supabase-js';

import type { AuthIcons } from '../../types/auth';
import { AuthButton } from './AuthButton';
import Loading from '../../screens/utility/Loading';
import { supabaseAPI } from '../../provider/AuthProvider';

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
  const [enabledProviders, setEnabledProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    supabaseAPI.getEnabledAuthProviders().then(async (order) => {
      const filteredOrder = order.filter((provider) => Object.keys(icons).includes(provider));
      setEnabledProviders(filteredOrder);
    });
  }, []);
  return (
    <>
      {!enabledProviders ? (
        <Loading />
      ) : enabledProviders.length > 0 ? (
        enabledProviders.map((provider) => {
          return <AuthButton key={provider} provider={provider} icon={icons[provider]} />;
        })
      ) : (
        <>
          <Image
            alt={'everything is fine gif'}
            style={{
              width: 300,
              height: 200,
            }}
            source={{ uri: 'https://media.tenor.com/MYZgsN2TDJAAAAAC/this-is.gif' }}
          />
          <Text>There are no enabled login providers!</Text>
        </>
      )}
    </>
  );
}
