import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native';

import { supabaseAPI } from '../../provider/AuthProvider';
import type { Match, Profile } from '../../types/database';

export function MatchCircle({
  navigation,
  match,
  userID,
  size,
  style,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  match: Match;
  userID: string;
  size: number;
  style?: StyleProp<ViewStyle>;
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
      style={style}
    >
      <Image
        style={{ width: size, height: size, borderRadius: size, backgroundColor: 'gray' }}
        source={{ uri: profile?.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg' }}
      />
    </TouchableOpacity>
  );
}
