import { Provider } from '@supabase/supabase-js';
import { Text, View } from 'react-native';
import { AuthIcons } from '../../types/auth';
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
  keycloak: '',
  linkedin: '',
  notion: '',
  workos: '',
};

export function SupabaseAuth() {
  const enabledProviders: Provider[] = ['spotify', 'apple', 'facebook', 'google'];

  const authButtons = enabledProviders.map((provider) => {
    return <AuthButton key={provider} provider={provider} icon={icons[provider]} />;
  });

  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {authButtons}
    </View>
  );
}
