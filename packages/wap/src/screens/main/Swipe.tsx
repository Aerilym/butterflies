import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { AuthContext, supabaseAPI } from '../../provider/AuthProvider';
import { Match } from '../../types/database';
import { SwipeCard } from '../../components/swipe/SwipeCard';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Swipe'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matchQueue, setMatchQueue] = useState<null | Match[]>(null);

  useEffect(() => {
    supabaseAPI.getMatchQueue(userID).then((matches) => {
      setMatchQueue(matches);
    });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {matchQueue ? (
        <SwipeCard navigation={navigation} userID={userID} match={matchQueue[0]} />
      ) : (
        <Text style={{ textAlign: 'center' }}>
          No profiles match your filters, try expanding them!
        </Text>
      )}
    </View>
  );
}
