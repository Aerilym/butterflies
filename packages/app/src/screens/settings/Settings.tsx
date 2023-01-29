import { Text, Button, ScrollView } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  return (
    <ScrollView
      style={{
        flex: 1,
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
      <Button
        onPress={() => {
          navigation.navigate('DevTabs');
        }}
      >
        <Text>Dev Menu</Text>
      </Button>
    </ScrollView>
  );
}
