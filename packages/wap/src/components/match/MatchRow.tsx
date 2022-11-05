import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Avatar, Text, TouchableOpacity, View } from 'react-native-ui-lib';

import { supabaseAPI } from '../../provider/AuthProvider';

import type { Match, Message, Profile } from '../../types/database';

export function MatchRow({
  navigation,
  match,
  message,
  userID,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  match: Match;
  message: Message;
  userID: string;
}) {
  const [profile, setProfile] = useState<Profile>({} as Profile);

  useEffect(() => {
    const profileID = match.user_id1 === userID ? match.user_id2 : match.user_id1;
    supabaseAPI.getProfile(profileID).then((profile) => {
      setProfile(profile);
    });
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Chat', {
          matchID: match.match_id,
          userID,
          matchProfile: profile,
        });
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      margin-s2
    >
      <Avatar
        source={{
          uri: profile?.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg',
        }}
        size={80}
        onPress={() =>
          navigation.navigate('Profile', {
            profile,
          })
        }
        containerStyle={{
          marginHorizontal: 10,
          flexGrow: 0,
        }}
      />

      <View style={{ flexGrow: 0 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          {profile?.display_name ?? ''}
        </Text>
        <Text>{message.text.length < 32 ? message.text : message.text.substring(32)}</Text>
      </View>

      <View
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Text>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</Text>
      </View>
    </TouchableOpacity>
  );
}
