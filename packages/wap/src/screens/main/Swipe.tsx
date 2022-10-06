import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Swipe'>) {
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          No profiles match your filters, try expanding them!
        </Text>
        <Button
          title="Expand filters"
          onPress={() => {
            navigation.navigate('Filters');
          }}
        />
      </View>
    </View>
  );
}
