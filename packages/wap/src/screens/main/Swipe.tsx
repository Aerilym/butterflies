import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import type { MainStackParamList } from '../../types/navigation';
import { AuthContext, supabaseAPI, userStore } from '../../provider/AuthProvider';
import { Match } from '../../types/database';
import { SwipeCard } from '../../components/swipe/SwipeCard';
import { Person } from '../../types/userstore';

interface MatchQueueItem {
  match: Match;
  userPosition: 1 | 2;
}

function formatMatchQueue(
  matchQueue: Person[] | undefined,
  currentUserID: string
): MatchQueueItem[] {
  if (!matchQueue || matchQueue.length === 0) return [];
  const queue = matchQueue.map((person) => {
    return {
      match: person.match,
      userPosition: person.match.user_id1 === currentUserID ? 1 : 2,
    } as MatchQueueItem;
  });
  return queue;
}

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Swipe'>) {
  const { session } = useContext(AuthContext);
  const userID = session?.user.id ?? '';

  const [matchQueue, setMatchQueue] = useState<null | MatchQueueItem[]>(null);

  const cards = matchQueue?.map((matchQueueItem) => (
    <SwipeCard
      key={matchQueueItem.match.match_id}
      navigation={navigation}
      userID={userID}
      match={matchQueueItem.match}
    />
  ));

  useEffect(() => {
    const queue = formatMatchQueue(userStore.matchQueue, userID);
    setMatchQueue(queue);
  }, []);
  //TODO: Surely there's a better way to do the swipe card queue https://imgur.com/a/gCJygAt
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <Button
        title="Refresh"
        onPress={async () => {
          await userStore.refreshMatchQueue();
          const queue = formatMatchQueue(userStore.matchQueue, userID);
          setMatchQueue(queue);
        }}
      />
      {matchQueue && matchQueue.length > 0 ? (
        <View
          style={{
            flex: 1,
          }}
        >
          {cards?.filter((card) => cards.indexOf(card) === 0)}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              marginHorizontal: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 64,
                height: 80,
                width: 80,
                marginHorizontal: 5,
              }}
              onPress={async () => {
                supabaseAPI.updateMatchLike({
                  matchID: matchQueue[0].match.match_id,
                  userPosition: matchQueue[0].userPosition,
                  like: false,
                });
                setMatchQueue(matchQueue.slice(1));
              }}
            >
              <Ionicons name={'heart-dislike'} size={44} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 64,
                height: 80,
                width: 80,
                marginHorizontal: 5,
              }}
              onPress={async () => {
                supabaseAPI.updateMatchLike({
                  matchID: matchQueue[0].match.match_id,
                  userPosition: matchQueue[0].userPosition,
                  like: true,
                });
                setMatchQueue(matchQueue.slice(1));
              }}
            >
              <Ionicons name={'heart'} size={44} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={{ textAlign: 'center' }}>
          No profiles match your filters, try expanding them!
        </Text>
      )}
    </View>
  );
}
