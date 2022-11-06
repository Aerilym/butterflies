import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { userStore } from '../../provider/AuthProvider';
import { MatchRow } from '../../components/match/MatchRow';
import { MatchCircle } from '../../components/match/MatchCircle';
import { Person } from '../../types/userstore';
import { MatchSocial } from '../../types/social';

function formatMatches(socials: Person[] | undefined): {
  newMatchList: MatchSocial[];
  messagedMatchList: MatchSocial[];
} {
  if (!socials || socials.length === 0) return { newMatchList: [], messagedMatchList: [] };

  const matchSocials = socials.map((social) => {
    const matchSocial: MatchSocial = {
      match: social.match,
      profile: social.profile,
      messages: social.messages ?? [],
    };
    if (social.messages && social.messages.length > 0) {
      matchSocial.messages = social.messages;
    }
    return matchSocial as MatchSocial;
  });

  const newMatchList = matchSocials.filter((matchSocial) => matchSocial.messages.length === 0);
  const messagedMatchList = matchSocials.filter((matchSocial) => matchSocial.messages.length > 0);

  messagedMatchList.sort(
    (a, b) =>
      new Date(b.messages[b.messages.length - 1].created_at || '').getTime() -
      new Date(a.messages[a.messages.length - 1].created_at || '').getTime()
  );

  return { newMatchList, messagedMatchList };
}

// TODO: Have last message update without needing to refresh the page.
export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Matches'>) {
  const [matches, setMatches] = useState<MatchSocial[]>([] as MatchSocial[]);
  const [newMatches, setNewMatches] = useState<MatchSocial[]>([] as MatchSocial[]);

  useEffect(() => {
    const { newMatchList, messagedMatchList } = formatMatches(userStore.socials);
    setNewMatches(newMatchList);
    setMatches(messagedMatchList);
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
                  matchSocial={matchSocial}
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
      <Button
        title="Refresh"
        onPress={async () => {
          await userStore.refreshSocials();
          const { newMatchList, messagedMatchList } = formatMatches(userStore.socials);
          setNewMatches(newMatchList);
          setMatches(messagedMatchList);
        }}
      />
      <ScrollView>
        {matches ? (
          matches.map((matchSocial) => {
            return (
              <MatchRow
                key={matchSocial.match.match_id}
                navigation={navigation}
                matchSocial={matchSocial}
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
