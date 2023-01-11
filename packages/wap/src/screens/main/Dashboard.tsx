import { useContext } from 'react';
import { Box, Button, Text } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { AuthContext, supabaseAPI, userStore } from '../../provider/AuthProvider';
import { FaceButton } from '../../components/profile/FaceButton';
import { Profile } from '../../types/database';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Dashboard'>) {
  const { session } = useContext(AuthContext);
  const name = session?.user.user_metadata.name ?? 'Guest';

  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Welcome, {name}</Text>
      <FaceButton
        profile={{ avatar_url: session?.user.user_metadata.avatar_url } as Profile}
        navigation={navigation}
        size={300}
      />
      <Button
        onPress={async () => {
          await supabaseAPI.restartOnboarding();
          await userStore.refreshProfile();
          navigation.navigate('Onboarding');
        }}
      >
        Redo Onboarding
      </Button>
      <Button
        onPress={async () => {
          navigation.navigate('Settings');
        }}
      >
        Settings
      </Button>
      <Button
        style={{
          backgroundColor: 'red',
        }}
        onPress={() => {
          supabaseAPI.logout();
        }}
      >
        <Text>Sign Out</Text>
      </Button>
    </Box>
  );
}
