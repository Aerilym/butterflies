import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { Match } from '../../types/database';
import { AuthContext, supabaseAPI } from '../../provider/AuthProvider';
import { MatchRow } from '../../components/match/MatchRow';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Matches'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matches, setMatches] = useState<Match[]>([] as Match[]);

  useEffect(() => {
    supabaseAPI.getMatches(userID).then((matches) => {
      setMatches(matches);
    });
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
