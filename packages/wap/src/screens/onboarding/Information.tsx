import React, { useContext, useEffect, useState } from 'react';
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
import { OnboardingStackParamList } from '../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthenticationMethod, AuthenticationProvider, AuthIcons } from '../../types/auth';
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import type { Provider } from '@supabase/gotrue-js';

import { Layout, Text, TextInput, Button, useTheme, themeColor } from 'react-native-rapi-ui';
import { AuthContext } from '../../provider/AuthProvider';

export default function ({
  navigation,
}: NativeStackScreenProps<OnboardingStackParamList, 'Information'>) {
  const { isDarkmode, setTheme } = useTheme();

  const context = React.useContext(AuthContext);

  const userSession = context.session?.user?.user_metadata;

  const userInfo = {
    email: userSession ? userSession.email : '',
    name: userSession ? userSession.full_name : '',
    dob: 'old',
  };

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
          ></View>
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
            ></View>
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
                  localStorage.setItem('onBoardComplete', 'true');
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Complete Setup
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
