import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { AuthContext, supabaseAPI, userStore } from '../../provider/AuthProvider';
import { FaceButton } from '../../components/profile/FaceButton';
import { Profile } from '../../types/database';
import { Button } from 'native-base';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Dashboard'>) {
  const { session } = useContext(AuthContext);
  const name = session?.user.user_metadata.name ?? 'Guest';

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Welcome, {name}</Text>
      <FaceButton
        profile={{ avatar_url: session?.user.user_metadata.avatar_url } as Profile}
        navigation={navigation}
        size={300}
      />
      <Button
        onPress={() => {
          supabaseAPI.restartOnboarding();
        }}
      >
        Redo Onboarding
      </Button>
      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 100,
          backgroundColor: 'red',
        }}
        onPress={() => {
          supabaseAPI.logout();
        }}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
