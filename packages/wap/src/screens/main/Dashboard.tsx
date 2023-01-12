import { Box, Button, Text } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { supabaseAPI, userStore } from '../../provider/AuthProvider';
import { FaceButton } from '../../components/profile/FaceButton';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Dashboard'>) {
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Welcome, {userStore.profile.display_name}</Text>
      <FaceButton profile={userStore.profile} navigation={navigation} size={300} />
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
