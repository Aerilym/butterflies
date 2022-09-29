import React from 'react';
import { View } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text, Button, TopNav } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../initSupabase';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'MainTabs'>) {
  return (
    <Layout>
      <TopNav
        middleContent="Profile"
        rightContent={<Ionicons name={'settings'} style={{ marginBottom: -7 }} size={24} />}
        rightAction={() => {
          navigation.navigate('Settings');
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>This is the Profile tab</Text>
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
