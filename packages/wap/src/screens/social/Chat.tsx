import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { ChatBox } from '../../components/chat/ChatBox';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, 'Chat'>) {
  const { matchID, userID } = route.params;
  return (
    <View>
      <ChatBox matchID={matchID} userID={userID} />
    </View>
  );
}
