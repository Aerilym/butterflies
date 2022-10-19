import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supabaseAPI } from '../../provider/AuthProvider';
import type { Match, Profile } from '../../types/database';

export function SwipeCard({
  navigation,
  userID,
  match,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  userID: string;
  match: Match;
}) {
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const userPosition = match.user_id1 === userID ? 1 : 2;

  useEffect(() => {
    const profileID = userPosition === 1 ? match.user_id2 : match.user_id1;
    supabaseAPI.getProfile(profileID).then((profile) => {
      setProfile(profile);
    });
  }, []);
  return (
    <TouchableOpacity
      key={profile.user_id}
      onPress={() => {
        navigation.navigate('Profile', {
          profile,
        });
      }}
      style={{
        marginVertical: 20,
        marginHorizontal: 20,
        flex: 1,
        borderRadius: 12,
      }}
    >
      <ImageBackground
        source={{ uri: profile?.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg' }}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
        imageStyle={{
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32,
            }}
          >
            {profile?.display_name ?? ''}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            this is some bio info
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 10,
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
                  matchID: match.match_id,
                  userPosition,
                  like: true,
                });
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
                  matchID: match.match_id,
                  userPosition,
                  like: true,
                });
              }}
            >
              <Ionicons name={'heart'} size={44} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
