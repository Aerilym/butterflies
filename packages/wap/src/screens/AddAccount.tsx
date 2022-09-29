import { MainStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../initSupabase';

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  Linking,
} from 'react-native';
import { AuthenticationMethod, AuthenticationProvider, AuthIcons } from '../types/auth';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
  TopNav,
} from 'react-native-rapi-ui';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from '../provider/AuthProvider';

const icons: AuthIcons = {
  apple: require('../../assets/images/icons/apple.png'),
  azure: require('../../assets/images/icons/azure.png'),
  bitbucket: require('../../assets/images/icons/bitbucket.png'),
  discord: require('../../assets/images/icons/discord.png'),
  email: require('../../assets/images/icons/email.png'),
  facebook: require('../../assets/images/icons/facebook.png'),
  github: require('../../assets/images/icons/github.png'),
  gitlab: require('../../assets/images/icons/gitlab.png'),
  google: require('../../assets/images/icons/google.png'),
  phone: require('../../assets/images/icons/phone.png'),
  slack: require('../../assets/images/icons/slack.png'),
  spotify: require('../../assets/images/icons/spotify.png'),
  twitch: require('../../assets/images/icons/twitch.png'),
  twitter: require('../../assets/images/icons/twitter.png'),
  keycloak: '',
  linkedin: '',
  notion: '',
  workos: '',
};

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'AddAccount'>) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const context = React.useContext(AuthContext);

  const userProviders = context.session?.user?.app_metadata.providers as string[];

  async function login(method: AuthenticationMethod) {
    if (method.provider === 'email') {
      Linking.openURL('https://youtu.be/tjc6Ob1jo8I?t=14');
    } else if (method.provider === 'phone') {
      Linking.openURL('https://youtu.be/tjc6Ob1jo8I?t=14');
    } else if (method.provider === 'apple') {
      Linking.openURL('https://youtu.be/tjc6Ob1jo8I?t=14');
    } else {
      const returnUrl = makeRedirectUri({ useProxy: false });
      const provider = method.provider;
      const authUrl = `https://btueksreggheiyvqbbdx.supabase.co/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
      const response = await startAsync({ authUrl, returnUrl });

      console.log(JSON.stringify(response));

      if (response.type !== 'success') {
        return;
      }

      if (!response.params?.refresh_token) {
        return;
      }

      await supabase.auth.signIn({
        refreshToken: response.params.refresh_token,
      });
      const { user, session, error } = await supabase.auth.signIn({
        provider: method.provider,
      });
    }
  }

  // TODO: create an api endpoint to get enabled authentication methods from supabase replace this list with the response from the api
  const enabledAuthenticationEndpoints: AuthenticationProvider[] = [
    'spotify',
    'google',
    'facebook',
    'phone',
    'apple',
  ];

  let authMethods: AuthenticationMethod[] = [];

  authMethods.push({
    provider: 'email',
    weight: 1,
    icon: icons.email,
  });
  authMethods.push({
    provider: 'spotify',
    weight: 99,
    icon: icons.spotify,
  });
  authMethods.push({
    provider: 'apple',
    weight: 98,
    icon: icons.apple,
  });
  authMethods.push({
    provider: 'google',
    weight: 98,
    icon: icons.google,
  });
  authMethods.push({
    provider: 'facebook',
    weight: 10,
    icon: icons.facebook,
  });
  authMethods.push({
    provider: 'phone',
    weight: 2,
    icon: icons.phone,
  });

  authMethods = authMethods.filter((method) => {
    return enabledAuthenticationEndpoints.includes(method.provider);
  });

  // Adds any enabled auth methods that dont have a weight (arent in the authMehtods list)
  // TODO: replace this with a better method
  const authDiff = authMethods.length - enabledAuthenticationEndpoints.length;
  if (authDiff < 0) {
    for (const method of enabledAuthenticationEndpoints) {
      if (!authMethods.find((m) => m.provider === method)) {
        authMethods.push({
          provider: method,
          weight: 50,
          icon: icons[method],
        });
      }
    }
  }

  const sortedAuthMethods = authMethods.sort((a, b) => b.weight - a.weight);
  const authMethodButtons = sortedAuthMethods.map((method) => {
    return (
      <TouchableOpacity
        key={method.provider}
        onPress={() => {
          login(method);
        }}
        disabled={loading || userProviders.includes(method.provider)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
          borderColor: isDarkmode ? themeColor.white100 : '#17171E',
          height: 60,
          borderRadius: 40,
          margin: 8,
          paddingLeft: 40,
        }}
      >
        <Image
          resizeMode="cover"
          style={{
            padding: 12,
            margin: 12,
            height: 30,
            width: 30,
          }}
          source={method.icon}
        />
        <Text>
          {userProviders.includes(method.provider)
            ? `${method.provider.charAt(0).toUpperCase() + method.provider.slice(1)} Added`
            : loading
            ? 'Loading'
            : method.nameOverride
            ? `Add ${method.nameOverride} Login`
            : `Add ${method.provider.charAt(0).toUpperCase() + method.provider.slice(1)} Login`}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Add Account"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          leftAction={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'column',
              flex: 3,
              paddingTop: 30,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
              width: '100%',
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'column',
                flex: 3,
                paddingBottom: 20,
                backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
                width: '80%',
              }}
            >
              <Text>Currently limited to accounts registered with the same email</Text>
              {authMethodButtons}
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
