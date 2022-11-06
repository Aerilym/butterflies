import { View, Text, Button } from 'react-native-ui-lib';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Filters'>) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Set Filters Here!</Text>
      <Button
        label={'Return'}
        size={Button.sizes.medium}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={{ color: 'white' }}>Return</Text>
      </Button>
    </View>
  );
}
