import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { Match } from '../../types/database';
import { AuthContext, supabase } from '../../provider/AuthProvider';
import { MatchRow } from '../../components/match/MatchRow';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Matches'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matches, setMatches] = useState<Match[]>([]);

  async function fetchMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .or('user_id1.eq.' + userID + ',user_id2.eq.' + userID)
      .order('created_at', { ascending: true });

    setMatches(data as Match[]);
  }

  useEffect(() => {
    fetchMatches();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {matches ? (
        matches.map((match) => {
          return (
            <MatchRow key={match.match_id} navigation={navigation} match={match} userID={userID} />
          );
        })
      ) : (
        <Text style={{ textAlign: 'center' }}>No matches yet! Start swiping!</Text>
      )}
    </View>
  );
}
