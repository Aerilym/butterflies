import { Text, Button, ScrollView } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'DevHome'>) {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Button
        onPress={() => {
          navigation.navigate('MainTabs');
        }}
      >
        <Text>Return to App</Text>
      </Button>
    </ScrollView>
  );
}
