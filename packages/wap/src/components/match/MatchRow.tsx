import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

import { supabaseAPI } from '../../provider/AuthProvider';
import { FaceButton } from '../profile/FaceButton';
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
      key={match.match_id}
      onPress={() => {
        navigation.navigate('Chat', {
          matchID: match.match_id,
          userID,
          matchProfile: profile,
        });
      }}
      style={{
        flexDirection: 'row',
        marginVertical: 10,
      }}
    >
      <FaceButton
        profile={profile}
        navigation={navigation}
        size={80}
        style={{ marginHorizontal: 10 }}
      />
      <View>
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
    </TouchableOpacity>
  );
}
