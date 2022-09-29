import React from 'react';
import { View } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, TopNav, Text, themeColor, useTheme, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../initSupabase';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Settings"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name={isDarkmode ? 'sunny' : 'moon'}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* This text using ubuntu font */}
        <Text fontWeight="bold">This is the Settings screen</Text>
        <Button
          status="info"
          text="Add Account"
          onPress={() => {
            navigation.navigate('AddAccount');
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          status="danger"
          text="Logout"
          onPress={async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
              alert('Signed out!');
            }
            if (error) {
              alert(error.message);
            }
          }}
          style={{
            marginTop: 10,
          }}
        />
      </View>
    </Layout>
  );
}
