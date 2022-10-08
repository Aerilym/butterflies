import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { AuthContext, supabase } from '../../provider/AuthProvider';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Dashboard'>) {
  const { session } = useContext(AuthContext);
  const name = session?.user.user_metadata.name ?? 'Guest';

  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center' }}>Welcome, {name}</Text>
        <Image
          style={{ width: 200, height: 200, borderRadius: 100 }}
          source={{ uri: session?.user.user_metadata.avatar_url }}
        />
        <TouchableOpacity
          style={{
            width: 150,
            height: 50,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 100,
          }}
          onPress={() => {
            supabase.auth.signOut();
          }}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
