import React from 'react';
import { View, Text, Button } from 'react-native-ui-lib';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { Profile } from '../../types/database';
import { FaceButton } from '../../components/profile/FaceButton';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, 'Profile'>) {
  const { profile } = route.params ?? { profile: {} as Profile };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Play with your profile Here!</Text>
      <Button
        label={'Return'}
        size={Button.sizes.medium}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Return</Text>
      </Button>
      <FaceButton
        profile={{ avatar_url: profile.avatar_url } as Profile}
        navigation={navigation}
        size={300}
      />
    </View>
  );
}
