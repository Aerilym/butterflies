import React from 'react';
import { View, Text, Button } from 'react-native';
import { MainStackParamList } from '../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Filters'>) {
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center' }}>Set Filters Here!</Text>
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
