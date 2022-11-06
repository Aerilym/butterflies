import React from 'react';
import { View, Text, Button } from 'react-native-ui-lib';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Change Settings Here</Text>
      <Button
        label={'Return'}
        size={Button.sizes.medium}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Return</Text>
      </Button>
    </View>
  );
}
