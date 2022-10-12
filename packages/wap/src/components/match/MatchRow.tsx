import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

import { supabase } from '../../provider/AuthProvider';
import { FaceButton } from '../profile/FaceButton';
import type { Match, Profile } from '../../types/database';

export function MatchRow({
  navigation,
  match,
  userID,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  match: Match;
  userID: string;
}) {
  const [profile, setProfile] = useState<Profile>({} as Profile);

  const profileID = match.user_id1 === userID ? match.user_id2 : match.user_id1;

  async function fetchProfile() {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', profileID);

    const userProfile = data ? data[0] : {};

    setProfile(userProfile as Profile);
  }

  useEffect(() => {
    fetchProfile();
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
        <Text>this is the last message...</Text>
      </View>
    </TouchableOpacity>
  );
}
