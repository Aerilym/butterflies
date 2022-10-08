import React, { useContext, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { MatchBox } from '../../components/chat/MatchBox';
import { Match } from '../../types/database';
import { AuthContext, supabase } from '../../provider/AuthProvider';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Matches'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matches, setMatches] = useState<Match[]>([]);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or('userID1.eq.' + userID + ',userID2.eq.' + userID)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('error', error);
      return;
    }
    setMatches(data as Match[]);
  }
  fetchMatches();
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {matches ? (
          matches.map((match) => {
            return (
              <TouchableOpacity
                key={match.id}
                onPress={() => {
                  navigation.navigate('Chat', {
                    matchID: match.id,
                    userID: userID,
                  });
                }}
                style={{
                  width: '100%',
                  height: 100,
                  backgroundColor: 'white',
                  marginBottom: 10,
                }}
              >
                <MatchBox matchID={match.id} userID={userID} />
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ textAlign: 'center' }}>No matches yet! Start swiping!</Text>
        )}
      </View>
    </View>
  );
}