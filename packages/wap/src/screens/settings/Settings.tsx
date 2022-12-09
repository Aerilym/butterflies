import { Box, Text, Button } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Change Settings Here</Text>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Return</Text>
      </Button>
    </Box>
  );
}
