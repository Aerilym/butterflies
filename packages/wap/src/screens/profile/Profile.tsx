import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Profile'>) {
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center' }}>Play with your profile Here!</Text>
        <Button
          title="Return"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}
