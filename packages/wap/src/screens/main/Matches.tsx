import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { Match, Message } from '../../types/database';
import { AuthContext, supabaseAPI } from '../../provider/AuthProvider';
import { MatchRow } from '../../components/match/MatchRow';
import { MatchCircle } from '../../components/match/MatchCircle';

interface MatchSocial {
  match: Match;
  lastMessage: Message;
}

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Matches'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matches, setMatches] = useState<MatchSocial[]>([] as MatchSocial[]);
  const [newMatches, setNewMatches] = useState<MatchSocial[]>([] as MatchSocial[]);

  useEffect(() => {
    supabaseAPI.getMatches(userID).then((matches) => {
      const lastMessagePromises = matches.map((match) => {
        return supabaseAPI.getLastMessage(match.match_id);
      });
      Promise.all(lastMessagePromises).then((lastMessages) => {
        const matchSocials = matches.map((match, index) => {
          return { match, lastMessage: lastMessages[index] } as MatchSocial;
        });

        const newMatches = matchSocials.filter((matchSocial) => matchSocial.lastMessage === null);
        const messagedMatches = matchSocials
          .filter((matchSocial) => matchSocial.lastMessage !== null)
          .sort(
            (a, b) =>
              new Date(b.lastMessage.created_at || '').getTime() -
              new Date(a.lastMessage.created_at || '').getTime()
          );
        setNewMatches(newMatches);
        setMatches(messagedMatches);
      });
    });
  }, []);
  return (
    <>
      <View
        style={{
          height: '15%',
        }}
      >
        <ScrollView
          horizontal={true}
          style={{
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          {newMatches ? (
            newMatches.map((matchSocial) => {
              return (
                <MatchCircle
                  key={matchSocial.match.match_id}
                  navigation={navigation}
                  match={matchSocial.match}
                  userID={userID}
                  size={69}
                  style={{
                    marginHorizontal: 4,
                  }}
                />
              );
            })
          ) : (
            <Text>Find a new match by swiping!</Text>
          )}
        </ScrollView>
      </View>
      <ScrollView>
        {matches ? (
          matches.map((matchSocial) => {
            return (
              <MatchRow
                key={matchSocial.match.match_id}
                navigation={navigation}
                match={matchSocial.match}
                message={matchSocial.lastMessage}
                userID={userID}
              />
            );
          })
        ) : (
          <Text style={{ textAlign: 'center' }}>No messages yet! Message someone!</Text>
        )}
      </ScrollView>
    </>
  );
}
