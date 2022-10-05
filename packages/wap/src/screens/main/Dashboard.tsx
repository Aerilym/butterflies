import React, { useContext } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { MainStackParamList } from '../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
        <Button
          title="Return"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title="Log out"
          onPress={() => {
            supabase.auth.signOut();
          }}
        />
      </View>
    </View>
  );
}
