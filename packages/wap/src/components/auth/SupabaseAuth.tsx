import { useEffect, useState } from 'react';
import { ImageSourcePropType, Linking } from 'react-native';
import { Box, Image, Text } from 'native-base';
import type { Provider } from '@supabase/supabase-js';

import { supabaseAPI } from '../../provider/AuthProvider';
import type { AuthIcons } from '../../types/auth';
import { AuthButton } from './AuthButton';
import Loading from '../../screens/utility/Loading';

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
    fetch('https://field-manager.aerilym.workers.dev/options?key=providerOrder').then(
      async (response) => {
        const { value } = await response.json();

        const filteredOrder = value.filter((provider: string) =>
          Object.keys(icons).includes(provider)
        );

        setEnabledProviders(filteredOrder);
      }
    );
  }, []);
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
      }}
    >
      <Box>
        <Image
          alt={'everything is fine gif'}
          style={{
            width: 300,
            height: 400,
          }}
          source={{ uri: 'https://media.tenor.com/MYZgsN2TDJAAAAAC/this-is.gif' }}
        />
      </Box>
      <Box>
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
            <Text>
              If you're a dev enable some{' '}
              <Text
                style={{ color: 'blue' }}
                onPress={() =>
                  Linking.openURL(
                    'https://app.supabase.com/project/btueksreggheiyvqbbdx/editor/18198'
                  )
                }
              >
                HERE
              </Text>
              !
            </Text>
          </>
        )}
      </Box>
      <Box>
        <Text
          style={{
            color: '#17171E',
            textAlign: 'center',
            fontSize: 10,
            marginHorizontal: 20,
          }}
        >
          By signing up, you agree to our Terms of service. View our privacy policy to see how we
          use your data.
        </Text>
      </Box>
    </Box>
  );
}
