import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  Linking,
} from 'react-native';
import { supabase } from '../../initSupabase';
import { AuthStackParamList } from '../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthenticationMethod, AuthenticationProvider, AuthIcons } from '../../types/auth';
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import type { Provider } from '@supabase/gotrue-js';
import { Platform } from 'react-native';

import { Layout, Text, TextInput, Button, useTheme, themeColor } from 'react-native-rapi-ui';

const icons: AuthIcons = {
  apple: require('../../../assets/images/icons/apple.png'),
  azure: require('../../../assets/images/icons/azure.png'),
  bitbucket: require('../../../assets/images/icons/bitbucket.png'),
  discord: require('../../../assets/images/icons/discord.png'),
  email: require('../../../assets/images/icons/email.png'),
  facebook: require('../../../assets/images/icons/facebook.png'),
  github: require('../../../assets/images/icons/github.png'),
  gitlab: require('../../../assets/images/icons/gitlab.png'),
  google: require('../../../assets/images/icons/google.png'),
  phone: require('../../../assets/images/icons/phone.png'),
  slack: require('../../../assets/images/icons/slack.png'),
  spotify: require('../../../assets/images/icons/spotify.png'),
  twitch: require('../../../assets/images/icons/twitch.png'),
  twitter: require('../../../assets/images/icons/twitter.png'),
  keycloak: '',
  linkedin: '',
  notion: '',
  workos: '',
};

export default function ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function login(method: AuthenticationMethod) {
    if (method.provider === 'email') {
      navigation.navigate('LoginEmail');
    } else if (method.provider === 'phone') {
      navigation.navigate('LoginEmail');
    } else if (method.provider === 'apple') {
      Linking.openURL('https://youtu.be/tjc6Ob1jo8I?t=14');
    } else {
      console.log(Platform.OS);
      if (Platform.OS === 'web') {
        const { user, session, error } = await supabase.auth.signIn({
          provider: method.provider,
        });
        return;
      }

      const returnUrl = makeRedirectUri({ useProxy: false });
      const provider = method.provider;
      const authUrl = `https://btueksreggheiyvqbbdx.supabase.co/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
      const response = await startAsync({ authUrl, returnUrl });

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
        disabled={loading}
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
          {loading
            ? 'Loading'
            : method.nameOverride
            ? `Login with ${method.nameOverride}`
            : `Login with ${method.provider.charAt(0).toUpperCase() + method.provider.slice(1)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkmode ? '#17171E' : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require('../../../assets/images/login.png')}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'column',
              flex: 3,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
              width: '100%',
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: 'center',
                padding: 30,
              }}
              size="h3"
            >
              Login
            </Text>
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
              {authMethodButtons}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'center',
              }}
            ></View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgetPassword');
                }}
              >
                <Text size="md" fontWeight="bold">
                  Recover Account
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 30,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme('light') : setTheme('dark');
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? '☀️ light theme' : '🌑 dark theme'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
